import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CustomerForm } from '../../components/CustomerForm';
import { crmApi } from '../../api/crm';
import { CreateCustomerData } from '../../types/customer.types';
import { ROUTES, TOAST_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

export const CreateCustomer: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateCustomerData) => {
    try {
      await crmApi.createCustomer(data);
      toast.success(TOAST_MESSAGES.CUSTOMER_CREATED);
      navigate(ROUTES.CUSTOMERS);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create customer';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.CUSTOMERS)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Customer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add a new customer to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.CUSTOMERS)}
        />
      </Card>
    </div>
  );
};
