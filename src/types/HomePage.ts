import type { Product } from "./index";
import type {
  Hero,
  Section,
  InstagramPost as HomepageInstagramPost,
  HomepageData,
} from "../api/homepage";

export type HomePageData = HomepageData;

export type HeroSectionProps = {
  hero?: Hero;
};

export interface CollectionsSectionProps {
  categories: any[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  products: Product[];
  isLoading: boolean;
}

export interface BestsellersSectionProps {
  products: Product[];
  isLoading: boolean;
}

export interface HealthWellnessBannerProps {
  section?: Section;
  navigate: (path: string) => void;
}

export interface NewArrivalsSectionProps {
  products: Product[];
  isLoading: boolean;
}

export interface StorySectionProps {
  storySection?: Section;
}

export interface TestimonialItem {
  id: string;
  rating: number;
  comment?: string;
  customer?: {
    name?: string;
  };
  createdAt: string;
  isVerified?: boolean;
}

export interface TestimonialCarouselProps {
  testimonials: TestimonialItem[];
  isLoading: boolean;
}

export type InstagramPost = HomepageInstagramPost;

export interface InstagramSectionProps {
  section?: Section;
  posts: InstagramPost[];
}

export interface DynamicSectionProps {
  section: Section;
  navigate: (path: string) => void;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface CollectionFilters {
  categoryId?: string;
  limit: number;
  page: number;
}

export interface ProductGridSectionProps {
  sectionId?: string;
  title?: string;
  subtitle?: string;
  label?: string;
  products: Product[];
  isLoading: boolean;
  total: number;
  backgroundColor?: string;
  onViewAll?: () => void;
  showViewAllButton?: boolean;
  isCategoriesGrid?: boolean;
}

export interface SectionBannerProps {
  section: Section;
  label?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackDescription?: string;
  fallbackButtonText?: string;
  fallbackButtonLink?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}