<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require '../config.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

$baseUrl = ($pesapal_env === 'log' || $pesapal_env === 'sandbox') ? 'https://cybqa.pesapal.com/pesapalv3' : 'https://pay.pesapal.com/v3';

function getPesapalToken($baseUrl, $key, $secret)
{
    $ch = curl_init("$baseUrl/api/Auth/RequestToken");
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json", "Accept: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "consumer_key" => $key,
        "consumer_secret" => $secret
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Fix for WAMP/Localhost

    $res = curl_exec($ch);

    if ($res === false) {
        // Log curl error
        error_log("Pesapal Token Curl Error: " . curl_error($ch));
        curl_close($ch);
        return null;
    }

    curl_close($ch);
    $data = json_decode($res, true);

    if (!isset($data['token'])) {
        error_log("Pesapal Token Error: " . $res);
    }

    return $data['token'] ?? null;
}

if ($action === 'submit-order') {
    $token = getPesapalToken($baseUrl, $pesapal_consumer_key, $pesapal_consumer_secret);
    if (!$token) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to authenticate with Pesapal. Check error logs or credentials.', 'status' => '500']);
        exit;
    }

    $orderData = $input['orderData'];

    $ch = curl_init("$baseUrl/api/Transactions/SubmitOrderRequest");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Accept: application/json",
        "Authorization: Bearer $token"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Fix for WAMP/Localhost

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Pass through response
    http_response_code($httpCode);
    echo $response;
} elseif ($action === 'get-status') {
    $token = getPesapalToken($baseUrl, $pesapal_consumer_key, $pesapal_consumer_secret);
    if (!$token) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to authenticate with Pesapal', 'status' => '500']);
        exit;
    }

    $trackingId = $input['orderTrackingId'];

    $ch = curl_init("$baseUrl/api/Transactions/GetTransactionStatus?orderTrackingId=$trackingId");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Accept: application/json",
        "Authorization: Bearer $token"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Fix for WAMP/Localhost

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    http_response_code($httpCode);
    echo $response;
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
}
