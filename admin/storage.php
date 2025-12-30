<?php
require 'includes/header.php';

// Fetch storage options
$stmt = $pdo->query("SELECT * FROM storage_options ORDER BY type ASC, capacity ASC");
$storageItems = $stmt->fetchAll();

// Handle Delete
if (isset($_POST['delete_id'])) {
    $deleteId = $_POST['delete_id'];
    try {
        $stmt = $pdo->prepare("DELETE FROM storage_options WHERE id = ?");
        $stmt->execute([$deleteId]);
        echo "<script>window.location.href = 'storage.php';</script>";
        exit;
    } catch (PDOException $e) {
        $error = "Error deleting: " . $e->getMessage();
    }
}
?>

<div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 class="text-3xl font-bold text-white">Storage Managers</h2>
        <a href="storage_form.php" class="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Add Storage
        </a>
    </div>

    <?php if (isset($error)): ?>
        <div class="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-white/5 border-b border-white/10">
                    <tr>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Type</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Name</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Capacity</th>
                        <th class="p-4 text-slate-400 font-medium whitespace-nowrap">Price</th>
                        <th class="p-4 text-slate-400 font-medium text-right whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                    <?php if (count($storageItems) > 0): ?>
                        <?php foreach ($storageItems as $item): ?>
                            <tr class="hover:bg-white/5 transition-colors group">
                                <td class="p-4 text-slate-300">
                                    <div class="flex items-center gap-2">
                                        <?php if (!empty($item['icon'])): ?>
                                            <i data-lucide="<?= htmlspecialchars($item['icon']) ?>" class="w-4 h-4 text-slate-400"></i>
                                        <?php endif; ?>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                                            <?= htmlspecialchars(strtoupper($item['type'])) ?>
                                        </span>
                                    </div>
                                </td>
                                <td class="p-4 text-white font-medium"><?= htmlspecialchars($item['name']) ?></td>
                                <td class="p-4 text-slate-300"><?= $item['capacity'] >= 1000 ? ($item['capacity'] / 1000) . ' TB' : $item['capacity'] . ' GB' ?></td>
                                <td class="p-4 text-cyan-400 font-mono"><?= number_format($item['price'], 0) ?> Tsh</td>
                                <td class="p-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="storage_form.php?id=<?= $item['id'] ?>" class="text-slate-400 hover:text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-lg transition-colors" title="Edit">
                                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                                        </a>
                                        <form method="POST" onsubmit="return confirm('Are you sure you want to delete this storage option?');" class="inline">
                                            <input type="hidden" name="delete_id" value="<?= $item['id'] ?>">
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
                            <td colspan="5" class="p-8 text-center text-slate-500">No storage options found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require 'includes/footer.php'; ?>