import { apiMethods } from './index';
import { useQuery } from '@tanstack/react-query';

export interface Banner {
  id: string;
  title: string;
  text: string;
  subtitle: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Hero {
  id: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  buttonText: string;
  buttonUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  sectionType: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImageUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  imageUrl?: string;
  rating: number;
  comment?: string;
  author?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption?: string;
  postUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsitePage {
  id: string;
  slug: string;
  title: string;
  content: string;
  body?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageData {
  banners: Banner[];
  hero: Hero[];
  sections: Section[];
  testimonials: Testimonial[];
  instagramPosts: InstagramPost[];
}

const BASE_URL = '/homepage';
const PAGES_URL = '/homepage/pages';

export const homepageApi = {
  getHomepageData: async (): Promise<HomepageData> => {
    const response = await apiMethods.get(`${BASE_URL}`);
    return response.data.data;
  },
  getPages: async (): Promise<WebsitePage[]> => {
    const response = await apiMethods.get(`${PAGES_URL}`);
    return response.data.data;
  },
  getPageBySlug: async (slug: string): Promise<WebsitePage> => {
    const response = await apiMethods.get(`${PAGES_URL}/${slug}`);
    return response.data.data;
  },
};

export const useHomepageData = () => {
  const query = useQuery({
    queryKey: ['homepage'],
    queryFn: () => homepageApi.getHomepageData(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const usePages = () => {
  const query = useQuery({
    queryKey: ['website-pages'],
    queryFn: () => homepageApi.getPages(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    pages: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const usePageBySlug = (slug: string) => {
  const query = useQuery({
    queryKey: ['website-page', slug],
    queryFn: () => homepageApi.getPageBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  return {
    page: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
