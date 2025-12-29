<?php
require 'includes/header.php';

$error = null;
$success = null;

// Fetch Settings
try {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
    $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
} catch (PDOException $e) {
    $error = "Error fetching settings: " . $e->getMessage();
}

// Handle Update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $allowed = [
            'system_name',
            'system_logo',
            'payment_pesapal_enabled',
            'payment_offline_enabled',
            'smtp_host',
            'smtp_port',
            'smtp_user',
            'smtp_pass',
            'twilio_sid',
            'twilio_token',
            'twilio_from',
            'admin_phone'
        ];

        $stmt = $pdo->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = ?");

        foreach ($allowed as $key) {
            // Handle logo upload separately
            if ($key === 'system_logo') {
                if (isset($_FILES['system_logo_file']) && $_FILES['system_logo_file']['error'] === UPLOAD_ERR_OK) {
                    $ext = strtolower(pathinfo($_FILES['system_logo_file']['name'], PATHINFO_EXTENSION));
                    if (in_array($ext, ['jpg', 'jpeg', 'png', 'svg', 'webp'])) {
                        $filename = 'logo_' . uniqid() . '.' . $ext;
                        $uploadDir = '../uploads/settings/';
                        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                        if (move_uploaded_file($_FILES['system_logo_file']['tmp_name'], $uploadDir . $filename)) {
                            $val = 'uploads/settings/' . $filename;
                            $stmt->execute([$val, $key]);
                            $settings[$key] = $val;
                            continue;
                        }
                    }
                }

                // If URL was manually entered or preserved (file input empty)
                if (isset($_POST[$key]) && !empty($_POST[$key])) {
                    // Only update if not overwritten by file above (continue skipped above if file uploaded)
                    $val = $_POST[$key];
                    $stmt->execute([$val, $key]);
                    $settings[$key] = $val;
                }
                continue;
            }

            // Handle checkboxes (boolean)
            if (in_array($key, ['payment_pesapal_enabled', 'payment_offline_enabled'])) {
                $val = isset($_POST[$key]) ? '1' : '0';
            } else {
                $val = $_POST[$key] ?? '';
            }
            // Update
            $stmt->execute([$val, $key]);

            // Update local array for immediate display
            $settings[$key] = $val;
        }

        $success = "Settings updated successfully.";
    } catch (PDOException $e) {
        $error = "Error updating settings: " . $e->getMessage();
    }
}
?>

<div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-white">General Settings</h1>
    </div>

    <?php if ($error): ?>
        <div class="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <?php if ($success): ?>
        <div class="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl mb-6">
            <?= htmlspecialchars($success) ?>
        </div>
    <?php endif; ?>

    <form method="POST" enctype="multipart/form-data" class="space-y-8">

        <!-- General System -->
        <section class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i data-lucide="settings" class="w-5 h-5 text-cyan-400"></i>
                System Information
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">System Name</label>
                    <input type="text" name="system_name" value="<?= htmlspecialchars($settings['system_name'] ?? '') ?>"
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">System Logo</label>
                    <div class="flex items-center gap-4">
                        <?php if (!empty($settings['system_logo'])): ?>
                            <div class="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                                <img src="../<?= htmlspecialchars($settings['system_logo']) ?>" class="max-w-full max-h-full object-contain">
                            </div>
                        <?php endif; ?>
                        <div class="flex-1">
                            <input type="file" name="system_logo_file" accept=".svg,.png,.jpg,.jpeg"
                                class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 transition-all cursor-pointer">
                            <!-- Hidden input to preserve existing URL if no file selected, handled by PHP logic checking DB/POST -->
                            <input type="text" name="system_logo" value="<?= htmlspecialchars($settings['system_logo'] ?? '') ?>" placeholder="Or enter URL..."
                                class="mt-2 w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Payment Methods -->
        <section class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i data-lucide="credit-card" class="w-5 h-5 text-purple-400"></i>
                Payment Methods
            </h2>
            <div class="space-y-4">
                <label class="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 cursor-pointer hover:border-purple-500/30 transition-colors">
                    <span class="text-white font-medium">Enable Pesapal (Online Payment)</span>
                    <input type="checkbox" name="payment_pesapal_enabled" value="1" <?= ($settings['payment_pesapal_enabled'] ?? '0') === '1' ? 'checked' : '' ?>
                        class="w-6 h-6 rounded border-slate-600 text-purple-500 focus:ring-purple-500/50 bg-slate-800">
                </label>
                <label class="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 cursor-pointer hover:border-purple-500/30 transition-colors">
                    <span class="text-white font-medium">Enable Offline Payment (Cash/Transfer)</span>
                    <input type="checkbox" name="payment_offline_enabled" value="1" <?= ($settings['payment_offline_enabled'] ?? '0') === '1' ? 'checked' : '' ?>
                        class="w-6 h-6 rounded border-slate-600 text-purple-500 focus:ring-purple-500/50 bg-slate-800">
                </label>
            </div>
        </section>

        <!-- SMTP Settings -->
        <section class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i data-lucide="mail" class="w-5 h-5 text-blue-400"></i>
                Email Settings (SMTP)
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">SMTP Host</label>
                    <input type="text" name="smtp_host" value="<?= htmlspecialchars($settings['smtp_host'] ?? '') ?>" placeholder="smtp.gmail.com"
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">SMTP Port</label>
                    <input type="text" name="smtp_port" value="<?= htmlspecialchars($settings['smtp_port'] ?? '') ?>" placeholder="587"
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">SMTP User</label>
                    <input type="text" name="smtp_user" value="<?= htmlspecialchars($settings['smtp_user'] ?? '') ?>"
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">SMTP Password</label>
                    <input type="password" name="smtp_pass" value="<?= htmlspecialchars($settings['smtp_pass'] ?? '') ?>"
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                </div>
            </div>
        </section>

        <!-- Twilio SMS -->
        <section class="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i data-lucide="message-square" class="w-5 h-5 text-emerald-400"></i>
                SMS Notifications (Twilio)
            </h2>
            <div class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Twilio Account SID</label>
                        <input type="text" name="twilio_sid" value="<?= htmlspecialchars($settings['twilio_sid'] ?? '') ?>"
                            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Twilio Auth Token</label>
                        <input type="password" name="twilio_token" value="<?= htmlspecialchars($settings['twilio_token'] ?? '') ?>"
                            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Twilio From Number</label>
                        <input type="text" name="twilio_from" value="<?= htmlspecialchars($settings['twilio_from'] ?? '') ?>" placeholder="+1234567890"
                            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Admin Phone (For Alerts)</label>
                        <input type="text" name="admin_phone" value="<?= htmlspecialchars($settings['admin_phone'] ?? '') ?>" placeholder="+255..."
                            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                    </div>
                </div>
            </div>
        </section>

        <div class="flex justify-end pt-4 pb-20">
            <button type="submit" class="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                Save Settings
            </button>
        </div>
    </form>
</div>

<?php require 'includes/footer.php'; ?>