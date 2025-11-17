// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',

  // Users
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  USER_STATS: '/users/stats',

  // Customers (CRM)
  CUSTOMERS: '/crm/customers',
  CUSTOMER_BY_ID: (id: number) => `/crm/customers/${id}`,
  CUSTOMER_STATS: '/crm/stats',
  CUSTOMER_EXPORT: '/crm/customers/export',
  CUSTOMER_BULK_DELETE: '/crm/customers/bulk-delete',
  CUSTOMER_UPLOAD_AUDIO: (id: number) => `/crm/customers/${id}/audio`,
} as const;

// App Routes
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboard
  DASHBOARD: '/dashboard',

  // CRM
  CUSTOMERS: '/crm/customers',
  CUSTOMER_DETAIL: (id: number | string) => `/crm/customers/${id}`,
  CREATE_CUSTOMER: '/crm/customers/new',
  EDIT_CUSTOMER: (id: number | string) => `/crm/customers/${id}/edit`,

  // Superuser
  SUPERUSER_DASHBOARD: '/superuser/dashboard',
  USER_MANAGEMENT: '/superuser/users',
} as const;

// Customer Status Options
export const CUSTOMER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'inactive', label: 'Inactive', color: 'bg-red-500' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy hh:mm a',
  TIME: 'hh:mm a',
} as const;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
];

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  LOGIN_ERROR: 'Invalid credentials',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Account created! Please verify your email.',
  CUSTOMER_CREATED: 'Customer created successfully',
  CUSTOMER_UPDATED: 'Customer updated successfully',
  CUSTOMER_DELETED: 'Customer deleted successfully',
  BULK_DELETE_SUCCESS: (count: number) => `${count} customers deleted successfully`,
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;
