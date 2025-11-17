import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CustomerForm } from '../../components/CustomerForm';
import { crmApi } from '../../api/crm';
import { Customer, UpdateCustomerData } from '../../types/customer.types';
import { ROUTES, TOAST_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

export const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCustomer();
    }
  }, [id]);

  const loadCustomer = async () => {
    if (!id) return;
    try {
      const data = await crmApi.getCustomerById(parseInt(id));
      setCustomer(data);
    } catch (error) {
      toast.error('Failed to load customer');
      navigate(ROUTES.CUSTOMERS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateCustomerData) => {
    if (!id) return;
    try {
      await crmApi.updateCustomer(parseInt(id), data);
      toast.success(TOAST_MESSAGES.CUSTOMER_UPDATED);
      navigate(ROUTES.CUSTOMER_DETAIL(id));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update customer';
      toast.error(errorMessage);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Customer not found
        </h2>
        <Button onClick={() => navigate(ROUTES.CUSTOMERS)} className="mt-4">
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.CUSTOMER_DETAIL(customer.id))}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Customer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{customer.name}</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CustomerForm
          initialData={customer}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.CUSTOMER_DETAIL(customer.id))}
        />
      </Card>
    </div>
  );
};
