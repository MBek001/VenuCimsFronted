import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { authApi } from '../../api/auth';
import { ForgotPasswordData } from '../../types/auth.types';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>();

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      await authApi.forgotPassword(data);
      setIsSuccess(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || 'Failed to send reset link. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Check Your Email
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We've sent a password reset link to your email address. Please check your inbox and
          follow the instructions.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button>Back to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        Forgot Password?
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
          placeholder="Enter your email"
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Remember your password?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};
