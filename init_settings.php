<?php
require 'config.php';

try {
    // Create Table
    $sql = "CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(50) UNIQUE NOT NULL,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    echo "Settings table created.\n";

    // Seed Data
    $defaults = [
        'system_name' => 'Studio Builder',
        'system_logo' => '',
        'payment_pesapal_enabled' => '1',
        'payment_offline_enabled' => '1',
        'smtp_host' => 'smtp.gmail.com',
        'smtp_port' => '587',
        'smtp_user' => '',
        'smtp_pass' => '',
        'twilio_sid' => '',
        'twilio_token' => '',
        'twilio_from' => '',
        'admin_phone' => ''
    ];

    $stmt = $pdo->prepare("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (:key, :value)");

    foreach ($defaults as $key => $value) {
        $stmt->execute([':key' => $key, ':value' => $value]);
    }
    echo "Settings seeded.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
