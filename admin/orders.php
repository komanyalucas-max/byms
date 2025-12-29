<?php
require 'includes/header.php';

$stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
$orders = $stmt->fetchAll();
?>

<div>
    <h2 class="text-3xl font-bold text-white mb-6">Orders</h2>

    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <table class="w-full text-left">
            <thead class="bg-white/5 border-b border-white/10">
                <tr>
                    <th class="p-4 text-slate-400 font-medium">Order ID</th>
                    <th class="p-4 text-slate-400 font-medium">Customer</th>
                    <th class="p-4 text-slate-400 font-medium">Amount</th>
                    <th class="p-4 text-slate-400 font-medium">Status</th>
                    <th class="p-4 text-slate-400 font-medium">Date</th>
                    <th class="p-4 text-slate-400 font-medium text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
                <?php if (count($orders) > 0): ?>
                    <?php foreach ($orders as $order): ?>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-4 text-slate-400 font-mono text-sm">#<?= substr($order['id'] ?? '', 0, 8) ?></td>
                            <td class="p-4">
                                <div class="text-white font-medium"><?= htmlspecialchars($order['customer_name'] ?? '') ?></div>
                                <div class="text-slate-500 text-xs"><?= htmlspecialchars($order['customer_email'] ?? '') ?></div>
                            </td>
                            <td class="p-4 text-white"><?= number_format($order['total_amount'] ?? 0, 0) ?> Tsh</td>
                            <td class="p-4">
                                <?php
                                $statusColor = match ($order['status']) {
                                    'completed' => 'bg-emerald-500/10 text-emerald-400',
                                    'pending' => 'bg-amber-500/10 text-amber-400',
                                    'cancelled' => 'bg-rose-500/10 text-rose-400',
                                    default => 'bg-slate-500/10 text-slate-400'
                                };
                                ?>
                                <span class="px-2 py-1 rounded-full text-xs font-medium <?= $statusColor ?>">
                                    <?= ucfirst($order['status']) ?>
                                </span>
                            </td>
                            <td class="p-4 text-slate-400 text-sm"><?= date('M j, Y', strtotime($order['created_at'])) ?></td>
                            <td class="p-4 text-right">
                                <a href="order_details.php?id=<?= $order['id'] ?>" class="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-2 rounded-lg transition-colors inline-block">
                                    View Details
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="6" class="p-8 text-center text-slate-500">No orders found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require 'includes/footer.php'; ?>