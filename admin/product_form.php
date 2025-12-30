<?php
require 'includes/header.php';

$id = $_GET['id'] ?? null;
$product = null;
$error = null;

// Fetch categories for dropdown
// Fetch categories for dropdown with hierarchy awareness
$catStmt = $pdo->query("
    SELECT c.id, c.name, c.parent_id, p.name as parent_name 
    FROM categories c 
    LEFT JOIN categories p ON c.parent_id = p.id 
    ORDER BY p.name ASC, c.name ASC
");
$categories = $catStmt->fetchAll();

// Fetch product if editing
if ($id) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        if (!$product) {
            die("Product not found");
        }

        // Decode features
        $product['features'] = json_decode($product['features'], true) ?? [];
        // Determine is_free (might come as 1/0 from DB)
        $product['is_free'] = (bool)$product['is_free'];
    } catch (PDOException $e) {
        $error = "Error fetching product: " . $e->getMessage();
    }
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $category_id = $_POST['category_id'] ?? '';
    $description = $_POST['description'] ?? '';
    $price = $_POST['price'] ?? 0;
    $is_free = isset($_POST['is_free']) ? 1 : 0;
    $file_size = $_POST['file_size'] ?? 0;

    // Process features (newline separated string -> array)
    $featuresRaw = $_POST['features'] ?? '';
    $featuresArray = array_filter(array_map('trim', explode("\n", $featuresRaw)));
    $featuresJson = json_encode(array_values($featuresArray));

    // Handle Image Upload
    $imagePath = $product['image'] ?? null; // Default to existing
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, $allowed)) {
            $filename = uniqid('img_') . '.' . $ext;
            $uploadDir = '../uploads/products/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename)) {
                $imagePath = 'uploads/products/' . $filename;
            }
        }
    }

    if ($name && $category_id) {
        try {
            if ($id) {
                // Update
                $stmt = $pdo->prepare("UPDATE products SET name = ?, category_id = ?, description = ?, price = ?, is_free = ?, features = ?, file_size = ?, image = ? WHERE id = ?");
                $stmt->execute([$name, $category_id, $description, $price, $is_free, $featuresJson, $file_size, $imagePath, $id]);
            } else {
                // Insert
                $newId = uniqid('prod_');
                $stmt = $pdo->prepare("INSERT INTO products (id, name, category_id, description, price, is_free, features, file_size, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$newId, $name, $category_id, $description, $price, $is_free, $featuresJson, $file_size, $imagePath]);
            }

            echo "<script>window.location.href='products.php';</script>";
            exit;
        } catch (PDOException $e) {
            $error = "Database Error: " . $e->getMessage();
        }
    } else {
        $error = "Name and Category are required";
    }
}
?>

<div class="max-w-4xl mx-auto">
    <div class="flex items-center gap-4 mb-8">
        <a href="products.php" class="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
        </a>
        <h1 class="text-3xl font-bold text-white"><?= $id ? 'Edit Product' : 'Add New Product' ?></h1>
    </div>

    <?php if ($error): ?>
        <div class="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <form method="POST" enctype="multipart/form-data" class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 space-y-8">

        <div class="grid md:grid-cols-2 gap-8">
            <!-- Left Column: Basic Info -->
            <div class="space-y-6">
                <!-- Image Upload -->
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Product Image</label>
                    <div class="flex items-start gap-4">
                        <?php if (!empty($product['image'])): ?>
                            <div class="w-20 h-20 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                                <img src="../<?= htmlspecialchars($product['image']) ?>" alt="Product" class="w-full h-full object-cover">
                            </div>
                        <?php endif; ?>
                        <div class="flex-1">
                            <input type="file" name="image" accept="image/*"
                                class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 transition-all cursor-pointer">
                            <p class="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
                    <input type="text" name="name" value="<?= htmlspecialchars($product['name'] ?? '') ?>" required
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select name="category_id" required
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none">
                        <option value="">Select Category</option>
                        <?php foreach ($categories as $cat): ?>
                            <?php
                            $displayName = $cat['name'];
                            if ($cat['parent_name']) {
                                $displayName = $cat['parent_name'] . ' > ' . $cat['name'];
                            }
                            ?>
                            <option value="<?= $cat['id'] ?>" <?= ($product['category_id'] ?? '') === $cat['id'] ? 'selected' : '' ?>>
                                <?= htmlspecialchars($displayName) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Price (Tsh)</label>
                        <input type="number" step="1" name="price" value="<?= htmlspecialchars($product['price'] ?? 0) ?>"
                            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">File Size (GB)</label>
                        <input type="number" step="0.1" name="file_size" value="<?= htmlspecialchars($product['file_size'] ?? 0) ?>"
                            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                    </div>
                </div>

                <div>
                    <label class="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 cursor-pointer">
                        <input type="checkbox" name="is_free" value="1" <?= ($product['is_free'] ?? false) ? 'checked' : '' ?>
                            class="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/50 bg-slate-800">
                        <span class="text-white font-medium">This is a Free Product</span>
                    </label>
                </div>
            </div>

            <!-- Right Column: Details -->
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea name="description"
                        class="rich-editor w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"><?= htmlspecialchars($product['description'] ?? '') ?></textarea>

                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Features (One per line)</label>
                    <textarea name="features" rows="6" placeholder="- 44.1kHz / 24-Bit WAV&#10;- 100% Royalty Free&#10;- Key Labeled"
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm"><?= htmlspecialchars(implode("\n", $product['features'] ?? [])) ?></textarea>
                </div>
            </div>
        </div>

        <div class="pt-6 border-t border-slate-700/50 flex items-center justify-end gap-4">
            <a href="products.php" class="px-6 py-3 text-slate-400 hover:text-white transition-colors">Cancel</a>
            <button type="submit" class="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                <?= $id ? 'Update Product' : 'Create Product' ?>
            </button>
        </div>
    </form>
</div>

<?php require 'includes/footer.php'; ?>