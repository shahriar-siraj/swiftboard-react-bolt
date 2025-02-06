import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Dashboard from './Dashboard';

export default function Favorites() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Reuse Dashboard component with a filter for favorites
  return <Dashboard defaultFilter="favorites" />;
}