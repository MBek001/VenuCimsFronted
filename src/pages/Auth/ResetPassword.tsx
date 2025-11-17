import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { authApi } from '../../api/auth';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>();

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    try {
      await authApi.resetPassword({
        token,
        new_password: data.password,
      });
      toast.success('Password reset successfully!');
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || 'Password reset failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Invalid Reset Link
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Button onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}>
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Reset Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={errors.password?.message}
          placeholder="Enter new password"
        />

        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
          placeholder="Confirm new password"
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Reset Password
        </Button>
      </form>
    </div>
  );
};
