<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../config.php';

$current_page = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        slate: {
                            950: '#020617'
                        }
                    }
                }
            }
        }
    </script>
</head>

<body class="bg-slate-950 text-white font-sans antialiased selection:bg-cyan-500/30 flex h-screen overflow-hidden">

    <?php
    // Fetch branding settings
    $brandName = 'StudioAdmin';
    $brandLogo = null;
    try {
        $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'system_name'");
        if ($row = $stmt->fetch()) $brandName = $row['setting_value'];

        $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'system_logo'");
        if ($row = $stmt->fetch()) $brandLogo = $row['setting_value'];
    } catch (Exception $e) { /* Ignore */
    }
    ?>
    <!-- Mobile Header -->
    <header class="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4">
        <div class="flex items-center gap-3">
            <?php if ($brandLogo): ?>
                <img src="../<?= htmlspecialchars($brandLogo) ?>" class="w-8 h-8 object-contain rounded-lg bg-white/5 p-0.5">
            <?php else: ?>
                <div class="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <i data-lucide="package" class="w-5 h-5 text-white"></i>
                </div>
            <?php endif; ?>
            <span class="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"><?= htmlspecialchars($brandName) ?></span>
        </div>
        <button id="mobile-menu-btn" class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
    </header>

    <!-- Sidebar Overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 hidden md:hidden transition-opacity duration-300 opacity-0"></div>

    <!-- Sidebar -->
    <aside id="sidebar" class="fixed top-0 left-0 z-50 h-screen w-72 bg-slate-900/95 backdrop-blur-2xl border-r border-white/10 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out md:static flex flex-col">
        <div class="p-6 h-20 flex items-center justify-between md:justify-center">
            <div class="flex items-center gap-3">
                <?php if ($brandLogo): ?>
                    <img src="../<?= htmlspecialchars($brandLogo) ?>" class="w-8 h-8 object-contain rounded-lg bg-white/5 p-0.5">
                <?php else: ?>
                    <div class="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <i data-lucide="package" class="w-5 h-5 text-white"></i>
                    </div>
                <?php endif; ?>
                <span class="font-bold text-xl tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"><?= htmlspecialchars($brandName) ?></span>
            </div>
            <button id="close-sidebar-btn" class="md:hidden p-2 text-slate-400 hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <?php
            $menu = [
                ['file' => 'index.php', 'label' => 'Overview', 'icon' => 'layout-dashboard'],
                ['file' => 'products.php', 'label' => 'Products', 'icon' => 'package'],
                ['file' => 'categories.php', 'label' => 'Categories', 'icon' => 'folder-tree'],
                ['file' => 'orders.php', 'label' => 'Orders', 'icon' => 'shopping-cart'],
                ['file' => 'settings.php', 'label' => 'General Settings', 'icon' => 'settings'],
            ];

            foreach ($menu as $item):
                $active = ($current_page === $item['file']);
                $baseClass = "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium relative overflow-hidden";
                $activeClass = $active
                    ? "text-white bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5";
                $iconClass = $active ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-300 transition-colors";
            ?>
                <a href="<?= $item['file'] ?>" class="<?= $baseClass ?> <?= $activeClass ?>">
                    <?php if ($active): ?>
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-r-full"></div>
                    <?php endif; ?>
                    <i data-lucide="<?= $item['icon'] ?>" class="w-5 h-5 <?= $iconClass ?>"></i>
                    <span><?= $item['label'] ?></span>
                </a>
            <?php endforeach; ?>
        </div>

        <div class="p-4 border-t border-white/10 bg-slate-900/50">
            <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">A</div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white truncate">Admin User</p>
                    <p class="text-xs text-slate-400 truncate">admin@gmail.com</p>
                </div>
            </div>
            <a href="logout.php" class="w-full flex items-center justify-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-all text-sm font-medium">
                <i data-lucide="log-out" class="w-4 h-4"></i>
                Sign Out
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 min-w-0 h-screen overflow-y-auto pt-20 md:pt-0">
        <div class="p-4 md:p-8 max-w-7xl mx-auto pb-20">