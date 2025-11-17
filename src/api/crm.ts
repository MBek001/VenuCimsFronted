import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
  CustomerStats,
  PaginatedCustomers,
  CustomerFilters,
} from '../types/customer.types';

export const crmApi = {
  // Get all customers with filters and pagination
  getCustomers: async (
    page = 1,
    size = 10,
    filters?: CustomerFilters
  ): Promise<PaginatedCustomers> => {
    const params: any = {
      skip: (page - 1) * size,
      limit: size,
    };

    if (filters?.search) params.search = filters.search;
    if (filters?.status) params.status = filters.status;
    if (filters?.city) params.city = filters.city;
    if (filters?.state) params.state = filters.state;
    if (filters?.country) params.country = filters.country;

    const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMERS, { params });
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id: number): Promise<Customer> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER_BY_ID(id));
    return response.data;
  },

  // Create customer
  createCustomer: async (data: CreateCustomerData): Promise<Customer> => {
    const formData = new FormData();

    formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.company) formData.append('company', data.company);
    if (data.address) formData.append('address', data.address);
    if (data.city) formData.append('city', data.city);
    if (data.state) formData.append('state', data.state);
    if (data.zip_code) formData.append('zip_code', data.zip_code);
    if (data.country) formData.append('country', data.country);
    if (data.notes) formData.append('notes', data.notes);
    if (data.status) formData.append('status', data.status);
    if (data.audio_file) formData.append('audio_file', data.audio_file);

    const response = await axiosInstance.post(API_ENDPOINTS.CUSTOMERS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update customer
  updateCustomer: async (id: number, data: UpdateCustomerData): Promise<Customer> => {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.company) formData.append('company', data.company);
    if (data.address) formData.append('address', data.address);
    if (data.city) formData.append('city', data.city);
    if (data.state) formData.append('state', data.state);
    if (data.zip_code) formData.append('zip_code', data.zip_code);
    if (data.country) formData.append('country', data.country);
    if (data.notes) formData.append('notes', data.notes);
    if (data.status) formData.append('status', data.status);
    if (data.audio_file) formData.append('audio_file', data.audio_file);

    const response = await axiosInstance.put(API_ENDPOINTS.CUSTOMER_BY_ID(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.CUSTOMER_BY_ID(id));
  },

  // Bulk delete customers
  bulkDeleteCustomers: async (ids: number[]): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.CUSTOMER_BULK_DELETE, { customer_ids: ids });
  },

  // Get customer statistics
  getCustomerStats: async (): Promise<CustomerStats> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER_STATS);
    return response.data;
  },

  // Export customers to Excel
  exportCustomers: async (filters?: CustomerFilters): Promise<Blob> => {
    const params: any = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.status) params.status = filters.status;
    if (filters?.city) params.city = filters.city;
    if (filters?.state) params.state = filters.state;
    if (filters?.country) params.country = filters.country;

    const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER_EXPORT, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Upload audio for customer
  uploadAudio: async (id: number, audioFile: File): Promise<Customer> => {
    const formData = new FormData();
    formData.append('audio_file', audioFile);

    const response = await axiosInstance.post(
      API_ENDPOINTS.CUSTOMER_UPLOAD_AUDIO(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
