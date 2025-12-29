<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require '../config.php';

try {
    $stmt = $pdo->query("SELECT * FROM products");
    $products = $stmt->fetchAll();

    foreach ($products as &$product) {
        $product['features'] = json_decode($product['features']);
        $product['is_free'] = (bool)$product['is_free'];
        $product['price'] = (float)$product['price'];
        $product['file_size'] = (int)$product['file_size'];
    }

    echo json_encode($products);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
