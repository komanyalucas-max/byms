<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config.php';

try {
    $stmt = $pdo->query("SELECT * FROM storage_options ORDER BY type ASC, capacity ASC");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Group by type to match frontend structure? 
    // Actually the current frontend hardcodes a list. It might be better to return a flat list or grouped list.
    // Let's return a flat list and let frontend adapt, or even better, return the 'types' structure the frontend expects.

    // Frontend expects:
    /*
    [
      {
        id: 'usb',
        name: 'USB Flash Drive',
        icon: 'Usb', // Icon name
        capacities: [32, 64, 128],
        // ... colors etc
      }
    ]
    */

    // But since price depends on capacity, the frontend structure was:
    // array of types, each with array of capacities. 
    // And pricing logic was localized.

    // We want the backend to drive this.
    // Let's return all available underlying info so the frontend can build the UI.

    $grouped = [];

    foreach ($items as $item) {
        $type = $item['type'];
        if (!isset($grouped[$type])) {
            $grouped[$type] = [
                'id' => $type,
                // Derive display name from first item or map it? 
                // The item name is like "USB Flash Drive 32GB". We just want "USB Flash Drive"
                // Let's parse or just use a static map for nice display names if needed, 
                // OR add a 'display_name_prefix' to DB. For now, let's guess from the DB name.
                // Actually the DB has 'name' like "USB Flash Drive 32GB".
                'name' => preg_replace('/\s\d+(GB|TB)$/i', '', $item['name']),
                'icon' => $item['icon'] ?? 'hard-drive', // Default
                'description' => strip_tags($item['description']), // Strip HTML for the card subtitle
                'options' => []
            ];
        }

        $grouped[$type]['options'][] = [
            'id' => $item['id'],
            'capacity' => (int)$item['capacity'],
            'price' => (float)$item['price']
        ];
    }

    echo json_encode(array_values($grouped));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
