<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config.php';

try {
    // Fetch products with their category names
    $sql = "
        SELECT 
            p.*,
            c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    ";

    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process data to match frontend expectations
    $processed = array_map(function ($product) {
        $features = json_decode($product['features'] ?? '[]', true);

        // Base URL adjustment for images
        // Assuming the API is at /byms/api/products.php and images are at /byms/uploads/...
        // We can just return the relative path stored in DB (e.g., 'uploads/products/img_123.jpg')
        // The frontend can prepend the base URL or we do it here.
        // Let's prepend full URL for easier consumption.
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];
        $base = "{$protocol}://{$host}/byms/"; // Adjust if subfolder is different

        $imageUrl = $product['image'] ? $base . $product['image'] : null;

        return [
            'id' => $product['id'],
            'categoryId' => $product['category_id'],
            'name' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category_name'],
            'price' => (float)$product['price'],
            'isFree' => (bool)$product['is_free'],
            'fileSize' => (float)$product['file_size'], // Storing as GB in DB potentially? Frontend expects number.
            'image' => $imageUrl,
            'features' => is_array($features) ? $features : [],
            // 'libraryPacks' => [] // TODO: If library packs are a separate relation, fetch them here
        ];
    }, $products);

    echo json_encode($products ? $processed : []);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
