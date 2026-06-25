import React from "react";
import { motion } from "framer-motion";
import { AI_INSIGHTS } from "@shared/constants/aiConstants";

/**
 * AIInsightsSection - AI-generated insights about farm conditions
 */
export function AIInsightsSection({ data }: { data?: any }) {
  let insights = AI_INSIGHTS;

  if (Array.isArray(data) && data.length > 0) {
    insights = data;
  } else if (data && typeof data === "object") {
    if (Array.isArray(data.data) && data.data.length > 0) insights = data.data;
    else if (Array.isArray(data.insights) && data.insights.length > 0) insights = data.insights;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-borderColor bg-bgCard p-6 backdrop-blur-2xl lg:col-span-2"
    >
      {/* Decorative Glow */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accentPrimary/5 blur-[100px]" />

      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-3xl font-extrabold tracking-tight text-textPrimary">AI Insights</h3>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-textMuted">
            Real-time Farm Analysis
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((item: any, idx: number) => {
          const isWarning =
            item.level === "warning" ||
            item.description?.toLowerCase().includes("low") ||
            item.description?.toLowerCase().includes("high");
          const isOptimal = item.level === "good" || item.level === "optimal";

          return (
            <motion.div
              key={item.title + idx}
              layout
              whileHover={{ x: 4, scale: 1.005 }}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-borderColor bg-bgCardHover/20 p-4 transition-all hover:bg-bgCardHover/40 hover:border-borderColor"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={`h-3 w-3 rounded-full ${isOptimal ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : isWarning ? "bg-amber-400 shadow-[0_0_10px_#fbbf24]" : "bg-rose-500 shadow-[0_0_10px_#f43f5e]"}`}
                  />
                  <div
                    className={`absolute inset-0 h-3 w-3 animate-ping rounded-full opacity-20 ${isOptimal ? "bg-emerald-500" : isWarning ? "bg-amber-400" : "bg-rose-500"}`}
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-[1.05rem] font-bold tracking-tight text-textPrimary">
                    {item.title}
                  </p>
                  <motion.div
                    layout="position"
                    className="flex flex-col transition-all duration-300"
                  >
                    <p className="text-[0.85rem] font-medium leading-relaxed text-textSecondary line-clamp-1 group-hover:line-clamp-none">
                      {typeof item.description === "object" && item.description !== null
                        ? JSON.stringify(item.description)
                        : item.description}
                    </p>
                    {item.farmer_advisory && (
                      <p className="mt-1 text-[0.85rem] font-medium leading-relaxed text-textSecondary">
                        {item.farmer_advisory}
                      </p>
                    )}
                    {item.plant_impact && (
                      <p className="mt-1 text-[0.85rem] font-medium leading-relaxed text-textSecondary">
                        {item.plant_impact}
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>

              {item.advice && (
                <div className="hidden sm:block">
                  <span className="rounded-lg border border-borderColor bg-bgCardHover px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-textMuted opacity-0 transition-opacity group-hover:opacity-100">
                    ADVICE READY
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {insights.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-borderColor">
          <p className="text-sm font-medium text-textMuted">Analyzing data for insights...</p>
        </div>
      )}
    </motion.div>
  );
}
