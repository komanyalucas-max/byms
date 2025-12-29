<?php
session_start();

// If not logged in, redirect to login page
if (!isset($_SESSION['admin_id']) && basename($_SERVER['PHP_SELF']) !== 'login.php') {
    header('Location: login.php');
    exit;
}

// If logged in and visiting login page, redirect to index
if (isset($_SESSION['admin_id']) && basename($_SERVER['PHP_SELF']) === 'login.php') {
    header('Location: index.php');
    exit;
}
