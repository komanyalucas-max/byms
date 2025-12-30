<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../config.php';

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (
        !empty($data->name) &&
        !empty($data->email) &&
        !empty($data->message)
    ) {
        // Sanitize
        $name = htmlspecialchars(strip_tags($data->name));
        $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
        $message = htmlspecialchars(strip_tags($data->message));

        // Validate Email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid email format."]);
            exit;
        }

        try {
            // Save to messages table
            // First check if table exists, or create it. Ideally this is done in migration, but we'll do safety check here or assume exists.
            // Let's create it if not exists for robustness as user wants "managed from backend". admin/messages.php will read this.

            // Check if table exists (quick hack for single file migration)
            $pdo->exec("CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )");

            $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");
            if ($stmt->execute([$name, $email, $message])) {
                http_response_code(201);
                echo json_encode(["message" => "Message sent successfully."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to send message."]);
            }
        } catch (PDOException $e) {
            http_response_code(503);
            echo json_encode(["message" => "Database error: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data. Please provide name, email, and message."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
