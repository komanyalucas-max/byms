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
            throw new Exception("Invalid JSON");
        }

        // Basic validation
        // Expected data: { items: [], customer_name, customer_email, total_amount, user_id (optional) }

        $pdo->beginTransaction();

        $orderId = uniqid('ord_');
        $stmt = $pdo->prepare("INSERT INTO orders (id, user_id, customer_name, customer_email, total_amount, status) VALUES (?, ?, ?, ?, ?, 'pending')");
        $stmt->execute([
            $orderId,
            $data['user_id'] ?? null,
            $data['customer_name'],
            $data['customer_email'],
            $data['total_amount']
        ]);

        if (!empty($data['items'])) {
            $stmtItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, price) VALUES (?, ?, ?, ?)");
            foreach ($data['items'] as $item) {
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
            notify_order_created($pdo, $orderId, $data['customer_email'], $data['customer_phone'] ?? null, $data['total_amount']);
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
