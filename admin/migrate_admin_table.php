<?php
require_once __DIR__ . '/../config.php';

try {
    // Check if name column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM admins LIKE 'name'");
    if ($stmt->fetch()) {
        echo "Column 'name' already exists.\n";
    } else {
        // Add name column
        $pdo->exec("ALTER TABLE admins ADD COLUMN name VARCHAR(255) DEFAULT 'Admin User' AFTER id");
        echo "Column 'name' added successfully.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
