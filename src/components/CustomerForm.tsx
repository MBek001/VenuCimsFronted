import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from './Input';
import { Button } from './Button';
import { Upload, X } from 'lucide-react';
import { CreateCustomerData } from '../types/customer.types';
import { CUSTOMER_STATUS_OPTIONS } from '../utils/constants';

interface CustomerFormProps {
  initialData?: Partial<CreateCustomerData>;
  onSubmit: (data: CreateCustomerData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerData>({
    defaultValues: initialData || {
      status: 'active',
    },
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const onFormSubmit = async (data: CreateCustomerData) => {
    if (audioFile) {
      data.audio_file = audioFile;
    }
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <Input
          label="Name"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
          required
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        {/* Phone */}
        <Input
          label="Phone"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
        />

        {/* Company */}
        <Input label="Company" {...register('company')} error={errors.company?.message} />

        {/* Address */}
        <Input
          label="Address"
          {...register('address')}
          error={errors.address?.message}
          className="md:col-span-2"
        />

        {/* City */}
        <Input label="City" {...register('city')} error={errors.city?.message} />

        {/* State */}
        <Input label="State" {...register('state')} error={errors.state?.message} />

        {/* Zip Code */}
        <Input
          label="Zip Code"
          {...register('zip_code')}
          error={errors.zip_code?.message}
        />

        {/* Country */}
        <Input label="Country" {...register('country')} error={errors.country?.message} />

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-gray-100"
          >
            {CUSTOMER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Audio File Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Audio File
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
              <Upload className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {audioFile ? audioFile.name : 'Choose audio file'}
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {audioFile && (
              <button
                type="button"
                onClick={() => setAudioFile(null)}
                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Accepted formats: MP3, WAV, OGG (Max 10MB)
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-dark-border">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};
