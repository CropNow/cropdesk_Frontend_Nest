/**
 * Template: Unauthorized Page
 */

import React from 'react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">401</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Unauthorized</h2>
      <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
      <a href="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
        Go to Login
      </a>
    </div>
  );
};

export default UnauthorizedPage;
