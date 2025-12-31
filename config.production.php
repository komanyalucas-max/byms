<?php
// Production Database Configuration
$host = 'localhost'; // Usually 'localhost' on shared hosting, but verify with your host
$db   = 'soft_software';
$user = 'soft_music';
$pass = 'pLQZdk7hHtz2b@RV';
$charset = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, $options);
} catch (\PDOException $e) {
    // In production, don't echo detailed errors to the screen
    error_log("DB Connection failed: " . $e->getMessage());
    die("Database connection error. Please try again later.");
}

// Pesapal Configuration (LIVE)
$pesapal_consumer_key = 'YOUR_LIVE_CONSUMER_KEY'; // GET FROM PESAPAL DASHBOARD
$pesapal_consumer_secret = 'YOUR_LIVE_Consumer_SECRET'; // GET FROM PESAPAL DASHBOARD
$pesapal_ipn_id = 'YOUR_LIVE_IPN_ID'; // YOU MUST REGISTER A NEW IPN FOR LIVE URL
$pesapal_env = 'live';
