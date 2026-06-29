/**
 * Template: Error Page 404
 */

import React from "react";
import { Link } from "react-router-dom";
import { Heading, Text } from "@shared/components/ui/typography";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bgMain">
      <Heading level={1} className="text-6xl mb-4">404</Heading>
      <Heading level={2} color="secondary" className="text-2xl mb-2">Page Not Found</Heading>
      <Text color="hint" className="mb-8">The page you're looking for doesn't exist.</Text>
      <Link
        to="/dashboard"
        className="bg-accentPrimary text-black px-6 py-2 rounded-lg hover:bg-accentPrimary/80 transition font-medium"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
