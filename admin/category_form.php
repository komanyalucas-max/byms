<?php
require 'includes/header.php';

$id = $_GET['id'] ?? null;
$category = null;
$error = null;

// Fetch category if editing
if ($id) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        $category = $stmt->fetch();

        if (!$category) {
            die("Category not found");
        }
    } catch (PDOException $e) {
        $error = "Error fetching category: " . $e->getMessage();
    }
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $icon = $_POST['icon'] ?? '';
    $description = $_POST['description'] ?? '';
    $display_order = $_POST['display_order'] ?? 0;
    $helper_text = $_POST['helper_text'] ?? '';

    if ($name) {
        try {
            if ($id) {
                // Update
                $stmt = $pdo->prepare("UPDATE categories SET name = ?, icon = ?, description = ?, display_order = ?, helper_text = ? WHERE id = ?");
                $stmt->execute([$name, $icon, $description, $display_order, $helper_text, $id]);
            } else {
                // Insert
                $newId = uniqid('cat_');
                $stmt = $pdo->prepare("INSERT INTO categories (id, name, icon, description, display_order, helper_text) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$newId, $name, $icon, $description, $display_order, $helper_text]);
            }

            // Redirect
            echo "<script>window.location.href='categories.php';</script>";
            exit;
        } catch (PDOException $e) {
            $error = "Database Error: " . $e->getMessage();
        }
    } else {
        $error = "Name is required";
    }
}
?>

<div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-4 mb-8">
        <a href="categories.php" class="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
        </a>
        <h1 class="text-3xl font-bold text-white"><?= $id ? 'Edit Category' : 'Add New Category' ?></h1>
    </div>

    <?php if ($error): ?>
        <div class="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <form method="POST" class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 space-y-6">

        <!-- Name -->
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
            <input type="text" name="name" value="<?= htmlspecialchars($category['name'] ?? '') ?>" required
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
        </div>

        <!-- Icon (Emoji) -->
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Icon (Emoji)</label>
            <input type="text" name="icon" value="<?= htmlspecialchars($category['icon'] ?? '') ?>" placeholder="e.g. 🎵"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
        </div>

        <!-- Description -->
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea name="description"
                class="rich-editor w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"><?= htmlspecialchars($category['description'] ?? '') ?></textarea>
        </div>

        <!-- Helper Text -->
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Helper Text (Optional)</label>
            <input type="text" name="helper_text" value="<?= htmlspecialchars($category['helper_text'] ?? '') ?>"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
        </div>

        <!-- Display Order -->
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Display Order</label>
            <input type="number" name="display_order" value="<?= htmlspecialchars($category['display_order'] ?? 0) ?>"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
        </div>

        <div class="pt-4 flex items-center justify-end gap-4">
            <a href="categories.php" class="px-6 py-3 text-slate-400 hover:text-white transition-colors">Cancel</a>
            <button type="submit" class="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                <?= $id ? 'Update Category' : 'Create Category' ?>
            </button>
        </div>
    </form>
</div>

<?php require 'includes/footer.php'; ?>