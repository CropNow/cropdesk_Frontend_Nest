import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  BrainCircuit,
  Calendar,
  Filter,
  Newspaper,
  WifiOff,
  Clock,
  Download,
  Mail,
  FileSpreadsheet,
} from "lucide-react";
import { DashboardLayout } from "@app/layouts/DashboardLayout";
import { useOnlineStatus } from "@app/providers/OnlineStatusContext";
import { OfflineFallback } from "@shared/components/OfflineFallback";
import { dashboardAPI } from "@features/dashboard/api/dashboard.api";
import { newsAPI, NewsArticle } from "@services/api/news.api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@app/providers/ToastContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

// Category badge color mapper
const getBadgeStyles = (category: string) => {
  switch (category) {
    case "Weather":
      return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
    case "Market":
      return "bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/20";
    case "Pest Alert":
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    case "Government Scheme":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "Crop Advisory":
      return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    case "Irrigation":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "Research":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    default:
      return "bg-textSecondary/10 text-textSecondary border border-textSecondary/20";
  }
};

const SkeletonLoader = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map((n) => (
      <div
        key={n}
        className="animate-pulse rounded-[2rem] border border-cardBorder bg-cardBg/50 p-6 space-y-4"
      >
        <div className="h-4 w-20 rounded bg-cardBorder" />
        <div className="space-y-2">
          <div className="h-6 w-3/4 rounded bg-cardBorder" />
          <div className="h-6 w-1/2 rounded bg-cardBorder" />
        </div>
        <div className="space-y-1">
          <div className="h-4 w-full rounded bg-cardBorder" />
          <div className="h-4 w-5/6 rounded bg-cardBorder" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-3 w-16 rounded bg-cardBorder" />
          <div className="h-3 w-24 rounded bg-cardBorder" />
        </div>
      </div>
    ))}
  </div>
);

