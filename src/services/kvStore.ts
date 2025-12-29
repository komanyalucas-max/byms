
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost/byms/api';

export interface KVRecord<T> {
    key: string;
    value: T;
}

export const kvStore = {
    async get<T>(key: string): Promise<T | null> {
        // Not used heavily in frontend for products/categories. 
        // Might be used for looking up an order by ID.
        // Implement if needed.
        return null;
    },

    async listByPrefix<T>(prefix: string): Promise<KVRecord<T>[]> {
        let url = '';
        if (prefix === 'product:') {
            url = `${API_BASE}/products.php`;
        } else if (prefix === 'category:') {
            url = `${API_BASE}/categories.php`;
        } else {
            return [];
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();

            // Map the flat data to KVRecord format
            return data.map((item: any) => ({
                key: `${prefix}${item.id}`,
                value: item
            }));
        } catch (error) {
            console.error("API Fetch Error", error);
            // Return empty array to avoid crashing UI, or rethrow? 
            // Original threw error.
            throw error;
        }
    },

    async set<T extends object>(key: string, value: T): Promise<void> {
        if (key.startsWith('order:')) {
            const response = await fetch(`${API_BASE}/orders.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(value)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Order creation failed: ${errText}`);
            }
        }
    },

    async delete(key: string): Promise<void> {
        console.warn('Delete not implemented in PHP migration');
    }
};
