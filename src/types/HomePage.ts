import { ReactNode } from "react";
import { Product } from "./index";

// API Response Types
export interface HomePageData {
  hero: Hero;
  sections: Section[];
}

export interface Hero {
  videoUrl?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  posterUrl?: string;
}

export interface Section {
  id: string;
  slug?: string;
  sectionType: string;
  isActive: boolean;
  backgroundImageUrl?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  content?: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption?: string;
  link?: string;
}

export interface FormattedTestimonial {
  id: string;
  rating: number;
  comment?: string;
  customer?: {
    name?: string;
  };
  createdAt: string;
  isVerified?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

// Component Props
export interface HeroSectionProps {
  hero: Hero | undefined;
}

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
  banner: Section | undefined;
}

export interface NewArrivalsSectionProps {
  products: Product[];
  isLoading: boolean;
}

export interface StorySectionProps {
  storySection: Section | undefined;
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

export interface InstagramFeedProps {
  posts: InstagramPost[];
}

export interface DynamicSectionProps {
  section: Section;
  navigate: (path: string) => void;
}

// Helper types
export interface CollectionFilters {
  categoryId?: string;
  limit: number;
  page: number;
}
