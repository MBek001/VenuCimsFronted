import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-bg dark:to-dark-surface flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Auth Content */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            VENU CIMS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customer Information Management System
          </p>
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl p-8 border border-gray-200 dark:border-dark-border">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
