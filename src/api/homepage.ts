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
  sectionType: 'collections' | 'bestsellers' | 'health_wellness' | 'new_arrivals' | 'story' | 'testimonials' | 'instagram' | 'contact' | 'about' | 'footer';
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

export interface HomepageData {
  banners: Banner[];
  hero: Hero | null;
  sections: Section[];
  testimonials: Testimonial[];
  instagramPosts: InstagramPost[];
}

const BASE_URL = '/homepage';

export const homepageApi = {
  getHomepageData: async (): Promise<HomepageData> => {
    const response = await apiMethods.get(`${BASE_URL}`);
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
