import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { UserForm } from '../../components/UserForm';
import { Pagination } from '../../components/Pagination';
import { usersApi } from '../../api/users';
import { User, CreateUserData, UpdateUserData } from '../../types/user.types';
import { TOAST_MESSAGES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await usersApi.getUsers({
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
      });
      setUsers(data.items);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserData) => {
    setIsSubmitting(true);
    try {
      await usersApi.createUser(data);
      toast.success(TOAST_MESSAGES.USER_CREATED);
      setShowCreateModal(false);
      loadUsers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create user';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: UpdateUserData) => {
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      await usersApi.updateUser(editingUser.id, data);
      toast.success(TOAST_MESSAGES.USER_UPDATED);
      setEditingUser(null);
      loadUsers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update user';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await usersApi.deleteUser(deletingUser.id);
      toast.success(TOAST_MESSAGES.USER_DELETED);
      setDeletingUser(null);
      loadUsers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  const columns = [
    {
      key: 'username',
      header: 'Username',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'full_name',
      header: 'Full Name',
      render: (user: User) => user.full_name || '-',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (user: User) => (
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            user.is_active
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'is_superuser',
      header: 'Role',
      render: (user: User) => (
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            user.is_superuser
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          )}
        >
          {user.is_superuser ? 'Superuser' : 'User'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (user: User) => formatDate(user.created_at),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingUser(user);
            }}
            className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeletingUser(user);
            }}
            className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage system users and permissions
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow">
          <Table
            data={users}
            columns={columns as any}
            emptyMessage="No users found"
          />
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
        size="lg"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        size="lg"
      >
        {editingUser && (
          <UserForm
            initialData={editingUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setEditingUser(null)}
            isLoading={isSubmitting}
            isEdit
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user "${deletingUser?.username}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
