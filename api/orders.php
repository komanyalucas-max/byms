<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            file_put_contents(__DIR__ . '/../debug_log.txt', date('Y-m-d H:i:s') . " - Invalid JSON received\n", FILE_APPEND);
            throw new Exception("Invalid JSON");
        }

        // Log received data for debugging
        file_put_contents(__DIR__ . '/../debug_log.txt', date('Y-m-d H:i:s') . " - Order Payload: " . print_r($data, true) . "\n", FILE_APPEND);

        // Normalize data to handle potential nested structure from different client versions/calls
        $customerName = $data['customer_name'] ?? $data['customer']['name'] ?? null;
        $customerEmail = $data['customer_email'] ?? $data['customer']['email'] ?? null;
        $customerPhone = $data['customer_phone'] ?? $data['customer']['phone'] ?? null;
        $customerLocation = $data['customer_location'] ?? $data['customer']['location'] ?? null;

        // Handle items normalization
        $items = $data['items'];
        if (isset($data['items']['products']) || isset($data['items']['libraryPacks'])) {
            // Convert nested items object to flat array for DB insertion
            $items = [];
            if (!empty($data['items']['products'])) {
                foreach ($data['items']['products'] as $p) {
                    $items[] = [
                        'product_id' => $p['id'],
                        'product_name' => $p['name'],
                        'price' => $p['price']
                    ];
                }
            }
            if (!empty($data['items']['libraryPacks'])) {
                foreach ($data['items']['libraryPacks'] as $p) {
                    $items[] = [
                        'product_id' => $p['id'],
                        'product_name' => $p['name'],
                        'price' => 0
                    ];
                }
            }
        }

        // Validation based on normalized variables
        if (empty($customerName) || empty($customerEmail)) {
            throw new Exception("Customer Name and Email are required");
        }
        if (empty($items) || !is_array($items)) {
            throw new Exception("Order must contain items");
        }

        // Basic validation
        // Expected data: { items: [], customer_name, customer_email, total_amount, user_id (optional) }

        $pdo->beginTransaction();

        $orderId = uniqid('ord_');
        $stmt = $pdo->prepare("INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone, customer_location, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')");
        $stmt->execute([
            $orderId,
            $data['user_id'] ?? null,
            $customerName,
            $customerEmail,
            $customerPhone,
            $customerLocation,
            $data['total_amount']
        ]);

        if (!empty($items)) {
            $stmtItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, price) VALUES (?, ?, ?, ?)");
            foreach ($items as $item) {
                $stmtItem->execute([
                    $orderId,
                    $item['product_id'],
                    $item['product_name'] ?? 'Unknown Product',
                    $item['price']
                ]);
            }
        }

        // Commit transaction
        $pdo->commit();

        // Send Notifications (Fire and forget, or wait? PHP blocks, so we wait)
        // In production, queue this.
        require_once __DIR__ . '/../admin/includes/notifications.php';
        try {
            // Assuming customer email and total amount are available from $data
            // Assuming customer phone might not be present, so passing null
            notify_order_created($pdo, $orderId, $customerEmail, $customerPhone, $data['total_amount']);
        } catch (Exception $e) {
            // Don't fail the order just because notification failed
            error_log("Notification Error: " . $e->getMessage());
        }

        echo json_encode([
            'success' => true,
            'orderId' => $orderId,
            'message' => 'Order created successfully'
        ]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
