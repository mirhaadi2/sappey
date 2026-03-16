# Frontend API Layer

This directory contains the API layer for the frontend application, built with Axios and TanStack Query for optimal performance and developer experience.

## Structure

- `index.ts` - Main axios configuration and interceptors
- `authentication.ts` - Authentication API methods and React Query hooks
- `products/` - Products API folder containing types, endpoints, client, and hooks for CRUD operations and image handling
- `utils.ts` - Generic API service utilities for creating new API endpoints
- `exports.ts` - Centralized exports for easy importing

## Features

- ✅ Axios for HTTP requests with interceptors
- ✅ TanStack Query for caching and state management
- ✅ Automatic token handling
- ✅ File upload support
- ✅ TypeScript support
- ✅ Error handling
- ✅ Generic CRUD utilities

## Usage Examples

### Authentication

```tsx
import { useAuth } from '../api/exports';

function LoginComponent() {
  const { login, signInLoading, signInError, user } = useAuth();

  const handleLogin = (email: string, password: string) => {
    login({ email, password });
  };

  return (
    <div>
      {signInLoading && <p>Loading...</p>}
      {signInError && <p>Error: {signInError.message}</p>}
      {user && <p>Welcome, {user.firstName}!</p>}
    </div>
  );
}
```

### Products

```tsx
import { useProducts, useProductsMutations } from '../api/exports';

function ProductsList() {
  const { data: products, isLoading } = useProducts();
  const { deleteProduct, deleteLoading } = useProductsMutations();

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div>
      {products?.products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => deleteProduct(product.id)}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Creating New API Services

```tsx
import { createApiService } from '../api/exports';

// Create a new API service
export const categoriesApi = createApiService('/categories', 'categories');

// Use in components
function CategoriesComponent() {
  const { useGetAll, useCreate } = categoriesApi.hooks;
  const { data: categories } = useGetAll();
  const createMutation = useCreate();

  // Your component logic here
}
```

### File Upload

```tsx
import { useProductsMutations } from '../api/exports';

function ImageUploadComponent() {
  const { uploadImages, uploadImagesLoading } = useProductsMutations();

  const handleFileUpload = (productId: string, files: FileList) => {
    const fileArray = Array.from(files);
    uploadImages({ productId, images: fileArray });
  };

  return (
    <input
      type="file"
      multiple
      onChange={(e) => handleFileUpload('product-id', e.target.files!)}
      disabled={uploadImagesLoading}
    />
  );
}
```

## API Methods

### Generic Methods (available on all services)

- `getAll(params?)` - Get all items
- `getById(id)` - Get single item
- `create(data)` - Create new item
- `update(id, data)` - Update item
- `delete(id)` - Delete item
- `uploadFile(file)` - Upload single file
- `uploadFiles(files)` - Upload multiple files

### Custom Methods

For custom endpoints, use the service methods directly:

```tsx
// GET /api/products/search?q=laptop
const results = await productsApi.service.get('/search', { q: 'laptop' });

// POST /api/products/123/like
await productsApi.service.post('/123/like');
```

## Environment Variables

Add to your `.env` file:

```
VITE_API_URL=http://localhost:4000/api
```

## Error Handling

All API calls include automatic error handling. Use the error states from hooks:

```tsx
const { loginError, isError } = useAuth();

if (isError) {
  console.error('API Error:', loginError);
}
```

## Best Practices

1. **Use hooks for components**: Always use the provided React Query hooks for data fetching
2. **Handle loading states**: Show loading indicators during API calls
3. **Error handling**: Display user-friendly error messages
4. **Type safety**: Use the provided TypeScript types
5. **File uploads**: Use FormData for file uploads
6. **Caching**: TanStack Query handles caching automatically

## Creating New API Files

1. Create a new file in the `api/` directory
2. Import `apiMethods` from `./index`
3. Create your API methods
4. Export React Query hooks
5. Add exports to `exports.ts`

Example structure:

```tsx
// api/example.ts
import { apiMethods } from './index';
import { useQuery, useMutation } from '@tanstack/react-query';

export const exampleApi = {
  getData: async () => {
    const response = await apiMethods.get('/example');
    return response.data;
  },
};

export const useExample = () => {
  return useQuery({
    queryKey: ['example'],
    queryFn: exampleApi.getData,
  });
};
```