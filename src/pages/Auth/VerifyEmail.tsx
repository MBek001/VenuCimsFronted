import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { ROUTES } from '../../utils/constants';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Button } from '../../components/Button';
import { CheckCircle, XCircle } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await authApi.verifyEmail({ token });
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.detail || 'Email verification failed');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="text-center">
      {status === 'loading' && (
        <>
          <LoadingSpinner size="lg" className="mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verifying your email...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait a moment</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <Button onClick={() => navigate(ROUTES.LOGIN)}>Go to Login</Button>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <Button onClick={() => navigate(ROUTES.LOGIN)}>Back to Login</Button>
        </>
      )}
    </div>
  );
};