export function AITrendsPage() {
  const { isOnline } = useOnlineStatus();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportRange, setExportRange] = useState("30d");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (email: boolean) => {
    setIsExporting(true);
    try {
      if (email) {
        await dashboardAPI.exportPredictions({ range: exportRange, email: true });
        addToast({
          message: "CSV Report has been successfully sent to your email!",
          type: "success",
        });
        setIsExportModalOpen(false);
      } else {
        const response = await dashboardAPI.exportPredictions({ range: exportRange });
        const blob = new Blob([response.data as any], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `predictions-report-${exportRange}-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast({
          message: "CSV Report downloaded successfully!",
          type: "success",
        });
        setIsExportModalOpen(false);
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || err.message || "Failed to export report. Please try again.";
      addToast({
        message: errMsg,
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const [location, setLocation] = useState<{
    district?: string;
    state?: string;
  } | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const hasChartData = !!(
    analyticsData &&
    (analyticsData.chartData?.length ||
      analyticsData.history?.length ||
      analyticsData.trendData?.length)
  );

  const formatTrend = (trend: any) => {
    if (trend === undefined || trend === null) return "";
    if (typeof trend === "number") {
      return trend > 0 ? `+${trend}%` : `${trend}%`;
    }
    return String(trend);
  };

  const getYieldVal = () => {
    const val = analyticsData?.yieldPrediction || analyticsData?.yield;
    if (val === undefined || val === null) return "--";
    if (typeof val === "object") {
      return `${val.value ?? ""} ${val.unit ?? ""}`.trim() || "--";
    }
    return String(val);
  };

  const getYieldChange = () => {
    const val = analyticsData?.yieldPrediction || analyticsData?.yield;
    if (val && typeof val === "object" && val.trend !== undefined && val.trend !== null) {
      return formatTrend(val.trend);
    }
    return formatTrend(analyticsData?.yieldChange);
  };

  const getWaterVal = () => {
    const val = analyticsData?.waterEfficiency || analyticsData?.water;
    if (val === undefined || val === null) return "--";
    if (typeof val === "object") {
      const score = val.score !== undefined ? val.score : "";
      const max = val.max !== undefined ? val.max : 100;
      return score !== "" ? `${score}/${max}` : "--";
    }
    return String(val);
  };

  const getWaterChange = () => {
    const val = analyticsData?.waterEfficiency || analyticsData?.water;
    if (val && typeof val === "object" && val.trend !== undefined && val.trend !== null) {
      return formatTrend(val.trend);
    }
    return formatTrend(analyticsData?.waterChange);
  };

  const getSoilVal = () => {
    const val = analyticsData?.soilHealthIndex || analyticsData?.soilHealth;
    if (val === undefined || val === null) return "--";
    if (typeof val === "object") {
      return val.score !== undefined ? `${val.score}%` : "--";
    }
    return String(val);
  };

  const getSoilStatus = () => {
    const val = analyticsData?.soilHealthIndex || analyticsData?.soilHealth;
    if (val && typeof val === "object" && val.trend !== undefined && val.trend !== null) {
      return formatTrend(val.trend);
    }
    return formatTrend(analyticsData?.soilStatus);
  };

  // Fetch dashboard analytics
  useEffect(() => {
    if (!isOnline) {
      setIsLoadingAnalytics(false);
      return;
    }
    const fetchAnalytics = async () => {
      try {
        setIsLoadingAnalytics(true);
        const res = await dashboardAPI.getDashboardAnalytics();
        setAnalyticsData(res.data?.data || res.data);
        setAnalyticsError(null);
      } catch (err: any) {
        setAnalyticsError(err.message || "Failed to load analytics");
      } finally {
        setIsLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, [isOnline]);

  // Fetch location information
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await dashboardAPI.getFarms();
        const data = res.data?.data?.farms || res.data?.data || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          const farm = data[0];
          setLocation({
            district: farm.location?.city || "",
            state: farm.location?.state || "",
          });
        } else {
          // Fallback to empty values if no farms
          setLocation({
            district: "",
            state: "",
          });
        }
      } catch (err) {
        setLocation({
          district: "",
          state: "",
        });
      }
    };
    fetchLocation();
  }, []);

  // Fetch news articles with caching and offline fallback
  useEffect(() => {
    if (!location) return;

    const loadNews = async () => {
      const cacheKey = `agri_news_cache_${location.district || "default"}_${location.state || "default"}`;
      const timestampKey = `agri_news_timestamp_${location.district || "default"}_${location.state || "default"}`;

      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(timestampKey);

      const now = Date.now();
      const cacheExpiry = 30 * 60 * 1000; // 30 minutes

      if (cachedData && cachedTimestamp) {
        const timePassed = now - parseInt(cachedTimestamp, 10);
        if (timePassed < cacheExpiry || !isOnline) {
          setNews(JSON.parse(cachedData));
          setLastUpdated(new Date(parseInt(cachedTimestamp, 10)).toLocaleTimeString());
          setIsLoadingNews(false);
          return;
        }
      }

      if (!isOnline) {
        setIsLoadingNews(false);
        return;
      }

      try {
        setIsLoadingNews(true);
        const articles = await newsAPI.getNews(location);
        setNews(articles);
        localStorage.setItem(cacheKey, JSON.stringify(articles));
        localStorage.setItem(timestampKey, now.toString());
        setLastUpdated(new Date(now).toLocaleTimeString());
      } catch (err) {
        // On API error, fallback to cached news if available
        if (cachedData) {
          setNews(JSON.parse(cachedData));
        }
      } finally {
        setIsLoadingNews(false);
      }
    };

    loadNews();
  }, [location, isOnline]);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Existing AI Trends Analytics section */}
        {!isOnline ? (
          <OfflineFallback
            title="AI Trends Unavailable Offline"
            description="Historical trend analytics and predictive harvest models require an active internet connection."
          />
        ) : (
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
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#00FF9C]/40 bg-[#00FF9C]/10 px-4 text-sm font-semibold text-[#00FF9C] transition hover:bg-[#00FF9C]/25 active:scale-98"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            {isLoadingAnalytics ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse rounded-[2.5rem] border border-cardBorder bg-cardBg/50 p-6 h-48 space-y-4"
                  />
                ))}
              </div>
            ) : (
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
                    <span className="text-sm font-bold text-accentPrimary">{getYieldChange()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-textHeading">Yield Prediction</h3>
                  <p className="mt-1 text-sm text-textSecondary">
                    Estimated harvest volume based on current growth trends.
                  </p>
                  <div className="mt-4 text-3xl font-bold text-textHeading">{getYieldVal()}</div>
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
                    <span className="text-sm font-bold text-blue-400">{getWaterChange()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-textHeading">Water Efficiency</h3>
                  <p className="mt-1 text-sm text-textSecondary">
                    Usage optimization score compared to previous season.
                  </p>
                  <div className="mt-4 text-3xl font-bold text-textHeading">{getWaterVal()}</div>
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
                    <span className="text-sm font-bold text-orange-400">{getSoilStatus()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-textHeading">Soil Health Index</h3>
                  <p className="mt-1 text-sm text-textSecondary">
                    Consolidated nutrient and moisture consistency score.
                  </p>
                  <div className="mt-4 text-3xl font-bold text-textHeading">{getSoilVal()}</div>
                </motion.div>
              </div>
            )}

            {/* Real Charts from /dashboard/analytics */}
            {isLoadingAnalytics ? (
              <div className="animate-pulse rounded-[3rem] border border-cardBorder bg-cardBg/50 h-96" />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-[3rem] border border-cardBorder bg-cardBg p-6 sm:p-8 backdrop-blur-xl space-y-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-textHeading">
                      Environmental & Yield Trends
                    </h3>
                    <p className="text-xs text-textSecondary">
                      Real-time and predictive sensor telemetry metrics.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {hasChartData ? (
                      <span className="flex items-center gap-1.5 text-xs text-accentPrimary font-semibold bg-accentPrimary/10 border border-accentPrimary/20 px-3 py-1.5 rounded-xl">
                        <span className="h-2 w-2 rounded-full bg-accentPrimary animate-pulse" />
                        Live Analytics Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        No Telemetry Connected
                      </span>
                    )}
                  </div>
                </div>

                {!hasChartData ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 text-red-400">
                      <TrendingUp className="h-8 w-8 opacity-60" />
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        !
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-textHeading">No Active Telemetry Data</h4>
                    <p className="mt-2 max-w-sm text-sm text-textSecondary leading-relaxed">
                      Connect a telemetry device (NEST, Seed, or Drone) to begin tracking real-time
                      environmental metrics and harvest predictions.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/settings?tab=devices")}
                      className="mt-6 rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-5 py-2.5 text-sm font-semibold text-accentPrimary transition hover:bg-accentPrimary/25 active:scale-98"
                    >
                      Go to Device Settings
                    </button>
                  </div>
                ) : (
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={
                          analyticsData?.chartData ||
                          analyticsData?.history ||
                          analyticsData?.trendData
                        }
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00FF9C" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#00FF9C" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#A0AEC0" fontSize={11} tickLine={false} />
                        <YAxis stroke="#A0AEC0" fontSize={11} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#1A202C",
                            border: "1px solid #2D3748",
                            borderRadius: "1rem",
                            color: "#EDF2F7",
                          }}
                        />
                        <Legend />
                        <Area
                          name="Yield Estimate (Tons)"
                          type="monotone"
                          dataKey="yield"
                          stroke="#00FF9C"
                          fillOpacity={1}
                          fill="url(#colorYield)"
                          strokeWidth={3}
                        />
                        <Area
                          name="Soil Moisture (%)"
                          type="monotone"
                          dataKey="soilMoisture"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorMoisture)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Agricultural News Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 border-t border-cardBorder pt-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accentPrimary/10 text-accentPrimary">
                <Newspaper className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-textHeading">Agricultural News</h2>
                <p className="text-sm text-textSecondary">
                  {location && location.district && location.state
                    ? `Latest updates for ${location.district}, ${location.state}`
                    : "Latest regional farming and agricultural updates"}
                </p>
              </div>
            </div>

            {/* Offline indicator */}
            {!isOnline && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs font-semibold text-amber-400">
                <WifiOff className="h-3.5 w-3.5" />
                <span>Offline Mode • Showing Cached Agricultural News</span>
                {lastUpdated && (
                  <span className="text-[10px] opacity-70 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Updated: {lastUpdated}
                  </span>
                )}
              </div>
            )}
          </div>

          {isLoadingNews ? (
            <SkeletonLoader />
          ) : news.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cardBorder bg-cardBg/10 py-12 text-center text-textSecondary">
              No agricultural updates available for your location.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col justify-between rounded-[2rem] border border-cardBorder bg-cardBg p-6 transition-all duration-300 hover:border-accentPrimary/30 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="space-y-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getBadgeStyles(item.category)}`}
                    >
                      {item.category}
                    </span>
                    <h3
                      onClick={() => item.url && window.open(item.url, "_blank", "noopener,noreferrer")}
                      className="text-lg font-bold text-textHeading leading-snug line-clamp-2 hover:text-accentPrimary transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-textSecondary leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-cardBorder/50 pt-4 text-xs text-textMuted">
                    <span className="font-semibold text-textSecondary">{item.source}</span>
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {isExportModalOpen && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!isExporting) setIsExportModalOpen(false);
                }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-cardBorder bg-bgSidebar p-6 shadow-2xl z-10 space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-accentPrimary/10 p-3 text-accentPrimary">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-textPrimary">Export Prediction Report</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-textMuted uppercase tracking-wider block">
                      Select Date Range
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "7 Days", value: "7d" },
                        { label: "15 Days", value: "15d" },
                        { label: "30 Days", value: "30d" },
                      ].map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          disabled={isExporting}
                          onClick={() => setExportRange(r.value)}
                          className={[
                            "rounded-xl py-2.5 text-sm font-semibold border transition-all duration-200",
                            exportRange === r.value
                              ? "bg-accentPrimary border-accentPrimary text-slate-900 font-bold"
                              : "bg-bgInput border-cardBorder text-textSecondary hover:bg-bgCardHover",
                          ].join(" ")}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-textSecondary">
                    Choose whether you want to download the CSV report directly to your machine or
                    send it directly as an email attachment to your registered email address.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => setIsExportModalOpen(false)}
                    className="flex-1 rounded-xl border border-cardBorder bg-bgInput py-3 text-sm font-semibold text-textBody transition hover:bg-bgCardHover"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExport(false)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-cardBorder bg-cardBg py-3 text-sm font-semibold text-textPrimary transition hover:bg-cardBg/80 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExport(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accentPrimary py-3 text-sm font-bold text-slate-900 transition hover:bg-accentPrimary/90 disabled:opacity-50"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email Report</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default AITrendsPage;
