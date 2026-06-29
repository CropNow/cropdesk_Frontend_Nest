import React from "react";
import { motion } from "framer-motion";
import { CircularGauge } from "@shared/components/CircularGauge";
import { FARM_STATUS_METRICS, FarmStatusMetric } from "@shared/constants/farmConstants";
import { useFontScale } from "@shared/hooks/useFontScale";

interface FarmHealthData {
  overallHealth?: number;
  condition?: string;
  stressBreakdown?: Record<string, number> | null;
  metrics?: FarmStatusMetric[];
}

/**
 * FarmHealthSection - Farm health metrics overview
 */
export function FarmHealthSection({ data }: { data?: FarmHealthData }) {
  const fontScale = useFontScale();
  const overallHealth = data?.overallHealth || 0;
  const condition = data?.condition;
  const stressBreakdown = data?.stressBreakdown;
  const metrics = Array.isArray(data?.metrics) ? data.metrics : [];

  const roundDisplayValue = (value: unknown): string | number => {
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) {
      if (numericValue > 0 && numericValue < 10 && !Number.isInteger(numericValue)) {
        return Number(numericValue.toFixed(2));
      }
      return Math.round(numericValue);
    }
    return String(value ?? "");
  };

  const formatCondition = (str?: string) => {
    if (!str) return "";
    return str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getConditionColor = (cond?: string) => {
    if (!cond) return "bg-bgCardHover text-textPrimary border-borderColor";
    const c = cond.toLowerCase();
    if (
      c.includes("healthy") ||
      c.includes("optimal") ||
      c.includes("good") ||
      c.includes("normal")
    )
      return "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border-emerald-500/30";
    if (c.includes("moderate") || c.includes("warning"))
      return "bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/30";
    if (
      c.includes("high") ||
      c.includes("severe") ||
      c.includes("critical") ||
      c.includes("danger")
    )
      return "bg-red-500/20 text-red-500 dark:text-red-400 border-red-500/30";
    return "bg-bgCardHover text-textPrimary border-borderColor";
  };

  const renderMetricCard = (metric: FarmStatusMetric, compact = false) => {
    // metric.icon may be: a real React element (local constants), a plain object
    // shaped like an element (API JSON loses $$typeof — would crash with #31),
    // a function component, or undefined. Anything that isn't a valid element or
    // a function gets replaced by the local fallback so React never receives a
    // bare object as a child.
    const raw = metric.icon as unknown;
    let icon: React.ReactNode;
    if (React.isValidElement(raw)) {
      icon = React.cloneElement(raw as React.ReactElement, {
        className: compact ? "h-4 w-4" : "h-5 w-5",
      });
    } else if (typeof raw === "function") {
      const IconComp = raw as React.ComponentType<{ className?: string }>;
      icon = <IconComp className={compact ? "h-4 w-4" : "h-5 w-5"} />;
    } else {
      const fallback = FARM_STATUS_METRICS.find((m) => m.id === metric.id)?.icon;
      icon = React.isValidElement(fallback)
        ? React.cloneElement(fallback as React.ReactElement, {
            className: compact ? "h-4 w-4" : "h-5 w-5",
          })
        : null;
    }

    const displayValue = roundDisplayValue(metric.value);
    return (
      <div
        key={metric.id}
        role="group"
        aria-label={`${metric.label} ${displayValue}${metric.unit ? " " + metric.unit : ""}`}
        className={`rounded-xl border border-borderColor bg-bgInput text-center shadow-sm ${compact ? "px-1.5 py-3" : "p-4"}`}
      >
        <div
          className={`mb-2 flex justify-center text-textPrimary ${compact ? "text-lg" : "text-xl"}`}
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="flex items-baseline justify-center gap-0.5">
          <span
            className={`${compact ? "text-scale-body" : "text-scale-metric-sm"} font-bold tracking-tight text-textHeading`}
          >
            {displayValue}
          </span>
          {metric.unit && (
            <span className={`${compact ? "text-scale-caption" : "text-scale-helper"} font-medium text-textSecondary`}>
              {metric.unit}
            </span>
          )}
        </div>
        <p className={`mt-1 font-bold text-textMuted uppercase tracking-wider break-words ${compact ? "text-scale-tiny leading-tight" : "text-scale-caption"}`}>
          {metric.label}
        </p>
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="card shadow-card p-6 bg-cardBg"
    >
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-scale-section font-bold text-textHeading">Overall Farm Status</h3>
            {condition && condition !== "UNKNOWN" && (
              <span
                className={`mt-2 inline-block rounded-lg border px-3 py-1 text-scale-caption font-bold uppercase tracking-wider ${getConditionColor(condition)}`}
              >
                {formatCondition(condition)}
              </span>
            )}
          </div>
          <div className="flex-shrink-0">
            <CircularGauge value={overallHealth} />
          </div>
        </div>

        {stressBreakdown && (
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {Object.entries(stressBreakdown).map(([key, value]) => {
              const label = key.replace("_stress", "").toUpperCase();
              const numValue = Number(value) || 0;
              const barColorClass =
                numValue > 50 ? "bg-red-500" : numValue > 20 ? "bg-amber-500" : "bg-emerald-500";
              return (
                <div
                  key={key}
                  className="rounded-xl border border-borderColor bg-bgInput p-4 shadow-sm"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-scale-caption font-bold tracking-wider text-textMuted">
                      {label}
                    </span>
                    <span className="text-scale-caption font-bold text-textHeading">
                      {Math.round(numValue)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-bgCard border border-borderColor">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(numValue, 100)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${barColorClass}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {metrics.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3">
            {metrics.map((metric) => renderMetricCard(metric))}
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="flex flex-col sm:hidden">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-scale-card font-bold text-textHeading">Overall Farm Status</h3>
            {condition && condition !== "UNKNOWN" && (
              <span
                className={`mt-2 inline-block rounded-lg border px-2.5 py-0.5 text-scale-caption font-bold uppercase tracking-wider ${getConditionColor(condition)}`}
              >
                {formatCondition(condition)}
              </span>
            )}
          </div>
          <div className="origin-right flex-shrink-0 scale-75">
            <CircularGauge value={overallHealth} />
          </div>
        </div>

        {stressBreakdown && (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(stressBreakdown).map(([key, value]) => {
              const label = key.replace("_stress", "").toUpperCase();
              const numValue = Number(value) || 0;
              const barColorClass =
                numValue > 50 ? "bg-red-500" : numValue > 20 ? "bg-amber-500" : "bg-emerald-500";
              return (
                <div
                  key={key}
                  className="rounded-xl border border-borderColor bg-bgInput p-2.5 shadow-sm"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-scale-caption font-bold tracking-wider text-textMuted">
                      {label}
                    </span>
                    <span className="text-scale-caption font-bold text-textHeading">
                      {Math.round(numValue)}%
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-bgCard border border-borderColor">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(numValue, 100)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${barColorClass}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {metrics.length > 0 && (
          <div className={`mt-4 grid gap-2 ${fontScale >= 1.5 ? "grid-cols-2" : "grid-cols-3"}`}>
            {metrics.map((metric) => renderMetricCard(metric, true))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
