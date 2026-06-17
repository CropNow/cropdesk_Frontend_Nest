import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BrainCircuit,
  Calendar,
  Filter,
  Newspaper,
  WifiOff,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@app/layouts/DashboardLayout";
import { useOnlineStatus } from "@app/providers/OnlineStatusContext";
import { OfflineFallback } from "@shared/components/OfflineFallback";
import { dashboardAPI } from "@features/dashboard/api/dashboard.api";
import { newsAPI, NewsArticle } from "@services/api/news.api";

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
  const [location, setLocation] = useState<{
    district?: string;
    state?: string;
  } | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

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
        console.error("Failed to fetch location for news", err);
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
          setLastUpdated(
            new Date(parseInt(cachedTimestamp, 10)).toLocaleTimeString(),
          );
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
        console.error("Failed to load agricultural news", err);
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
                  Predictive insights and historical performance analysis for
                  your farm.
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
                  <span className="text-sm font-bold text-accentPrimary">
                    +12.4%
                  </span>
                </div>
                <h3 className="text-lg font-bold text-textHeading">
                  Yield Prediction
                </h3>
                <p className="mt-1 text-sm text-textSecondary">
                  Estimated harvest volume based on current growth trends.
                </p>
                <div className="mt-4 text-3xl font-bold text-textHeading">
                  4.2 Tons
                </div>
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
                <h3 className="text-lg font-bold text-textHeading">
                  Water Efficiency
                </h3>
                <p className="mt-1 text-sm text-textSecondary">
                  Usage optimization score compared to previous season.
                </p>
                <div className="mt-4 text-3xl font-bold text-textHeading">
                  94/100
                </div>
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
                  <span className="text-sm font-bold text-orange-400">
                    Stable
                  </span>
                </div>
                <h3 className="text-lg font-bold text-textHeading">
                  Soil Health Index
                </h3>
                <p className="mt-1 text-sm text-textSecondary">
                  Consolidated nutrient and moisture consistency score.
                </p>
                <div className="mt-4 text-3xl font-bold text-textHeading">
                  82%
                </div>
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
              <h3 className="mt-6 text-2xl font-bold text-textHeading">
                Trend Analytics Coming Soon
              </h3>
              <p className="mt-2 max-w-[400px] text-textSecondary">
                We are processing your historical data to generate deep learning
                trends and predictive harvest models.
              </p>
            </motion.div>
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
                <h2 className="text-2xl font-bold text-textHeading">
                  Agricultural News
                </h2>
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
                    <h3 className="text-lg font-bold text-textHeading leading-snug line-clamp-2 hover:text-accentPrimary transition-colors cursor-pointer">
                      {item.title}
                    </h3>
                    <p className="text-sm text-textSecondary leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-cardBorder/50 pt-4 text-xs text-textMuted">
                    <span className="font-semibold text-textSecondary">
                      {item.source}
                    </span>
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric" },
                      )}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default AITrendsPage;
