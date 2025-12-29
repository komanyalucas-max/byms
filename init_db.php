<?php
require 'config.php';

$sql = file_get_contents('schema.sql');

try {
    // Split SQL by semicolons to execute multiple statements if needed, 
    // but PDO::exec() might handle it if driver supports it. 
    // Safest is to handle statement by statement or just try exec.
    // For schema.sql with multiple CREATE TABLE, exec might only run the first one if not configured properly.
    // Let's split.
    $statements = explode(';', $sql);
    foreach ($statements as $statement) {
        if (trim($statement)) {
            $pdo->exec($statement);
        }
    }
    echo "Database initialized successfully.\n";

    // Seed default admin
    $email = 'admin@gmail.com';
    $password = 'pass@123';
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() == 0) {
        $stmt = $pdo->prepare("INSERT INTO admins (email, password_hash) VALUES (?, ?)");
        $stmt->execute([$email, $hash]);
        echo "Default admin created.\n";
    } else {
        echo "Admin already exists.\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
