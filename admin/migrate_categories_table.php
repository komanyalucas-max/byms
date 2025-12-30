<?php
require_once __DIR__ . '/../config.php';

try {
    // Check if parent_id column exists in categories
    $stmt = $pdo->query("SHOW COLUMNS FROM categories LIKE 'parent_id'");
    if (!$stmt->fetch()) {
        // Add parent_id column
        $pdo->exec("ALTER TABLE categories ADD COLUMN parent_id VARCHAR(50) NULL DEFAULT NULL AFTER id");
        $pdo->exec("ALTER TABLE categories ADD FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL");
        echo "Column 'parent_id' added to categories table successfully.\n";
    } else {
        echo "Column 'parent_id' already exists in categories table.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
