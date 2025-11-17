import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Clock, Headphones } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';
import { Card } from '../../components/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { crmApi } from '../../api/crm';
import { CustomerStats } from '../../types/customer.types';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await crmApi.getCustomerStats();
      setStats(data);
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

  const statusData = [
    { name: 'Active', value: stats?.active_customers || 0, color: '#10b981' },
    { name: 'Inactive', value: stats?.inactive_customers || 0, color: '#ef4444' },
    { name: 'Pending', value: stats?.pending_customers || 0, color: '#f59e0b' },
  ];

  const barData = [
    {
      name: 'Total',
      count: stats?.total_customers || 0,
    },
    {
      name: 'Active',
      count: stats?.active_customers || 0,
    },
    {
      name: 'With Audio',
      count: stats?.customers_with_audio || 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your customer data.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Customers"
          value={stats?.total_customers || 0}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Customers"
          value={stats?.active_customers || 0}
          icon={UserCheck}
          color="green"
        />
        <StatsCard
          title="Inactive Customers"
          value={stats?.inactive_customers || 0}
          icon={UserX}
          color="red"
        />
        <StatsCard
          title="Pending Customers"
          value={stats?.pending_customers || 0}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Customers with Audio"
          value={stats?.customers_with_audio || 0}
          icon={Headphones}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
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
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/crm/customers/new"
            className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            <h4 className="font-semibold text-primary-600 dark:text-primary-400">
              Add New Customer
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create a new customer record
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
              Browse and manage customers
            </p>
          </a>
          <a
            href="/crm/customers?status=pending"
            className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
          >
            <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">
              Pending Customers
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Review pending customers
            </p>
          </a>
        </div>
      </Card>
    </div>
  );
};
