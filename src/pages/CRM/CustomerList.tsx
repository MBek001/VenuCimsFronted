import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { SearchBar } from '../../components/SearchBar';
import { FilterDropdown } from '../../components/FilterDropdown';
import { Pagination } from '../../components/Pagination';
import { Table } from '../../components/Table';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { crmApi } from '../../api/crm';
import { Customer } from '../../types/customer.types';
import { useCustomerStore } from '../../store/customerStore';
import { useDebounce } from '../../hooks/useDebounce';
import { ROUTES, CUSTOMER_STATUS_OPTIONS, TOAST_MESSAGES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedCustomers,
    filters,
    currentPage,
    pageSize,
    toggleCustomerSelection,
    selectAllCustomers,
    clearSelection,
    setFilters,
    setCurrentPage,
  } = useCustomerStore();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch });
  }, [debouncedSearch]);

  useEffect(() => {
    setFilters({ ...filters, status: statusFilter });
  }, [statusFilter]);

  useEffect(() => {
    loadCustomers();
  }, [currentPage, pageSize, filters]);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await crmApi.getCustomers(currentPage, pageSize, filters);
      setCustomers(data.items);
      setTotalPages(data.pages);
      setTotalCustomers(data.total);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await crmApi.exportCustomers(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Customers exported successfully');
    } catch (error) {
      toast.error('Failed to export customers');
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await crmApi.bulkDeleteCustomers(selectedCustomers);
      toast.success(TOAST_MESSAGES.BULK_DELETE_SUCCESS(selectedCustomers.length));
      clearSelection();
      setShowDeleteDialog(false);
      loadCustomers();
    } catch (error) {
      toast.error('Failed to delete customers');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      clearSelection();
    } else {
      selectAllCustomers(customers.map((c) => c.id));
    }
  };

  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedCustomers.length === customers.length && customers.length > 0}
          onChange={handleSelectAll}
          className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-dark-elevated border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
        />
      ),
      render: (customer: Customer) => (
        <input
          type="checkbox"
          checked={selectedCustomers.includes(customer.id)}
          onChange={() => toggleCustomerSelection(customer.id)}
          className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-dark-elevated border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
        />
      ),
    },
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'email',
      header: 'Email',
      render: (customer: Customer) => customer.email || '-',
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (customer: Customer) => customer.phone || '-',
    },
    {
      key: 'company',
      header: 'Company',
      render: (customer: Customer) => customer.company || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (customer: Customer) => {
        const statusOption = CUSTOMER_STATUS_OPTIONS.find((s) => s.value === customer.status);
        return (
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              customer.status === 'active' &&
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
              customer.status === 'inactive' &&
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
              customer.status === 'pending' &&
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            )}
          >
            {statusOption?.label || customer.status}
          </span>
        );
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (customer: Customer) => formatDate(customer.created_at),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {totalCustomers} total customers
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => navigate(ROUTES.CREATE_CUSTOMER)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search customers..."
          className="flex-1"
        />
        <FilterDropdown
          label="Filter by Status"
          options={[
            { value: '', label: 'All Statuses' },
            ...CUSTOMER_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-48"
        />
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4 flex items-center justify-between">
          <span className="text-primary-600 dark:text-primary-400">
            {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''}{' '}
            selected
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={clearSelection}>
              Clear Selection
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow">
          <Table
            data={customers}
            columns={columns as any}
            onRowClick={(customer) => navigate(ROUTES.CUSTOMER_DETAIL(customer.id))}
            emptyMessage="No customers found"
          />
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        title="Delete Customers"
        message={`Are you sure you want to delete ${selectedCustomers.length} customer${
          selectedCustomers.length > 1 ? 's' : ''
        }? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
