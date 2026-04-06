export interface ProductVariant {
    id: string;
    productId?: string;
    label?: string;
    price: number;
    originalPrice?: number;
    discountedPrice?: number;
    discountedPercent?: number;
    weight?: string | number;
    weightUnit?: string;
    sku?: string;
    status?: string;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    price?: number;
    originalPrice?: number;
    category: string;
    image?: string;
    images?: string[];
    badge?: string;
    description?: string;
    weight?: number;
    variants?: (string | ProductVariant)[];
    rating?: number;
    reviewCount?: number;
    nutrition?: (string | NutritionFact)[];
    reviews?: (string | Review)[];
    isNew?: boolean;
    isBestseller?: boolean;
    basePrice?: number;
    discountedPrice?: number;
    discountedPercent?: number;
}

export interface NutritionFact {
    label: string;
    value: string;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    variant: string | null | ProductVariant | any;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    color: string;
    textColor: string;
    image: string;
}

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

export interface User {
    id: string;
    email: string;
    phone: string;
    name: string;
    role: UserRole;
}