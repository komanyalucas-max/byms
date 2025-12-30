<?php
require 'includes/header.php';

// ------------------------------------------------------------------
// 1. HANDLE ACTIONS (CUD)
// ------------------------------------------------------------------

// POST specific actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // DELETE
    if (isset($_POST['delete_id'])) {
        try {
            $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
            $stmt->execute([$_POST['delete_id']]);
            $success = "Order deleted successfully.";
        } catch (PDOException $e) {
            $error = "Failed to delete order: " . $e->getMessage();
        }
    }
    // QUICK STATUS UPDATE (U)
    if (isset($_POST['order_id']) && isset($_POST['new_status'])) {
        try {
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$_POST['new_status'], $_POST['order_id']]);
            $success = "Order status updated.";
        } catch (PDOException $e) {
            $error = "Failed to update status: " . $e->getMessage();
        }
    }
}

// ------------------------------------------------------------------
// 2. FILTERS & PAGINATION
// ------------------------------------------------------------------

$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$search = $_GET['search'] ?? '';
$limit = 5;
$offset = ($page - 1) * $limit;

// Build Query Conditions
$whereClause = "";
$params = [];

if ($search) {
    $whereClause = "WHERE (o.id LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ?)";
    $params = ["%$search%", "%$search%", "%$search%"];
}

// ------------------------------------------------------------------
// 3. FETCH DATA (Search + Pagination)
// ------------------------------------------------------------------

// Total Count for Pagination
$countSql = "SELECT COUNT(DISTINCT o.id) FROM orders o $whereClause";
$stmtCount = $pdo->prepare($countSql);
$stmtCount->execute($params);
$totalOrders = $stmtCount->fetchColumn();
$totalPages = ceil($totalOrders / $limit);

// Fetch Records
$sql = "
    SELECT o.*, COUNT(oi.id) as item_count 
    FROM orders o 
    LEFT JOIN order_items oi ON o.id = oi.order_id 
    $whereClause
    GROUP BY o.id 
    ORDER BY o.created_at DESC
    LIMIT $limit OFFSET $offset
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();
?>

