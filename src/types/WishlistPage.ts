import { WishlistItem } from "../context/WishlistContext";
import { Product, ProductVariant } from "./index";

export interface WishlistProductWithVariant extends Product {
    selectedVariant?: ProductVariant;
    wishlistItem?: WishlistItem;
}

export interface WishlistHeaderProps {
    wishlistCount: number;
    onBack: () => void;
}

export interface WishlistEmptyStateProps {
    onExplore: () => void;
}

export interface WishlistProductCardProps {
    product: WishlistProductWithVariant;
    onAddToCart: (product: WishlistProductWithVariant) => void;
    onRemove: (productId: string, variantId?: string) => void;
    onNavigate: (productId: string) => void;
}

export interface WishlistProductGridProps {
    products: WishlistProductWithVariant[];
    onAddToCart: (product: WishlistProductWithVariant) => void;
    onRemove: (productId: string, variantId?: string) => void;
    onNavigate: (productId: string) => void;
}

export interface WishlistSummarySidebarProps {
    wishlistCount: number;
    totalValue: number;
    onMoveAllToCart: () => void;
    onContinueBrowsing: () => void;
    onClearAll: () => void;
}