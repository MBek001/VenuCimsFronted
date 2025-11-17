import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import { User, CreateUserData, UpdateUserData, UserStats } from '../types/user.types';
import { PaginatedResponse, PaginationParams } from '../types/api.types';

export const usersApi = {
  // Get all users with pagination
  getUsers: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS, { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get(API_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  },

  // Create user
  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await axiosInstance.post(API_ENDPOINTS.USERS, data);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    const response = await axiosInstance.put(API_ENDPOINTS.USER_BY_ID(id), data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.USER_BY_ID(id));
  },

  // Get user statistics
  getUserStats: async (): Promise<UserStats> => {
    const response = await axiosInstance.get(API_ENDPOINTS.USER_STATS);
    return response.data;
  },
};
