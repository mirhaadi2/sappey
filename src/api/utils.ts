import { apiMethods } from './index';
import { MutationFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Generic API utilities for easy endpoint creation
export class ApiService {
  private baseEndpoint: string;

  constructor(endpoint: string) {
    this.baseEndpoint = endpoint;
  }

  // Generic CRUD methods
  async getAll<T = any>(params?: any): Promise<T[]> {
    const response = await apiMethods.get<T[]>(this.baseEndpoint, params);
    return response.data;
  }

  async getById<T = any>(id: string | number): Promise<T> {
    const response = await apiMethods.get<T>(`${this.baseEndpoint}/${id}`);
    return response.data;
  }

  async create<T = any, D = any>(data: D): Promise<T> {
    const response = await apiMethods.post<T>(this.baseEndpoint, data);
    return response.data;
  }

  async update<T = any, D = any>(id: string | number, data: D): Promise<T> {
    const response = await apiMethods.put<T>(`${this.baseEndpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string | number): Promise<void> {
    await apiMethods.delete(`${this.baseEndpoint}/${id}`);
  }

  // File upload methods
  async uploadFile<T = any>(file: File, fieldName = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    const response = await apiMethods.upload<T>(this.baseEndpoint, formData);
    return response.data;
  }

  async uploadFiles<T = any>(files: File[], fieldName = 'files'): Promise<T> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fieldName, file);
    });
    const response = await apiMethods.upload<T>(this.baseEndpoint, formData);
    return response.data;
  }

  // Custom endpoint methods
  async get<T = any>(path: string, params?: any): Promise<T> {
    const response = await apiMethods.get<T>(`${this.baseEndpoint}${path}`, params);
    return response.data;
  }

  async post<T = any, D = any>(path: string, data?: D): Promise<T> {
    const response = await apiMethods.post<T>(`${this.baseEndpoint}${path}`, data);
    return response.data;
  }

  async put<T = any, D = any>(path: string, data?: D): Promise<T> {
    const response = await apiMethods.put<T>(`${this.baseEndpoint}${path}`, data);
    return response.data;
  }

  async patch<T = any, D = any>(path: string, data?: D): Promise<T> {
    const response = await apiMethods.patch<T>(`${this.baseEndpoint}${path}`, data);
    return response.data;
  }

  async remove(path: string): Promise<void> {
    await apiMethods.delete(`${this.baseEndpoint}${path}`);
  }
}

// Generic React Query hooks factory
export const createApiHooks = (service: ApiService, queryKey: string) => {
  // Get all items
  const useGetAll = (params?: any, options?: any) => {
    return useQuery({
      queryKey: [queryKey, params],
      queryFn: () => service.getAll(params),
      ...options,
    });
  };

  // Get single item
  const useGetById = (id: string | number, options?: any) => {
    return useQuery({
      queryKey: [queryKey, id],
      queryFn: () => service.getById(id),
      enabled: !!id,
      ...options,
    });
  };

  // Create item
  const useCreate = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: service.create.bind(service),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };

  // Update item
  const useUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: any }) =>
        service.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };

  // Delete item
  const useDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: service.delete.bind(service),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };

  // File upload
  type UploadFileVars = { file: File; fieldName?: string };
  const useUploadFile = <T = any>() => {
    const mutationFn: MutationFunction<T, UploadFileVars> = ({ file, fieldName }) =>
      service.uploadFile<T>(file, fieldName);

    return useMutation<T, unknown, UploadFileVars>({
      mutationFn,
    });
  };

  // Files upload
  type UploadFilesVars = { files: File[]; fieldName?: string };
  const useUploadFiles = <T = any>() => {
    const mutationFn: MutationFunction<T, UploadFilesVars> = ({ files, fieldName }) =>
      service.uploadFiles<T>(files, fieldName);

    return useMutation<T, unknown, UploadFilesVars>({
      mutationFn,
    });
  };

  return {
    useGetAll,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
    useUploadFile,
    useUploadFiles,
  };
};

// Utility function to create a complete API service with hooks
export const createApiService = (endpoint: string, queryKey: string) => {
  const service = new ApiService(endpoint);
  const hooks = createApiHooks(service, queryKey);

  return {
    service,
    hooks,
    // Direct access to service methods for custom usage
    ...service,
    // Direct access to hooks
    ...hooks,
  };
};

// Example usage:
/*
// Create a users API service
export const usersApi = createApiService('/users', 'users');

// Use in components:
const { useGetAll, useCreate, useUpdate, useDelete } = usersApi.hooks;

// Or use service directly:
const users = await usersApi.service.getAll();
const newUser = await usersApi.service.create(userData);
*/