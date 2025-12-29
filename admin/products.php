<?php
require 'includes/header.php';

$stmt = $pdo->query("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC");
$products = $stmt->fetchAll();

// Handle Delete
if (isset($_POST['delete_id'])) {
    $deleteId = $_POST['delete_id'];
    try {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$deleteId]);
        echo "<script>window.location.href='products.php';</script>";
        exit;
    } catch (PDOException $e) {
        $error = "Error deleting: " . $e->getMessage();
    }
}
?>

<div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 class="text-3xl font-bold text-white">Products</h2>
        <a href="product_form.php" class="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Add Product
        </a>
    </div>

    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-white/5 border-b border-white/10">
                    <tr>
                        <th class="p-4 text-slate-400 font-medium w-1/3 min-w-[200px]">Product Info</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Category</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Price</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Status</th>
                        <th class="p-4 text-slate-400 font-medium text-right whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                    <?php if (count($products) > 0): ?>
                        <?php foreach ($products as $product): ?>
                            <tr class="hover:bg-white/5 transition-colors group">
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <?php if (!empty($product['image'])): ?>
                                            <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                                                <img src="../<?= htmlspecialchars($product['image']) ?>" alt="" class="w-full h-full object-cover">
                                            </div>
                                        <?php else: ?>
                                            <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500">
                                                <i data-lucide="image" class="w-5 h-5"></i>
                                            </div>
                                        <?php endif; ?>
                                        <div>
                                            <div class="font-medium text-white"><?= htmlspecialchars($product['name']) ?></div>
                                            <div class="text-sm text-slate-500 truncate mt-1 max-w-[200px]"><?= htmlspecialchars($product['description']) ?></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4 text-slate-300"><?= htmlspecialchars($product['category_name']) ?></td>
                                <td class="p-4 text-white font-mono"><?= number_format($product['price'], 0) ?> Tsh</td>
                                <td class="p-4">
                                    <?php if ($product['is_free']): ?>
                                        <span class="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Free</span>
                                    <?php else: ?>
                                        <span class="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">Paid</span>
                                    <?php endif; ?>
                                </td>
                                <td class="p-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="product_form.php?id=<?= $product['id'] ?>" class="text-slate-400 hover:text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-lg transition-colors" title="Edit">
                                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                                        </a>
                                        <form method="POST" onsubmit="return confirm('Are you sure you want to delete this product?');" class="inline">
                                            <input type="hidden" name="delete_id" value="<?= $product['id'] ?>">
                                            <button type="submit" class="text-slate-400 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="5" class="p-8 text-center text-slate-500">No products found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require 'includes/footer.php'; ?>