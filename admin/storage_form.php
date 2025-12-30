<?php
require 'includes/header.php';

$id = $_GET['id'] ?? null;
$item = null;
$error = null;

// Fetch item if editing
if ($id) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM storage_options WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch();

        if (!$item) {
            die("Storage option not found");
        }
    } catch (PDOException $e) {
        $error = "Error fetching storage option: " . $e->getMessage();
    }
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    // Generate slug from name if not provided (simple approach) or just ignore slug for now if not critical
    $type = $_POST['type'] ?? 'usb';
    $capacity = $_POST['capacity'] ?? 0;
    $price = $_POST['price'] ?? 0.00;
    $description = $_POST['description'] ?? '';
    $icon = $_POST['icon'] ?? '';

    // Validate
    if (!$name) $error = "Name is required";
    if (!$capacity) $error = "Capacity is required";

    if (!$error) {
        try {
            if ($id) {
                // Update
                $stmt = $pdo->prepare("UPDATE storage_options SET name = ?, type = ?, capacity = ?, price = ?, description = ?, icon = ? WHERE id = ?");
                $stmt->execute([$name, $type, $capacity, $price, $description, $icon, $id]);
            } else {
                // Insert
                $newId = uniqid('stg_');
                $stmt = $pdo->prepare("INSERT INTO storage_options (id, name, type, capacity, price, description, icon) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$newId, $name, $type, $capacity, $price, $description, $icon]);
            }

            // Redirect
            echo "<script>window.location.href='storage.php';</script>";
            exit;
        } catch (PDOException $e) {
            $error = "Database Error: " . $e->getMessage();
        }
    }
}
?>

<div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-4 mb-8">
        <a href="storage.php" class="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
        </a>
        <h1 class="text-3xl font-bold text-white"><?= $id ? 'Edit Storage Option' : 'Add New Storage Option' ?></h1>
    </div>

    <?php if ($error): ?>
        <div class="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <form method="POST" class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 space-y-6">

        <!-- Name -->
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input type="text" name="name" value="<?= htmlspecialchars($item['name'] ?? '') ?>" required
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g. Kingston USB Stick 64GB">
        </div>

        <!-- Icon -->
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Icon (Lucide Name)</label>
            <input type="text" name="icon" value="<?= htmlspecialchars($item['icon'] ?? '') ?>"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g. usb, hard-drive, disc, zap">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Type -->
            <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <select name="type" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                    <?php
                    $types = [
                        'usb' => 'USB Flash Drive',
                        'hdd' => 'Hard Drive (HDD)',
                        'sata-ssd' => 'SATA SSD',
                        'nvme-ssd' => 'NVMe SSD'
                    ];
                    foreach ($types as $key => $label):
                    ?>
                        <option value="<?= $key ?>" <?= ($item['type'] ?? '') === $key ? 'selected' : '' ?>><?= $label ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Capacity -->
            <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Capacity (GB)</label>
                <input type="number" name="capacity" value="<?= htmlspecialchars($item['capacity'] ?? '') ?>" required
                    class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. 64">
            </div>
        </div>

        <!-- Price -->
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Price</label>
            <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">Tsh</span>
                <input type="number" step="1" name="price" value="<?= htmlspecialchars($item['price'] ?? '0') ?>"
                    class="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
            </div>
        </div>

        <!-- Description (Rich Text) -->
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea name="description"
                class="rich-editor w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"><?= htmlspecialchars($item['description'] ?? '') ?></textarea>
        </div>

        <div class="pt-4 flex items-center justify-end gap-4">
            <a href="storage.php" class="px-6 py-3 text-slate-400 hover:text-white transition-colors">Cancel</a>
            <button type="submit" class="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                <?= $id ? 'Update Storage' : 'Create Storage' ?>
            </button>
        </div>
    </form>
</div>

<?php require 'includes/footer.php'; ?>