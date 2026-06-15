import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BrainCircuit, Calendar, Filter } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function AITrendsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-textHeading sm:text-4xl">
              AI Trends & Analytics
            </h1>
            <p className="mt-1 text-sm text-textSecondary sm:text-base">
              Predictive insights and historical performance analysis for your farm.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-cardBorder bg-cardBg px-4 text-sm font-semibold text-textPrimary transition hover:bg-cardBg/80">
              <Calendar className="h-4 w-4" />
              <span>Last 30 Days</span>
            </button>
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-cardBorder bg-cardBg px-4 text-sm font-semibold text-textPrimary transition hover:bg-cardBg/80">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-cardBorder bg-cardBg p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-2xl bg-accentPrimary/10 p-3">
                <BrainCircuit className="h-6 w-6 text-accentPrimary" />
              </div>
              <span className="text-sm font-bold text-accentPrimary">+12.4%</span>
            </div>
            <h3 className="text-lg font-bold text-textHeading">Yield Prediction</h3>
            <p className="mt-1 text-sm text-textSecondary">Estimated harvest volume based on current growth trends.</p>
            <div className="mt-4 text-3xl font-bold text-textHeading">4.2 Tons</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[2.5rem] border border-cardBorder bg-cardBg p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-2xl bg-blue-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-blue-400">-8.2%</span>
            </div>
            <h3 className="text-lg font-bold text-textHeading">Water Efficiency</h3>
            <p className="mt-1 text-sm text-textSecondary">Usage optimization score compared to previous season.</p>
            <div className="mt-4 text-3xl font-bold text-textHeading">94/100</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] border border-cardBorder bg-cardBg p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-2xl bg-orange-500/10 p-3">
                <Calendar className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-sm font-bold text-orange-400">Stable</span>
            </div>
            <h3 className="text-lg font-bold text-textHeading">Soil Health Index</h3>
            <p className="mt-1 text-sm text-textSecondary">Consolidated nutrient and moisture consistency score.</p>
            <div className="mt-4 text-3xl font-bold text-textHeading">82%</div>
          </motion.div>
        </div>

        {/* Placeholder for Charts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex min-h-[400px] flex-col items-center justify-center rounded-[3rem] border border-dashed border-cardBorder bg-cardBg/20 p-8 text-center backdrop-blur-md"
        >
          <div className="rounded-full bg-accentPrimary/5 p-8">
            <TrendingUp className="h-16 w-16 text-accentPrimary/40" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-textHeading">Trend Analytics Coming Soon</h3>
          <p className="mt-2 max-w-[400px] text-textSecondary">
            We are processing your historical data to generate deep learning trends and predictive harvest models.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default AITrendsPage;
