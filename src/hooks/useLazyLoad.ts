import { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  onVisible?: () => void | Promise<void>;
  retryOnError?: number; // Number of retries on error
}

interface UseLazyLoadReturn {
  ref: (element?: Element | null) => void;
  inView: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook for advanced lazy loading with:
 * - Error handling and retry logic
 * - Loading states
 * - Callback execution
 * - Perfect for data fetching coordination
 */
export const useLazyLoad = ({
  threshold = 0.1,
  rootMargin = '250px 0px',
  onVisible,
  retryOnError = 2,
}: UseLazyLoadOptions): UseLazyLoadReturn => {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const executeCallback = useCallback(async () => {
    if (!onVisible) return;

    try {
      setIsLoading(true);
      setError(null);
      await onVisible();
      setRetryCount(0);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);

      // Retry logic
      if (retryCount < retryOnError) {
        console.warn(`Lazy load error, retrying (${retryCount + 1}/${retryOnError}):`, error);
        setRetryCount(retryCount + 1);
        // Retry after 1 second
        setTimeout(executeCallback, 1000);
      } else {
        console.error('Max retries reached for lazy load:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onVisible, retryCount, retryOnError]);

  useEffect(() => {
    if (inView) {
      executeCallback();
    }
  }, [inView, executeCallback]);

  return { ref, inView, isLoading, error };
};

export default useLazyLoad;
