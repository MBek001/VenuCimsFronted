import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Mail, Phone, Building, MapPin } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AudioPlayer } from '../../components/AudioPlayer';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { crmApi } from '../../api/crm';
import { Customer } from '../../types/customer.types';
import { ROUTES, TOAST_MESSAGES, CUSTOMER_STATUS_OPTIONS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await crmApi.deleteCustomer(parseInt(id));
      toast.success(TOAST_MESSAGES.CUSTOMER_DELETED);
      navigate(ROUTES.CUSTOMERS);
    } catch (error) {
      toast.error('Failed to delete customer');
    } finally {
      setIsDeleting(false);
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

  const statusOption = CUSTOMER_STATUS_OPTIONS.find((s) => s.value === customer.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              {customer.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customer ID: {customer.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.EDIT_CUSTOMER(customer.id))}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-sm font-medium',
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
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {customer.email}
                  </a>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {customer.phone}
                  </a>
                </div>
              )}
              {customer.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{customer.company}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Address */}
          {(customer.address || customer.city || customer.state) && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Address
              </h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div className="text-gray-900 dark:text-gray-100">
                  {customer.address && <p>{customer.address}</p>}
                  <p>
                    {[customer.city, customer.state, customer.zip_code]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {customer.country && <p>{customer.country}</p>}
                </div>
              </div>
            </Card>
          )}

          {/* Notes */}
          {customer.notes && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Notes
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {customer.notes}
              </p>
            </Card>
          )}

          {/* Audio */}
          {customer.audio_file_url && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Audio Recording
              </h2>
              <AudioPlayer src={customer.audio_file_url} />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Details
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {formatDate(customer.created_at, 'long')}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {formatDate(customer.updated_at, 'long')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customer.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
