<?php
require_once __DIR__ . '/../config.php';

// Add customer_phone to orders table
try {
    $stmt = $pdo->query("SHOW COLUMNS FROM orders LIKE 'customer_phone'");
    if ($stmt->fetch()) {
        echo "Column 'customer_phone' already exists in orders.\n";
    } else {
        $pdo->exec("ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(50) AFTER customer_email");
        echo "Column 'customer_phone' added to orders.\n";
    }
} catch (PDOException $e) {
    echo "Error adding column: " . $e->getMessage() . "\n";
}

// Add customer_location to orders table
try {
    $stmt = $pdo->query("SHOW COLUMNS FROM orders LIKE 'customer_location'");
    if ($stmt->fetch()) {
        echo "Column 'customer_location' already exists in orders.\n";
    } else {
        $pdo->exec("ALTER TABLE orders ADD COLUMN customer_location VARCHAR(255) AFTER customer_phone");
        echo "Column 'customer_location' added to orders.\n";
    }
} catch (PDOException $e) {
    echo "Error adding column: " . $e->getMessage() . "\n";
}
