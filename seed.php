<?php
require 'config.php';

echo "Seeding database...\n";

$categories = [
    ['id' => 'cat_computer', 'name' => 'Computer', 'description' => 'The heart of your studio', 'icon' => 'Monitor', 'order' => 1],
    ['id' => 'cat_interface', 'name' => 'Audio Interface', 'description' => 'Connect your gear', 'icon' => 'Cable', 'order' => 2],
    ['id' => 'cat_mic', 'name' => 'Microphone', 'description' => 'Capture vocals and instruments', 'icon' => 'Mic', 'order' => 3],
    ['id' => 'cat_headphones', 'name' => 'Headphones', 'description' => 'Listen in detail', 'icon' => 'Headphones', 'order' => 4],
    ['id' => 'cat_daw', 'name' => 'DAW Software', 'description' => 'Record, edit, and mix', 'icon' => 'AppWindow', 'order' => 5],
];

$stmtCat = $pdo->prepare("INSERT IGNORE INTO categories (id, name, description, icon, display_order) VALUES (:id, :name, :description, :icon, :order)");

foreach ($categories as $cat) {
    $stmtCat->execute($cat);
}

$products = [
    [
        'id' => 'prod_macbook',
        'category_id' => 'cat_computer',
        'name' => 'MacBook Pro 14"',
        'description' => 'Apple M3 Pro chip with 18GB memory',
        'price' => 1999.00,
        'file_size' => 0,
        'features' => json_encode(['M3 Pro Chip', '18GB RAM', '512GB SSD']),
        'is_free' => 0
    ],
    [
        'id' => 'prod_win_pc',
        'category_id' => 'cat_computer',
        'name' => 'Custom PC Build',
        'description' => 'Intel i9, 32GB RAM, Noise-dampened case',
        'price' => 1500.00,
        'file_size' => 0,
        'features' => json_encode(['Intel i9', '32GB RAM', 'Quiet Operation']),
        'is_free' => 0
    ],
    [
        'id' => 'prod_scarlett',
        'category_id' => 'cat_interface',
        'name' => 'Focusrite Scarlett 2i2',
        'description' => '2-in, 2-out USB Audio Interface',
        'price' => 199.99,
        'file_size' => 0,
        'features' => json_encode(['2 Preamps', 'USB-C', 'Air Mode']),
        'is_free' => 0
    ],
    [
        'id' => 'prod_at2020',
        'category_id' => 'cat_mic',
        'name' => 'Audio-Technica AT2020',
        'description' => 'Cardioid Condenser Microphone',
        'price' => 99.00,
        'file_size' => 0,
        'features' => json_encode(['Cardioid Pattern', 'High SPL Handling']),
        'is_free' => 0
    ],
    [
        'id' => 'prod_logic',
        'category_id' => 'cat_daw',
        'name' => 'Logic Pro',
        'description' => 'Professional music production',
        'price' => 199.99,
        'file_size' => 35,
        'features' => json_encode(['Professional Tools', 'Massive Sound Library']),
        'is_free' => 0
    ],
    [
        'id' => 'prod_audacity',
        'category_id' => 'cat_daw',
        'name' => 'Audacity',
        'description' => 'Free, open source, cross-platform audio software',
        'price' => 0.00,
        'file_size' => 1,
        'features' => json_encode(['Open Source', 'Multi-track recording']),
        'is_free' => 1
    ]
];

$stmtProd = $pdo->prepare("INSERT IGNORE INTO products (id, category_id, name, description, price, file_size, features, is_free) VALUES (:id, :category_id, :name, :description, :price, :file_size, :features, :is_free)");

foreach ($products as $prod) {
    $stmtProd->execute($prod);
}

echo "Seeding complete.\n";
