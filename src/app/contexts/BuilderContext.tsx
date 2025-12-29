import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { kvStore } from '../../services/kvStore';
import type { Product as DBProduct, Category as DBCategory } from '../../types';
import { Order } from '../../services/orderService';

// Define types (moved from StudioBuilder)
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
    isFree?: boolean;
    libraryPacks?: LibraryPack[];
    image?: string;
    price: number;
}

export interface Category {
    id: string;
    title: string;
    subtitle: string;
    icon: string; // Storing icon name as string to avoid component in context
    products: Product[];
    helperText?: string;
}

export type StorageType = 'usb' | 'hdd' | 'sata-ssd' | 'nvme-ssd' | null;

interface BuilderContextType {
    // Data
    categories: Category[];
    isLoading: boolean;
    error: string | null;

    // Selection State
    selectedItems: Set<string>;
    selectedLibraryPacks: Set<string>;
    storageType: StorageType;
    storageCapacity: number | null;

    // Computed
    totalStorage: number;
    selectedProductObjects: Product[];
    selectedLibraryPackObjects: LibraryPack[];

    // Order State
    customerLocation: string;
    customerDetails: { name: string; email: string };
    totalAmount: number;
    currentOrder: Order | null;
    totalPrice: number;

    // Actions
    toggleItem: (id: string) => void;
    toggleLibraryPack: (id: string) => void;
    setStorageType: (type: StorageType) => void;
    setStorageCapacity: (capacity: number | null) => void;
    setCustomerLocation: (location: string) => void;
    setCustomerDetails: (details: { name: string; email: string }) => void;
    setTotalAmount: (amount: number) => void;
    setCurrentOrder: (order: Order | null) => void;
    selectFreeStudio: () => void;
    resetBuilder: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selectedLibraryPacks, setSelectedLibraryPacks] = useState<Set<string>>(new Set());
    const [storageType, setStorageType] = useState<StorageType>(null);
    const [storageCapacity, setStorageCapacity] = useState<number | null>(null);

    const [customerLocation, setCustomerLocation] = useState<string>('');
    const [customerDetails, setCustomerDetails] = useState({ name: '', email: '' });
    const [totalAmount, setTotalAmount] = useState(0);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [categoriesData, productsData] = await Promise.all([
                    kvStore.listByPrefix<DBCategory>('category:'),
                    kvStore.listByPrefix<DBProduct>('product:')
                ]);

                const dbCategories = categoriesData.map(c => c.value).sort((a, b) => a.order - b.order);
                const dbProducts = productsData.map(p => p.value);

                const transformedCategories: Category[] = dbCategories.map(cat => {
                    const categoryProducts = dbProducts
                        .filter(p => p.category_id === cat.id)
                        .map(p => ({
                            id: p.id,
                            name: p.name,
                            description: p.description,
                            fileSize: p.file_size,
                            isFree: p.is_free,
                            price: p.price,
                            libraryPacks: [], // TODO: If library packs are stored in DB, fetch them
                            image: undefined
                        }));

                    return {
                        id: cat.id,
                        title: cat.name,
                        subtitle: cat.description,
                        icon: cat.icon || 'Library',
                        products: categoryProducts,
                        helperText: cat.helper_text
                    };
                });

                setCategories(transformedCategories);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load products. Please refresh the page.');
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
                    product.libraryPacks?.forEach(pack => {
                        if (selectedLibraryPacks.has(pack.id)) {
                            total += pack.fileSize;
                        }
                    });
                }
            });
        });
        return total;
    }, [categories, selectedItems, selectedLibraryPacks]);

    const totalPrice = useMemo(() => {
        let total = 0;
        categories.forEach(category => {
            category.products.forEach(product => {
                if (selectedItems.has(product.id)) {
                    total += product.price || 0;
                    // Note: Library packs currently don't have price in DB mapping or key yet, 
                    // if they did we would add them here.
                }
            });
        });
        return total;
    }, [categories, selectedItems]);

    // Derived objects for checkout/summary
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
        const packs: LibraryPack[] = [];
        categories.forEach(category => {
            category.products.forEach(product => {
                product.libraryPacks?.forEach(pack => {
                    if (selectedLibraryPacks.has(pack.id)) {
                        packs.push(pack);
                    }
                });
            });
        });
        return packs;
    }, [categories, selectedLibraryPacks]);

    const selectFreeStudio = () => {
        const freeItems = new Set<string>();
        categories.forEach(category => {
            category.products.forEach(product => {
                if (product.isFree) {
                    freeItems.add(product.id);
                }
            });
        });
        setSelectedItems(freeItems);
        setSelectedLibraryPacks(new Set());
    };

    const resetBuilder = () => {
        setSelectedItems(new Set());
        setSelectedLibraryPacks(new Set());
        setStorageType(null);
        setStorageCapacity(null);
        setCustomerLocation('');
        setCustomerDetails({ name: '', email: '' });
        setTotalAmount(0);
        setCurrentOrder(null);
    };

    return (
        <BuilderContext.Provider value={{
            categories,
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
            selectFreeStudio,
            resetBuilder
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
