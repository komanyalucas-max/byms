<?php
require 'config.php';
try {
    $pdo->exec("ALTER TABLE products ADD COLUMN image VARCHAR(255) DEFAULT NULL");
    echo "Column image added to products.";
} catch (PDOException $e) {
    echo "Error (might already exist): " . $e->getMessage();
}
