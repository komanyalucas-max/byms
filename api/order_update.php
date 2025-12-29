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

        if (!$data || !isset($data['orderId'])) {
            throw new Exception("Invalid Data");
        }

        $orderId = $data['orderId'];
        $status = $data['status'] ?? null;
        $paymentMethod = $data['paymentMethod'] ?? null;
        $trackingId = $data['trackingId'] ?? null;

        $updates = [];
        $params = [];

        if ($status) {
            $updates[] = "status = ?";
            $params[] = $status;
        }
        if ($paymentMethod) {
            // Check if column exists or add it? 
            // Assuming column exists or we might fail. 
            // User requested payment settings improvement, we should ensure DB has this.
            // But let's check schema/add migration if needed.
            // For now, let's assume valid or skip if column missing (but we want it).
            // Let's rely on update_schema logic or run a query to add it if missing?
            // Safer to just try update, wrap in try-catch if field missing?
            // No, SQL error will occur.
            // We should ensure the column exists.
            $updates[] = "payment_method = ?";
            $params[] = $paymentMethod;
        }
        if ($trackingId) { // Store plain text tracking ID if needed, usually just log or status
            // pesapal_tracking_id?
            // Let's assume we might need to add this column too.
            // checks below.
        }

        if (empty($updates)) {
            echo json_encode(['success' => true, 'message' => 'No changes provided']);
            exit;
        }

        // Add payment_method column if not exists (Hack for dev, ideally separate migration)
        // But for this environment, executing it here once is convenient.
        try {
            $pdo->query("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT NULL");
        } catch (Exception $e) { /* Ignore if exists */
        }

        // Add pesapal_tracking_id
        try {
            $pdo->query("ALTER TABLE orders ADD COLUMN pesapal_tracking_id VARCHAR(100) DEFAULT NULL");
        } catch (Exception $e) { /* Ignore if exists */
        }

        // Construct Query
        // Refine update logic for tracking ID
        if ($trackingId) {
            $updates[] = "pesapal_tracking_id = ?";
            $params[] = $trackingId;
        }

        $params[] = $orderId;
        $sql = "UPDATE orders SET " . implode(', ', $updates) . " WHERE id = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        // Notify if paid?
        if ($status === 'paid' || $status === 'completed') {
            require_once __DIR__ . '/../admin/includes/notifications.php';
            // Fetch order details for notification
            $stmtOrder = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
            $stmtOrder->execute([$orderId]);
            $order = $stmtOrder->fetch();
            if ($order) {
                // Send "Payment Received" notification
                // notify_payment_received($pdo, $orderId, $order['customer_email'], $order['total_amount']);
                // Assuming notify_order_created covers mostly "new order", we can reuse sending mechanism or add new one.
                // For now, let's just log or rely on initial notification.
                // Or call send_email_notification manually.
                $subject = "Payment Received: Order #$orderId";
                $message = "We have received your payment for Order #$orderId.\nAmount: {$order['total_amount']}\nStatus: $status";
                send_email_notification($order['customer_email'], $subject, $message);
            }
        }

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
