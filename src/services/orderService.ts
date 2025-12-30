import { kvStore } from './kvStore';
import { Product, LibraryPack, StorageType } from '../types';

export interface OrderItem {
    type: 'product' | 'library-pack';
    id: string;
    name: string;
    price: number; // Assuming 0 for now as pricing logic is complex
}

export interface Order {
    id: string;
    customer: {
        name: string;
        location: string;
        email: string;
        phone: string;
    };
    items: {
        products: Product[];
        libraryPacks: LibraryPack[];
    };
    storage: {
        type: StorageType;
        capacity: number;
    };
    totalStorage: number;
    totalAmount: number; // Add price field
    status: 'pending_payment' | 'paid' | 'processing' | 'completed' | 'cancelled';
    paymentMethod?: 'pesapal' | 'other';
    pesapalTrackingId?: string; // Pesapal order tracking ID
    createdAt: string;
}

export const orderService = {
    async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
        // Prepare payload for backend
        const payload = {
            customer_name: order.customer.name,
            customer_email: order.customer.email,
            customer_phone: order.customer.phone,
            customer_location: order.customer.location,
            total_amount: order.totalAmount,
            items: [
                ...order.items.products.map(p => ({
                    product_id: p.id,
                    product_name: p.name,
                    price: p.price
                })),
                ...order.items.libraryPacks.map(p => ({
                    product_id: p.id,
                    product_name: p.name,
                    price: 0
                }))
            ]
        };

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost/byms/api'}/orders.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Failed to create order on server');
        }

        const result = await response.json();

        const newOrder: Order = {
            ...order,
            id: result.orderId,
            status: 'pending_payment',
            createdAt: new Date().toISOString(),
        };

        // Also save to local KV for fallback/history if needed
        await kvStore.set(`order:${result.orderId}`, newOrder);
        return newOrder;
    },

    async getOrder(id: string): Promise<Order | null> {
        return kvStore.get<Order>(`order:${id}`);
    },

    async updateOrderStatus(
        id: string,
        status: Order['status'],
        paymentMethod?: Order['paymentMethod'],
        pesapalTrackingId?: string
    ): Promise<void> {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost/byms/api'}/order_update.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: id,
                status,
                paymentMethod,
                trackingId: pesapalTrackingId
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }

        // Optimistically update local cache if we were using one, but kvStore is weak.
        // For now, rely on refetch if needed.
    },

    async getAllOrders(): Promise<Order[]> {
        const records = await kvStore.listByPrefix<Order>('order:');
        return records.map(r => r.value).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
};