<div class="space-y-6">
    <!-- Header & Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 class="text-3xl font-bold text-white mb-1">Orders</h2>
            <p class="text-slate-400">Manage customer orders (<?= $totalOrders ?> total)</p>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
            <!-- Placeholder Create Button -->
            <!-- <a href="order_create.php" class="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25">
                <i data-lucide="plus" class="w-4 h-4"></i>
                New Order
            </a> -->
        </div>
    </div>

    <!-- Feedback Messages -->
    <?php if (isset($success)): ?>
        <div class="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            <?= htmlspecialchars($success) ?>
        </div>
    <?php endif; ?>
    <?php if (isset($error)): ?>
        <div class="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl flex items-center gap-3">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <!-- Search Bar -->
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
        <form method="GET" class="flex gap-2">
            <div class="relative flex-1">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"></i>
                <input
                    type="text"
                    name="search"
                    value="<?= htmlspecialchars($search) ?>"
                    placeholder="Search order ID, customer name or email..."
                    class="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors">
            </div>
            <button type="submit" class="px-6 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors">
                Search
            </button>
            <?php if ($search): ?>
                <a href="orders.php" class="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/20 transition-colors flex items-center justify-center">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </a>
            <?php endif; ?>
        </form>
    </div>

    <!-- Orders Table -->
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-white/5 border-b border-white/10">
                    <tr>
                        <th class="p-4 text-slate-400 font-medium">Order ID</th>
                        <th class="p-4 text-slate-400 font-medium">Customer</th>
                        <th class="p-4 text-slate-400 font-medium hidden md:table-cell">Location</th>
                        <th class="p-4 text-slate-400 font-medium text-center">Items</th>
                        <th class="p-4 text-slate-400 font-medium">Amount</th>
                        <th class="p-4 text-slate-400 font-medium">Status</th>
                        <th class="p-4 text-slate-400 font-medium">Date</th>
                        <th class="p-4 text-slate-400 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                    <?php if (count($orders) > 0): ?>
                        <?php foreach ($orders as $order): ?>
                            <tr class="hover:bg-white/5 transition-colors group">
                                <td class="p-4 text-slate-400 font-mono text-sm">
                                    <span title="<?= htmlspecialchars($order['id']) ?>">
                                        #<?= substr($order['id'] ?? '', 0, 8) ?>
                                    </span>
                                </td>
                                <td class="p-4">
                                    <div class="text-white font-medium"><?= htmlspecialchars($order['customer_name'] ?? 'N/A') ?></div>
                                    <div class="text-slate-500 text-xs"><?= htmlspecialchars($order['customer_email'] ?? '') ?></div>
                                    <?php if (!empty($order['customer_phone'])): ?>
                                        <div class="text-slate-500 text-xs"><?= htmlspecialchars($order['customer_phone']) ?></div>
                                    <?php endif; ?>
                                </td>
                                <td class="p-4 text-slate-300 text-sm hidden md:table-cell">
                                    <?= htmlspecialchars($order['customer_location'] ?? '-') ?>
                                </td>
                                <td class="p-4 text-slate-300 text-sm text-center">
                                    <span class="bg-slate-800 px-2 py-1 rounded-full text-xs font-semibold border border-slate-700">
                                        <?= $order['item_count'] ?>
                                    </span>
                                </td>
                                <td class="p-4 text-white font-medium">
                                    <?= number_format($order['total_amount'] ?? 0, 0) ?> <span class="text-xs text-slate-500">Tsh</span>
                                </td>
                                <td class="p-4">
                                    <!-- Quick Status Toggle -->
                                    <form method="POST" class="inline-block">
                                        <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                                        <input type="hidden" name="search" value="<?= htmlspecialchars($search) ?>">
                                        <input type="hidden" name="page" value="<?= $page ?>">

                                        <?php
                                        $statusClass = match ($order['status']) {
                                            'completed', 'paid' => 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                                            'pending', 'pending_payment' => 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                                            'cancelled' => 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                                            'processing' => 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                            default => 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                        };
                                        ?>

                                        <select
                                            name="new_status"
                                            onchange="this.form.submit()"
                                            class="appearance-none cursor-pointer pl-3 pr-8 py-1 rounded-full text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-transparent <?= $statusClass ?>">
                                            <option class="bg-slate-900 text-slate-300" value="pending_payment" <?= $order['status'] === 'pending_payment' ? 'selected' : '' ?>>Pending Payment</option>
                                            <option class="bg-slate-900 text-slate-300" value="processing" <?= $order['status'] === 'processing' ? 'selected' : '' ?>>Processing</option>
                                            <option class="bg-slate-900 text-slate-300" value="paid" <?= $order['status'] === 'paid' ? 'selected' : '' ?>>Paid</option>
                                            <option class="bg-slate-900 text-slate-300" value="completed" <?= $order['status'] === 'completed' ? 'selected' : '' ?>>Completed</option>
                                            <option class="bg-slate-900 text-slate-300" value="cancelled" <?= $order['status'] === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
                                        </select>
                                    </form>
                                </td>
                                <td class="p-4 text-slate-400 text-sm whitespace-nowrap">
                                    <?= date('M j, Y', strtotime($order['created_at'])) ?>
                                </td>
                                <td class="p-4">
                                    <div class="flex justify-end gap-2">
                                        <a href="order_details.php?id=<?= $order['id'] ?>" class="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors" title="View Details">
                                            <i data-lucide="eye" class="w-4 h-4"></i>
                                        </a>
                                        <form method="POST" onsubmit="return confirm('Are you sure you want to delete this order?');">
                                            <input type="hidden" name="delete_id" value="<?= $order['id'] ?>">
                                            <button type="submit" class="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors" title="Delete Order">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="8" class="p-12 text-center text-slate-500">
                                <i data-lucide="inbox" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
                                <p>No orders found matching your search.</p>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Pagination -->
    <?php if ($totalPages > 1): ?>
        <div class="flex justify-center mt-6">
            <div class="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/50">
                <!-- Previous -->
                <?php if ($page > 1): ?>
                    <a href="?page=<?= $page - 1 ?>&search=<?= urlencode($search) ?>" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <i data-lucide="chevron-left" class="w-5 h-5"></i>
                    </a>
                <?php else: ?>
                    <span class="p-2 text-slate-600 cursor-not-allowed">
                        <i data-lucide="chevron-left" class="w-5 h-5"></i>
                    </span>
                <?php endif; ?>

                <!-- Page Numbers -->
                <div class="flex items-center px-4 font-mono text-sm text-slate-300">
                    Page <span class="text-white font-bold mx-2"><?= $page ?></span> of <span class="text-slate-500 mx-2"><?= $totalPages ?></span>
                </div>

                <!-- Next -->
                <?php if ($page < $totalPages): ?>
                    <a href="?page=<?= $page + 1 ?>&search=<?= urlencode($search) ?>" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <i data-lucide="chevron-right" class="w-5 h-5"></i>
                    </a>
                <?php else: ?>
                    <span class="p-2 text-slate-600 cursor-not-allowed">
                        <i data-lucide="chevron-right" class="w-5 h-5"></i>
                    </span>
                <?php endif; ?>
            </div>
        </div>
    <?php endif; ?>

</div>

<!-- Initialize Lucide Icons again just in case dynamic content loaded -->
<script>
    lucide.createIcons();
</script>

<?php require 'includes/footer.php'; ?>