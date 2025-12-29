<?php
require 'includes/header.php';

$id = $_GET['id'] ?? null;
$order = null;
$order_items = [];
$error = null;

if ($id) {
    try {
        // Fetch Order
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        $order = $stmt->fetch();

        if ($order) {
            // Fetch Items
            $stmtItems = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $stmtItems->execute([$id]);
            $order_items = $stmtItems->fetchAll();
        } else {
            die("Order not found");
        }
    } catch (PDOException $e) {
        $error = "Error fetching order: " . $e->getMessage();
    }
}

// Handle Status Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['status'])) {
    $newStatus = $_POST['status'];
    try {
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $id]);

        // Refresh
        echo "<script>window.location.href='order_details.php?id=$id';</script>";
        exit;
    } catch (PDOException $e) {
        $error = "Error updating status: " . $e->getMessage();
    }
}
?>

<div class="max-w-4xl mx-auto">
    <div class="flex items-center gap-4 mb-8">
        <a href="orders.php" class="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
        </a>
        <h1 class="text-3xl font-bold text-white">Order Details</h1>
    </div>

    <?php if ($error): ?>
        <div class="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <div class="grid md:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="md:col-span-2 space-y-6">
            <!-- Order Items -->
            <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 class="text-xl font-bold text-white mb-6">Order Items</h3>
                <div class="space-y-4">
                    <?php foreach ($order_items as $item): ?>
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                            <div>
                                <div class="font-medium text-white text-lg"><?= htmlspecialchars($item['product_name'] ?? 'Unknown Product') ?></div>
                                <div class="text-sm text-slate-400">Category: <?= htmlspecialchars($item['category_name'] ?? 'Unknown') ?></div>
                            </div>
                            <div class="mt-2 sm:mt-0 font-mono text-purple-300">
                                <?= number_format($item['price'] ?? 0, 0) ?> Tsh
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="mt-6 pt-6 border-t border-slate-700/50 flex justify-between items-center">
                    <span class="text-slate-400">Total Amount</span>
                    <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        <?= number_format($order['total_amount'] ?? 0, 0) ?> Tsh
                    </span>
                </div>
            </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
            <!-- Customer Info -->
            <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-white mb-4">Customer Info</h3>
                <div class="space-y-3">
                    <div>
                        <span class="block text-xs text-slate-500 uppercase tracking-wider">Name</span>
                        <span class="text-white"><?= htmlspecialchars($order['customer_name'] ?? 'N/A') ?></span>
                    </div>
                    <div>
                        <span class="block text-xs text-slate-500 uppercase tracking-wider">Email</span>
                        <span class="text-white break-all"><?= htmlspecialchars($order['customer_email'] ?? 'N/A') ?></span>
                    </div>
                    <div>
                        <span class="block text-xs text-slate-500 uppercase tracking-wider">Phone</span>
                        <span class="text-white"><?= htmlspecialchars($order['customer_phone'] ?? '-') ?></span>
                    </div>
                </div>
            </div>

            <!-- Status Management -->
            <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-white mb-4">Order Status</h3>
                <form method="POST">
                    <select name="status" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors mb-4 appearance-none">
                        <option value="pending" <?= $order['status'] === 'pending' ? 'selected' : '' ?>>Pending</option>
                        <option value="completed" <?= $order['status'] === 'completed' ? 'selected' : '' ?>>Completed</option>
                        <option value="cancelled" <?= $order['status'] === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
                    </select>
                    <button type="submit" class="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                        Update Status
                    </button>
                </form>
                <div class="mt-4 text-xs text-center text-slate-500">
                    Order created on <br>
                    <?= date('F j, Y \a\t g:i a', strtotime($order['created_at'])) ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require 'includes/footer.php'; ?>