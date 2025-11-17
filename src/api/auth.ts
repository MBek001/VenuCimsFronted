import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import {
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthUser,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
} from '../types/auth.types';

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthUser> => {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ME);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (data: VerifyEmailData): Promise<{ message: string }> => {
    const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_EMAIL, data);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, data);
    return response.data;
  },
};
