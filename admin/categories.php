<?php
require 'includes/header.php';

// Fetch categories with parent name
$stmt = $pdo->query("
    SELECT c.*, p.name as parent_name 
    FROM categories c 
    LEFT JOIN categories p ON c.parent_id = p.id 
    ORDER BY c.parent_id ASC, c.display_order ASC
");
$categories = $stmt->fetchAll();
?>

<?php
// Handle Delete
if (isset($_POST['delete_id'])) {
    $deleteId = $_POST['delete_id'];
    try {
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$deleteId]);
        echo "<script>
    window.location.href = 'categories.php';
</script>";
        exit;
    } catch (PDOException $e) {
        $error = "Error deleting: " . $e->getMessage();
    }
}
?>

<div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
            <h2 class="text-3xl font-bold text-white">Categories</h2>
            <p class="text-slate-400">Manage your product categories and sub-categories</p>
        </div>
        <a href="category_form.php" class="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Add Category
        </a>
    </div>

    <?php if (isset($error)): ?>
        <div class="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-6">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-white/5 border-b border-white/10">
                    <tr>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Icon</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Name</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Parent Category</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Description</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap text-center">Order</th>
                        <th class="p-4 text-slate-400 font-medium text-right whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                    <?php if (count($categories) > 0): ?>
                        <?php foreach ($categories as $category): ?>
                            <tr class="hover:bg-white/5 transition-colors group">
                                <td class="p-4 text-2xl w-16 text-center">
                                    <span class="inline-block p-2 bg-slate-800 rounded-lg"><?= $category['icon'] ?></span>
                                </td>
                                <td class="p-4 text-white font-medium">
                                    <?= htmlspecialchars($category['name']) ?>
                                    <?php if ($category['parent_id']): ?>
                                        <span class="ml-2 text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Sub-category</span>
                                    <?php endif; ?>
                                </td>
                                <td class="p-4 text-slate-300">
                                    <?php if ($category['parent_name']): ?>
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="corner-down-right" class="w-4 h-4 text-slate-500"></i>
                                            <?= htmlspecialchars($category['parent_name']) ?>
                                        </div>
                                    <?php else: ?>
                                        <span class="text-slate-600">-</span>
                                    <?php endif; ?>
                                </td>
                                <td class="p-4 text-slate-400 truncate max-w-xs text-sm"><?= htmlspecialchars($category['description']) ?></td>
                                <td class="p-4 text-white text-center font-mono"><?= $category['display_order'] ?></td>
                                <td class="p-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="category_form.php?id=<?= $category['id'] ?>" class="text-slate-400 hover:text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-lg transition-colors" title="Edit">
                                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                                        </a>
                                        <form method="POST" onsubmit="return confirm('Are you sure you want to delete this category? Products in this category will be unassigned.');" class="inline">
                                            <input type="hidden" name="delete_id" value="<?= $category['id'] ?>">
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
                            <td colspan="6" class="p-8 text-center text-slate-500">No categories found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require 'includes/footer.php'; ?>