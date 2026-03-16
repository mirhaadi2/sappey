import React from 'react';
import { useProducts, useProductsMutations } from '../api/exports';

interface ProductListProps {
  category?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ category }) => {
  // Use the products hook - that's it! No need to write API calls
  const { data: productsData, isLoading, error } = useProducts({
    category,
    limit: 10
  });

  // Use mutations for CRUD operations
  const { deleteProduct, deleteLoading } = useProductsMutations();

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {productsData?.products.map((product) => (
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

          <button
            onClick={() => deleteProduct(product.id)}
            disabled={deleteLoading}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
};

// Example of creating a new product
export const CreateProductForm: React.FC = () => {
  const { createProduct, createLoading, createError } = useProductsMutations();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createProduct({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      stock: parseInt(formData.get('stock') as string),
      images: formData.getAll('images') as File[],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Product Name"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="category"
        placeholder="Category"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="images"
        type="file"
        multiple
        accept="image/*"
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={createLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {createLoading ? 'Creating...' : 'Create Product'}
      </button>

      {createError && (
        <p className="text-red-500">Error: {createError.message}</p>
      )}
    </form>
  );
};