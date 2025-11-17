export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  notes: string | null;
  status: 'active' | 'inactive' | 'pending';
  audio_file_url: string | null;
  created_at: string;
  updated_at: string;
  created_by_id: number;
}

export interface CreateCustomerData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  notes?: string;
  status?: 'active' | 'inactive' | 'pending';
  audio_file?: File;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {}

export interface CustomerFilters {
  search?: string;
  status?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  inactive_customers: number;
  pending_customers: number;
  customers_with_audio: number;
}

export interface PaginatedCustomers {
  items: Customer[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
