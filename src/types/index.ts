export interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    images: string[];
    badge?: string;
    description: string;
    weight: string;
    variants: string[];
    rating: number;
    reviewCount: number;
    nutrition: NutritionFact[];
    reviews: Review[];
    isNew?: boolean;
    isBestseller?: boolean;
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
    variant: string | null;
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
    role: UserRole;
}