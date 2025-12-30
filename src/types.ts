export interface LibraryPack {
    id: string;
    name: string;
    description: string;
    fileSize: number;
    image?: string;
}

export interface Product {
    id: string;
    categoryId?: string;
    name: string;
    description: string;
    fileSize: number;
    libraryPacks?: LibraryPack[];
    image?: string;
    price: number;
    category?: string;
    isFree?: boolean;
}

export interface Category {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    products: Product[];
    helperText?: string;
    subCategories?: Category[];
}

export type StorageType = string;

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
