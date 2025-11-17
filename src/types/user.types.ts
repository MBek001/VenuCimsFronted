export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  is_superuser?: boolean;
  is_active?: boolean;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  password?: string;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  superusers: number;
  verified_users: number;
}
