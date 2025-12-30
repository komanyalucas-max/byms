import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Order } from '../../services/orderService';

const API_BASE_URL = 'http://localhost/byms/api';

// Define types
export interface LibraryPack {
    id: string;
    name: string;
    description: string;
    fileSize: number;
    image?: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    fileSize: number;
    libraryPacks?: LibraryPack[];
    image?: string;
    price: number;
    category?: string;
}

export interface Category {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    products: Product[];
    helperText?: string;
}

export type StorageType = string; // Changed from enum to string to support dynamic types

export interface StorageOption {
    id: string;
    name: string;
    icon: string;
    description: string;
    options: {
        id: string;
        capacity: number;
        price: number;
    }[];
}

interface BuilderContextType {
    // Data
    categories: Category[];
    storageOptions: StorageOption[];
    isLoading: boolean;
    error: string | null;

    // Selection State
    selectedItems: Set<string>;
    selectedLibraryPacks: Set<string>;
    storageType: StorageType | null;
    storageCapacity: number | null;

    // Computed
    totalStorage: number;
    selectedProductObjects: Product[];
    selectedLibraryPackObjects: LibraryPack[];

    // Order State
    customerLocation: string;
    customerDetails: { name: string; email: string; phone: string };
    totalAmount: number;
    currentOrder: Order | null;
    totalPrice: number;

    // Actions
    toggleItem: (id: string) => void;
    toggleLibraryPack: (id: string) => void;
    setStorageType: (type: StorageType) => void;
    setStorageCapacity: (capacity: number | null) => void;
    setCustomerLocation: (location: string) => void;
    setCustomerDetails: (details: { name: string; email: string; phone: string }) => void;
    setTotalAmount: (amount: number) => void;
    setCurrentOrder: (order: Order | null) => void;
    // selectFreeStudio removed
    resetBuilder: () => void;
    getStoragePrice: (type: string | null, capacity: number | null) => number;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selectedLibraryPacks, setSelectedLibraryPacks] = useState<Set<string>>(new Set());
    const [storageType, setStorageType] = useState<StorageType | null>(null);
    const [storageCapacity, setStorageCapacity] = useState<number | null>(null);

    const [customerLocation, setCustomerLocation] = useState<string>('');
    const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '' });
    const [totalAmount, setTotalAmount] = useState(0);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [productsRes, storageRes, categoriesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/products.php`),
                    fetch(`${API_BASE_URL}/storage.php`),
                    fetch(`${API_BASE_URL}/categories.php`)
                ]);

                if (!productsRes.ok || !storageRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch data');

                const productsData: Product[] = await productsRes.json();
                const storageData: StorageOption[] = await storageRes.json();
                const categoriesData: any[] = await categoriesRes.json();

                setStorageOptions(storageData);

                // Map categories and filter their products
                const categoryList: Category[] = categoriesData.map(cat => ({
                    id: cat.id,
                    title: cat.name,
                    subtitle: cat.description || '',
                    icon: cat.icon || 'Library',
                    products: productsData.filter(p => p.category === cat.name) // api/products.php returns category name. 
                    // Wait, api/products.php returns 'category' field as name.
                    // But precise linking should be via ID if possible.
                    // Let's rely on name for now as I set it up that way, 
                    // OR ideally update api/products to return category_id.
                }));

                // Correction: My api/products.php returned mapped fields. 
                // It does NOT return category_id in the JSON output, only category name.
                // However, I can rely on the join name. 
                // Or I can just map them.

                setCategories(categoryList);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to connect to the server. Please ensure the backend is running.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleItem = (productId: string) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const toggleLibraryPack = (packId: string) => {
        setSelectedLibraryPacks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(packId)) {
                newSet.delete(packId);
            } else {
                newSet.add(packId);
            }
            return newSet;
        });
    };

    const totalStorage = useMemo(() => {
        let total = 0;
        categories.forEach(category => {
            category.products.forEach(product => {
                if (selectedItems.has(product.id)) {
                    total += product.fileSize;
                }
            });
        });
        return total;
    }, [categories, selectedItems]);

    const totalPrice = useMemo(() => {
        let total = 0;
        categories.forEach(category => {
            category.products.forEach(product => {
                if (selectedItems.has(product.id)) {
                    total += product.price || 0;
                }
            });
        });
        return total;
    }, [categories, selectedItems]);

    const getStoragePrice = (type: string | null, capacity: number | null) => {
        if (!type || !capacity) return 0;
        const typeOption = storageOptions.find(opt => opt.id === type);
        if (!typeOption) return 0;
        const capOption = typeOption.options.find(opt => opt.capacity === capacity);
        return capOption ? capOption.price : 0;
    };

    // Derived objects
    const selectedProductObjects = useMemo(() => {
        const products: Product[] = [];
        categories.forEach(category => {
            category.products.forEach(product => {
                if (selectedItems.has(product.id)) {
                    products.push(product);
                }
            });
        });
        return products;
    }, [categories, selectedItems]);

    const selectedLibraryPackObjects = useMemo(() => {
        // Placeholder as library packs not fully implemented in DB yet
        return [];
    }, []);



    const resetBuilder = () => {
        setSelectedItems(new Set());
        setSelectedLibraryPacks(new Set());
        setStorageType(null);
        setStorageCapacity(null);
        setCustomerLocation('');
        setCustomerDetails({ name: '', email: '', phone: '' });
        setTotalAmount(0);
        setCurrentOrder(null);
    };

    return (
        <BuilderContext.Provider value={{
            categories,
            storageOptions,
            isLoading,
            error,
            selectedItems,
            selectedLibraryPacks,
            storageType,
            storageCapacity,
            totalStorage,
            selectedProductObjects,
            selectedLibraryPackObjects,
            customerLocation,
            customerDetails,
            totalAmount,
            currentOrder,
            totalPrice,
            toggleItem,
            toggleLibraryPack,
            setStorageType,
            setStorageCapacity,
            setCustomerLocation,
            setCustomerDetails,
            setTotalAmount,
            setCurrentOrder,
            resetBuilder,
            getStoragePrice
        }}>
            {children}
        </BuilderContext.Provider>
    );
}

export function useBuilder() {
    const context = useContext(BuilderContext);
    if (context === undefined) {
        throw new Error('useBuilder must be used within a BuilderProvider');
    }
    return context;
}
