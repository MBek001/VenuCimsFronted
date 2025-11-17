import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { authApi } from '../../api/auth';
import { RegisterData } from '../../types/auth.types';
import { ROUTES, TOAST_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    try {
      await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });
      toast.success(TOAST_MESSAGES.REGISTER_SUCCESS);
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
          })}
          error={errors.username?.message}
          placeholder="Choose a username"
        />

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

        <Input
          label="Full Name"
          {...register('full_name')}
          error={errors.full_name?.message}
          placeholder="Enter your full name (optional)"
        />

        <Input
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={errors.password?.message}
          placeholder="Choose a strong password"
        />

        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
          placeholder="Confirm your password"
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign Up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
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
