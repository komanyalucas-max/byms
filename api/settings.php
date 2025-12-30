<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require '../config.php';

try {
    // Determine which settings are public safe
    $publicKeys = [
        'system_name',
        'system_logo',
        'payment_pesapal_enabled',
        'payment_offline_enabled',
        'contact_email',
        'contact_phone',
        'contact_whatsapp',
        'contact_address'
    ];

    // Construct placeholder string (?, ?, ?)
    $placeholders = implode(',', array_fill(0, count($publicKeys), '?'));

    $stmt = $pdo->prepare("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ($placeholders)");
    $stmt->execute($publicKeys);
    $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // Cast Booleans
    if (isset($settings['payment_pesapal_enabled'])) {
        $settings['payment_pesapal_enabled'] = (bool) $settings['payment_pesapal_enabled'];
    }
    if (isset($settings['payment_offline_enabled'])) {
        $settings['payment_offline_enabled'] = (bool) $settings['payment_offline_enabled'];
    }

    echo json_encode($settings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch settings']);
}
