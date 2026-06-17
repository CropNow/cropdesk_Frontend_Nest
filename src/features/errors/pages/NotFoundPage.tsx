/**
 * Template: Error Page 404
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
