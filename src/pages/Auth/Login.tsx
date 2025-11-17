import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/auth.types';
import { ROUTES, TOAST_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || TOAST_MESSAGES.LOGIN_ERROR;
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Sign In
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          {...register('username', { required: 'Username is required' })}
          error={errors.username?.message}
          placeholder="Enter your username"
          autoComplete="username"
        />

        <Input
          label="Password"
          type="password"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};
