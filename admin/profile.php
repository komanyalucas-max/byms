<?php
require 'includes/header.php';

$success = null;
$error = null;
$password_error = null;
$password_success = null;

// Fetch current admin data
$stmt = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
$stmt->execute([$_SESSION['admin_id']]);
$admin = $stmt->fetch();

if (!$admin) {
    die("Admin not found.");
}

// Handle Profile Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_profile'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];

    try {
        $stmt = $pdo->prepare("UPDATE admins SET name = ?, email = ? WHERE id = ?");
        $stmt->execute([$name, $email, $_SESSION['admin_id']]);

        // Refresh data
        $admin['name'] = $name;
        $admin['email'] = $email;

        $success = "Profile updated successfully!";
    } catch (PDOException $e) {
        $error = "Error updating profile: " . $e->getMessage();
    }
}

// Handle Password Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_password'])) {
    $current_password = $_POST['current_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    // Verify current password
    if (password_verify($current_password, $admin['password_hash'])) {
        if ($new_password === $confirm_password) {
            if (strlen($new_password) >= 6) {
                $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
                try {
                    $stmt = $pdo->prepare("UPDATE admins SET password_hash = ? WHERE id = ?");
                    $stmt->execute([$new_hash, $_SESSION['admin_id']]);
                    $password_success = "Password updated successfully!";
                } catch (PDOException $e) {
                    $password_error = "Error updating password: " . $e->getMessage();
                }
            } else {
                $password_error = "New password must be at least 6 characters long.";
            }
        } else {
            $password_error = "New passwords do not match.";
        }
    } else {
        $password_error = "Incorrect current password.";
    }
}
?>

<div>
    <h2 class="text-3xl font-bold text-white mb-6">Profile Settings</h2>

    <div class="grid lg:grid-cols-2 gap-8">
        <!-- Personal Details -->
        <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i data-lucide="user" class="w-5 h-5 text-cyan-400"></i>
                Personal Details
            </h3>

            <?php if ($success): ?>
                <div class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6">
                    <?= htmlspecialchars($success) ?>
                </div>
            <?php endif; ?>

            <?php if ($error): ?>
                <div class="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <form method="POST" class="space-y-6">
                <div>
                    <label class="block text-slate-400 text-sm font-medium mb-2">Full Name</label>
                    <input type="text" name="name" value="<?= htmlspecialchars($admin['name'] ?? '') ?>" required
                        class="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-slate-500">
                </div>

                <div>
                    <label class="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
                    <input type="email" name="email" value="<?= htmlspecialchars($admin['email']) ?>" required
                        class="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-slate-500">
                </div>

                <div class="pt-4">
                    <button type="submit" name="update_profile"
                        class="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>

        <!-- Security -->
        <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i data-lucide="lock" class="w-5 h-5 text-purple-400"></i>
                Security
            </h3>

            <?php if ($password_success): ?>
                <div class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6">
                    <?= htmlspecialchars($password_success) ?>
                </div>
            <?php endif; ?>

            <?php if ($password_error): ?>
                <div class="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6">
                    <?= htmlspecialchars($password_error) ?>
                </div>
            <?php endif; ?>

            <form method="POST" class="space-y-6">
                <div>
                    <label class="block text-slate-400 text-sm font-medium mb-2">Current Password</label>
                    <input type="password" name="current_password" required
                        class="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-slate-500">
                </div>

                <div>
                    <label class="block text-slate-400 text-sm font-medium mb-2">New Password</label>
                    <input type="password" name="new_password" required minlength="6"
                        class="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-slate-500">
                </div>

                <div>
                    <label class="block text-slate-400 text-sm font-medium mb-2">Confirm New Password</label>
                    <input type="password" name="confirm_password" required minlength="6"
                        class="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-slate-500">
                </div>

                <div class="pt-4">
                    <button type="submit" name="update_password"
                        class="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/20">
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require 'includes/footer.php'; ?>