import React from "react";

interface StatusBadgeProps {
  /** Display label */
  label: string;
  /** Semantic variant */
  variant?: "success" | "warning" | "danger" | "neutral" | "info";
  /** Size */
  size?: "sm" | "md";
  /** Additional className */
  className?: string;
}

const VARIANT_STYLES: Record<string, string> = {
  success: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/20",
  danger: "bg-red-500/12 text-red-600 dark:text-red-400 border-red-500/20",
  neutral: "bg-gray-500/12 text-gray-600 dark:text-gray-400 border-gray-500/20",
  info: "bg-blue-500/12 text-blue-600 dark:text-blue-400 border-blue-500/20",
};

/**
 * StatusBadge — reusable pill/badge for status indicators.
 */
export function StatusBadge({ label, variant = "neutral", size = "sm", className = "" }: StatusBadgeProps) {
  const sizeClass = size === "md"
    ? "px-3 py-1 text-scale-helper font-semibold"
    : "px-2.5 py-0.5 text-scale-caption font-semibold";

  return (
    <span className={`inline-flex items-center rounded-md border ${VARIANT_STYLES[variant]} ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}
