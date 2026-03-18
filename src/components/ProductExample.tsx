import React from 'react';
import { useProducts, useProduct, useProductSearch, useProductsByCategory } from '../api/exports';

interface ProductListProps {
  category?: string;
}

/**
 * Example: List products with optional category filter
 * Uses React Query for automatic caching and refetching
 */
export const ProductList: React.FC<ProductListProps> = ({ category }) => {
  // Fetch products with filters - React Query handles caching automatically
  const { products, isLoading, error } = useProducts(
    category ? { categoryId: category } : undefined,
    true // enabled flag
  );

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {(error as any)?.message || 'Failed to load products'}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-green-600 font-semibold">${product.price}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>

          {/* Display images if available */}
          {product.images && product.images.length > 0 && (
            <div className="mt-2">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-32 object-cover rounded"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Example: Search products with auto-debounce via React Query
 * Search results are cached separately from the main product list
 */
export const ProductSearchExample: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { results, isLoading, error } = useProductSearch(searchQuery);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />
      
      {isLoading && <div>Searching...</div>}
      {error && <div>Search error: {(error as any)?.message}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Example: Get products by category
 * Uses separate cache key for category queries
 */
export const ProductsByCategoryExample: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const { products, isLoading, error } = useProductsByCategory(categoryId);

  if (isLoading) return <div>Loading category products...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3>{product.name}</h3>
          <p className="font-bold text-green-600">${product.price}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * Example: Get single product by ID
 * Cached separately for detail page views
 */
export const ProductDetailExample: React.FC<{ productId: string }> = ({ productId }) => {
  const { product, isLoading, error } = useProduct(productId, !!productId);

  if (isLoading) return <div>Loading product...</div>;
  if (error || !product) return <div>Product not found</div>;

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-3xl font-bold text-green-600 mt-4">${product.price}</p>
      <p className="text-sm text-gray-500 mt-2">Stock: {product.stock}</p>
      
      {product.images && product.images.length > 0 && (
        <img
          src={product.images[0]}
          alt={product.name}
          className="mt-4 w-full h-80 object-cover rounded-lg"
        />
      )}
    </div>
  );
};