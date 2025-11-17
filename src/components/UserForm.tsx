import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from './Input';
import { Button } from './Button';
import { CreateUserData, UpdateUserData } from '../types/user.types';

interface UserFormProps {
  initialData?: Partial<CreateUserData>;
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserData>({
    defaultValues: initialData || {
      is_active: true,
      is_superuser: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username */}
        <Input
          label="Username"
          {...register('username', {
            required: !isEdit && 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
          })}
          error={errors.username?.message}
          required={!isEdit}
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          {...register('email', {
            required: !isEdit && 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
          required={!isEdit}
        />

        {/* Full Name */}
        <Input
          label="Full Name"
          {...register('full_name')}
          error={errors.full_name?.message}
          className="md:col-span-2"
        />

        {/* Password */}
        <Input
          label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
          type="password"
          {...register('password', {
            required: !isEdit && 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={errors.password?.message}
          required={!isEdit}
          className="md:col-span-2"
        />

        {/* Is Active */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            {...register('is_active')}
            className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-dark-elevated border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
          />
          <label
            htmlFor="is_active"
            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Active
          </label>
        </div>

        {/* Is Superuser */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_superuser"
            {...register('is_superuser')}
            className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-dark-elevated border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
          />
          <label
            htmlFor="is_superuser"
            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Superuser
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-dark-border">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};
