import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  const baseClass = "t-button rounded transition-colors duration-200 focus-visible:ring-2 inline-flex items-center justify-center";
  const variantClass = {
    primary: "bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400",
    secondary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400",
  };
  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={cn(baseClass, variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
