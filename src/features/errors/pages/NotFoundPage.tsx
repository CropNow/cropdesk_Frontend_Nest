/**
 * Template: Error Page 404
 */

import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bgMain">
      <h1 className="text-6xl font-bold text-textHeading mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-textSecondary mb-2">Page Not Found</h2>
      <p className="text-textHint mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/dashboard"
        className="bg-accentPrimary text-black px-6 py-2 rounded-lg hover:bg-accentPrimary/80 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
