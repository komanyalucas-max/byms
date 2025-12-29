export interface Product {
    id: string;
    category_id: string;
    name: string;
    description: string;
    file_size: number;
    is_free: boolean;
    price: number;
    features: string[];
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    name_sw?: string;
    description: string;
    icon?: string;
    helper_text?: string;
    order: number;
    created_at: string;
}

export interface OrderItem {
    product_id: string;
    product_name: string;
    price: number;
}

export interface Order {
    id: string;
    user_id: string;
    customer_name: string;
    customer_email: string;
    items: OrderItem[];
    total_amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
}
