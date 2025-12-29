<?php
require 'includes/header.php';

// Stats
$stats = [
    'products' => $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn(),
    'categories' => $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn(),
    'orders' => $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn(),
    'revenue' => $pdo->query("SELECT SUM(total_amount) FROM orders WHERE status = 'completed'")->fetchColumn() ?: 0
];
?>

<div class="space-y-6 animate-fade-in">
    <header class="mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p class="text-slate-400">Welcome back. Here's what's happening today.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Products -->
        <a href="products.php" class="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all text-left group hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 block">
            <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                    <i data-lucide="package" class="w-6 h-6 text-purple-400"></i>
                </div>
                <span class="text-slate-400 text-sm">Total Products</span>
            </div>
            <div class="text-3xl font-bold text-white mb-1"><?= number_format($stats['products']) ?></div>
            <div class="text-purple-400 text-sm flex items-center gap-1">Manage Inventory →</div>
        </a>

        <!-- Categories -->
        <a href="categories.php" class="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all text-left group hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 block">
            <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-cyan-500/20 rounded-xl group-hover:bg-cyan-500/30 transition-colors">
                    <i data-lucide="folder-tree" class="w-6 h-6 text-cyan-400"></i>
                </div>
                <span class="text-slate-400 text-sm">Categories</span>
            </div>
            <div class="text-3xl font-bold text-white mb-1"><?= number_format($stats['categories']) ?></div>
            <div class="text-cyan-400 text-sm flex items-center gap-1">View Categories →</div>
        </a>

        <!-- Orders -->
        <a href="orders.php" class="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all text-left group hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10 block">
            <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
                    <i data-lucide="shopping-cart" class="w-6 h-6 text-emerald-400"></i>
                </div>
                <span class="text-slate-400 text-sm">Orders</span>
            </div>
            <div class="text-3xl font-bold text-white mb-1"><?= number_format($stats['orders']) ?></div>
            <div class="text-emerald-400 text-sm flex items-center gap-1">View Orders →</div>
        </a>

        <!-- Revenue -->
        <div class="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 group">
            <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-blue-500/20 rounded-xl">
                    <i data-lucide="bar-chart-3" class="w-6 h-6 text-blue-400"></i>
                </div>
                <span class="text-slate-400 text-sm">Revenue</span>
            </div>
            <div class="text-3xl font-bold text-white mb-1"><?= number_format($stats['revenue'], 0) ?> Tsh</div>
            <div class="text-blue-400 text-sm flex items-center gap-1">Lifetime Earnings</div>
        </div>
    </div>
</div>

<?php require 'includes/footer.php'; ?>