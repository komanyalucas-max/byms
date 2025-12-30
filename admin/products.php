<?php
require 'includes/header.php';

// ------------------------------------------------------------------
// 1. HANDLE ACTIONS
// ------------------------------------------------------------------

// Handle Delete
if (isset($_POST['delete_id'])) {
    $deleteId = $_POST['delete_id'];
    try {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$deleteId]);
        $success = "Product deleted successfully.";
    } catch (PDOException $e) {
        $error = "Error deleting: " . $e->getMessage();
    }
}

// ------------------------------------------------------------------
// 2. FILTERS & PAGINATION
// ------------------------------------------------------------------

$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$search = $_GET['search'] ?? '';
$categoryFilter = $_GET['category'] ?? '';
$limit = 5;
$offset = ($page - 1) * $limit;

// Fetch Categories for Filter (Grouped by Parent)
$stmt = $pdo->query("
    SELECT c.*, p.name as parent_name 
    FROM categories c 
    LEFT JOIN categories p ON c.parent_id = p.id 
    ORDER BY COALESCE(p.name, c.name), c.name
");
$allCategories = $stmt->fetchAll();

// Build Query Conditions
$whereConditions = [];
$params = [];

if ($search) {
    $whereConditions[] = "(p.name LIKE ? OR p.description LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

if ($categoryFilter) {
    // If selecting a parent, maybe we want to include children? 
    // For simplicity, strict match first. If user wants children, we might need a subquery.
    // Let's do strict match for now.
    $whereConditions[] = "p.category_id = ?";
    $params[] = $categoryFilter;
}

$whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";

// ------------------------------------------------------------------
// 3. FETCH DATA
// ------------------------------------------------------------------

// Total Count
$countSql = "SELECT COUNT(*) FROM products p $whereClause";
$stmtCount = $pdo->prepare($countSql);
$stmtCount->execute($params);
$totalProducts = $stmtCount->fetchColumn();
$totalPages = ceil($totalProducts / $limit);

// Fetch Records
$sql = "
    SELECT p.*, c.name as category_name, parent.name as parent_category_name
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN categories parent ON c.parent_id = parent.id
    $whereClause
    ORDER BY p.created_at DESC
    LIMIT $limit OFFSET $offset
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();
?>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 class="text-3xl font-bold text-white mb-1">Products</h2>
            <p class="text-slate-400">Manage your product catalog (<?= $totalProducts ?> total)</p>
        </div>
        <a href="product_form.php" class="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Add Product
        </a>
    </div>

    <!-- Feedback -->
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

    <!-- Search & Filter Bar -->
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
        <form method="GET" class="flex flex-col md:flex-row gap-4">
            <!-- Search -->
            <div class="relative flex-1">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"></i>
                <input
                    type="text"
                    name="search"
                    value="<?= htmlspecialchars($search) ?>"
                    placeholder="Search product name..."
                    class="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors">
            </div>

            <!-- Category Filter -->
            <div class="w-full md:w-64">
                <select name="category" class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer">
                    <option value="">All Categories</option>
                    <?php
                    // Organize categories for display
                    $groupedCats = [];
                    foreach ($allCategories as $cat) {
                        if (!$cat['parent_id']) {
                            $groupedCats[$cat['id']] = ['info' => $cat, 'children' => []];
                        }
                    }
                    foreach ($allCategories as $cat) {
                        if ($cat['parent_id'] && isset($groupedCats[$cat['parent_id']])) {
                            $groupedCats[$cat['parent_id']]['children'][] = $cat;
                        }
                    }

                    foreach ($groupedCats as $parent):
                    ?>
                        <option value="<?= $parent['info']['id'] ?>" <?= $categoryFilter === $parent['info']['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($parent['info']['name']) ?>
                        </option>
                        <?php foreach ($parent['children'] as $child): ?>
                            <option value="<?= $child['id'] ?>" class="text-slate-300" <?= $categoryFilter === $child['id'] ? 'selected' : '' ?>>
                                &nbsp;&nbsp;&nbsp;↳ <?= htmlspecialchars($child['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    <?php endforeach; ?>
                </select>
            </div>

            <button type="submit" class="px-6 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors">
                Filter
            </button>
            <?php if ($search || $categoryFilter): ?>
                <a href="products.php" class="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/20 transition-colors flex items-center justify-center">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </a>
            <?php endif; ?>
        </form>
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
                                            <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                                                <img src="../<?= htmlspecialchars($product['image']) ?>" alt="" class="w-full h-full object-cover">
                                            </div>
                                        <?php else: ?>
                                            <div class="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 border border-slate-700">
                                                <i data-lucide="image" class="w-6 h-6"></i>
                                            </div>
                                        <?php endif; ?>
                                        <div>
                                            <div class="font-medium text-white"><?= htmlspecialchars($product['name']) ?></div>
                                            <div class="text-sm text-slate-500 truncate mt-0.5 max-w-[200px]"><?= htmlspecialchars(strip_tags($product['description'])) ?></div>
                                            <?php if (!empty($product['file_size']) && $product['file_size'] > 0): ?>
                                                <div class="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                    <i data-lucide="hard-drive" class="w-3 h-3"></i>
                                                    <?= number_format($product['file_size'], 1) ?> GB
                                                </div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4 text-slate-300">
                                    <?php if ($product['parent_category_name']): ?>
                                        <div class="text-xs text-slate-500 mb-0.5"><?= htmlspecialchars($product['parent_category_name']) ?></div>
                                    <?php endif; ?>
                                    <div class="flex items-center gap-1.5">
                                        <?php if ($product['parent_category_name']): ?>
                                            <i data-lucide="corner-down-right" class="w-3 h-3 text-slate-500"></i>
                                        <?php endif; ?>
                                        <?= htmlspecialchars($product['category_name'] ?? 'Uncategorized') ?>
                                    </div>
                                </td>
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
                            <td colspan="5" class="p-12 text-center text-slate-500">
                                <i data-lucide="package-search" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
                                <p>No products found matching your search.</p>
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
                    <a href="?page=<?= $page - 1 ?>&search=<?= urlencode($search) ?>&category=<?= urlencode($categoryFilter) ?>" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
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
                    <a href="?page=<?= $page + 1 ?>&search=<?= urlencode($search) ?>&category=<?= urlencode($categoryFilter) ?>" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
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

<script>
    lucide.createIcons();
</script>

<?php require 'includes/footer.php'; ?>