<?php
$host = 'localhost';
$db   = 'studiomusicbuilder';
$user = 'root';
$pass = ''; // Default WAMP password
$charset = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Connect to MySQL server first to create DB if not exists
    $pdo = new PDO("mysql:host=$host;charset=$charset", $user, $pass, $options);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db`");
    $pdo->exec("USE `$db`");
} catch (\PDOException $e) {
    die("DB Connection failed: " . $e->getMessage());
}

// Pesapal Configuration
$pesapal_consumer_key = 'ngW+UEcnDhltUc5fxPfrCD987xMh3Lx8';
$pesapal_consumer_secret = 'q27RChYs5UkypdcNYKzuUw460Dg=';
$pesapal_ipn_id = 'c3c20000-d0cd-40ca-9f24-daee228440a6';
$pesapal_env = 'sandbox'; // Change to 'live' for production
