import { create } from 'zustand';
import { Customer, CustomerFilters } from '../types/customer.types';

interface CustomerState {
  selectedCustomers: number[];
  filters: CustomerFilters;
  currentPage: number;
  pageSize: number;

  // Actions
  toggleCustomerSelection: (id: number) => void;
  selectAllCustomers: (ids: number[]) => void;
  clearSelection: () => void;
  setFilters: (filters: CustomerFilters) => void;
  clearFilters: () => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  selectedCustomers: [],
  filters: {},
  currentPage: 1,
  pageSize: 10,

  toggleCustomerSelection: (id: number) =>
    set((state) => ({
      selectedCustomers: state.selectedCustomers.includes(id)
        ? state.selectedCustomers.filter((customerId) => customerId !== id)
        : [...state.selectedCustomers, id],
    })),

  selectAllCustomers: (ids: number[]) =>
    set({ selectedCustomers: ids }),

  clearSelection: () =>
    set({ selectedCustomers: [] }),

  setFilters: (filters: CustomerFilters) =>
    set({ filters, currentPage: 1 }), // Reset to first page when filters change

  clearFilters: () =>
    set({ filters: {}, currentPage: 1 }),

  setCurrentPage: (page: number) =>
    set({ currentPage: page }),

  setPageSize: (size: number) =>
    set({ pageSize: size, currentPage: 1 }),
}));
