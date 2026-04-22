/**
 * Page wrapper component - consistent page styling
 */

import React from 'react';

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  subtitle,
  children,
  actions,
}) => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        {children}
      </div>
    </div>
  );
};
