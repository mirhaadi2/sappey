import { ProductVariant } from ".";

export type DrawerType = "description" | "benefits" | "nutrition" | null;

export interface DrawerButtonProps {
  label: string;
  onClick: () => void;
}

export interface BadgeProps {
  icon: React.ReactNode;
  text: React.ReactNode;
}

export interface ComingSoonPlaceholderProps {
  label: string;
}

export interface NotFoundStateProps {
  onBack: () => void;
}

export interface ProductDetailsInfoDrawerProps {
  product: any;
  activeDrawer: DrawerType;
  onClose: () => void;
}

export interface ProductHeaderProps {
  rating: number;
  reviewCount: number;
  name: string;
  selectedVariantData: any;
}

export interface ProductImageGalleryProps {
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
  badge?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  customer?: {
    name?: string;
  };
  createdAt: string;
  isVerified?: boolean;
}

export interface ProductReviewsSectionProps {
  reviews: Review[] | undefined;
  statistics: any;
  reviewsLoading: boolean;
}

export interface PurchaseSectionProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  isOutOfStock: boolean;
  selectedVariantData: any;
  product: any;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export interface RelatedProductsSectionProps {
  products: any[] | undefined;
  currentProductCategory: string;
  currentProductId: string;
}

export interface VariantSelectorProps {
  allVariants: ProductVariant[];
  selectedVariantId: string;
  onVariantSelect: (variantId: string) => void;
}

