import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Shield, CheckCircle } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';
import { Card } from '../../components/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { usersApi } from '../../api/users';
import { crmApi } from '../../api/crm';
import { UserStats } from '../../types/user.types';
import { CustomerStats } from '../../types/customer.types';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SuperuserDashboard: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, customers] = await Promise.all([
        usersApi.getUserStats(),
        crmApi.getCustomerStats(),
      ]);
      setUserStats(users);
      setCustomerStats(customers);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const chartData = [
    {
      name: 'Users',
      Total: userStats?.total_users || 0,
      Active: userStats?.active_users || 0,
    },
    {
      name: 'Customers',
      Total: customerStats?.total_customers || 0,
      Active: customerStats?.active_customers || 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Superuser Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          System overview and administrative metrics
        </p>
      </div>

      {/* User Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          User Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={userStats?.total_users || 0}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Active Users"
            value={userStats?.active_users || 0}
            icon={UserCheck}
            color="green"
          />
          <StatsCard
            title="Superusers"
            value={userStats?.superusers || 0}
            icon={Shield}
            color="purple"
          />
          <StatsCard
            title="Verified Users"
            value={userStats?.verified_users || 0}
            icon={CheckCircle}
            color="yellow"
          />
        </div>
      </div>

      {/* Customer Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Customer Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Customers"
            value={customerStats?.total_customers || 0}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Active Customers"
            value={customerStats?.active_customers || 0}
            icon={UserCheck}
            color="green"
          />
          <StatsCard
            title="Inactive Customers"
            value={customerStats?.inactive_customers || 0}
            icon={Users}
            color="red"
          />
          <StatsCard
            title="Pending Customers"
            value={customerStats?.pending_customers || 0}
            icon={Users}
            color="yellow"
          />
        </div>
      </div>

      {/* Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
            <YAxis className="text-gray-600 dark:text-gray-400" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--tooltip-border)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="Total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Active" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/superuser/users"
            className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            <h4 className="font-semibold text-primary-600 dark:text-primary-400">
              Manage Users
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create, edit, and manage user accounts
            </p>
          </a>
          <a
            href="/crm/customers"
            className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            <h4 className="font-semibold text-green-600 dark:text-green-400">
              View All Customers
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Access complete customer database
            </p>
          </a>
        </div>
      </Card>
    </div>
  );
};
