import { isValidElement, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, X, Download, Mail, ChevronDown, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { FIS_CARDS } from "@shared/constants/alertConstants";
import { alertsAPI } from "@features/alerts/api/alerts.api";
import { dashboardAPI } from "@features/dashboard/api/dashboard.api";
import { useTheme } from "@app/providers/ThemeContext";
import { useToast } from "@app/providers/ToastContext";

interface FISAlertSectionProps {
  data?: any;
  farmId?: string;
  sensorId?: string;
}

/**
 * FISAlertSection - Field Intelligence System alerts (V2 design with linear progress bars)
 */
export function FISAlertSection({
  data,
  farmId: propFarmId,
  sensorId: propSensorId,
}: FISAlertSectionProps) {
  const cards = Array.isArray(data?.cards) ? data.cards : FIS_CARDS;
  const suggestion = data?.suggestion || {
    title: "Suggestion",
    body: "Deploy sub-surface irrigation now. Solar intensity is rising, hydrate early to maximize yield.",
    confidence: "98.4%",
  };

  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const { theme } = useTheme();
  const { addToast } = useToast();

  const [searchParams] = useSearchParams();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const farmId = propFarmId || searchParams.get("farmId") || undefined;
  const sensorId = propSensorId || searchParams.get("sensorId") || searchParams.get("deviceId") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const range = searchParams.get("range") || undefined;

  const getParams = (customRange?: string) => {
    const p: any = {};
    // Temporarily disabled for debugging
    // if (farmId) p.farmId = farmId;
    // if (sensorId) p.sensorId = sensorId;
    // if (startDate) p.startDate = startDate;
    // if (endDate) p.endDate = endDate;
    p.range = customRange || range || "7d";
    return p;
  };

  const handleExportCSV = async (customRange?: string) => {
    if (isExporting || isEmailing) return;
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      const response = await dashboardAPI.exportPredictions(getParams(customRange));
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `predictions-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast({
        message: "CSV download started successfully.",
        type: "success",
      });
    } catch (err: any) {
      let errorMessage = "Failed to export predictions CSV. Please try again.";

      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          if (json.message) {
            errorMessage = json.message;
          }
        } catch (parseErr) {
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      addToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailReport = async (customRange?: string) => {
    if (isEmailing || isExporting) return;
    setIsEmailing(true);
    setShowExportMenu(false);
    try {
      const response = await dashboardAPI.emailPredictions(getParams(customRange));
      const msg = response.data?.message || "CSV successfully emailed to your email address.";
      addToast({
        message: msg,
        type: "success",
      });
    } catch (err: any) {
      addToast({
        message: err.response?.data?.message || "Failed to email predictions report. Please try again.",
        type: "error",
      });
    } finally {
      setIsEmailing(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showExportMenu]);

  useEffect(() => {
    const checkAcknowledgment = () => {
      const ackTimestamp = localStorage.getItem("fis_alert_acknowledged_at");
      if (ackTimestamp) {
        const timestamp = parseInt(ackTimestamp, 10);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        if (now - timestamp < thirtyMinutes) {
          setIsAcknowledged(true);
          // Set a timer to reset after the remaining time
          const remainingTime = thirtyMinutes - (now - timestamp);
          const timer = setTimeout(() => {
            setIsAcknowledged(false);
            localStorage.removeItem("fis_alert_acknowledged_at");
          }, remainingTime);
          return () => clearTimeout(timer);
        } else {
          localStorage.removeItem("fis_alert_acknowledged_at");
        }
      }
    };

    checkAcknowledgment();
  }, []);

  const handleAcknowledge = async () => {
    if (isAcknowledged || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await alertsAPI.createAlert({
        title: suggestion.title || "FIS Suggestion",
        message: suggestion.body,
        type: "FIS_ACK",
        severity: "info",
        status: "acknowledged",
      });

      const now = Date.now();
      localStorage.setItem("fis_alert_acknowledged_at", now.toString());
      setIsAcknowledged(true);
      addToast({
        message: "Prescription Acknowledged Successfully",
        type: "success",
      });

      // Reset after 30 minutes
      setTimeout(
        () => {
          setIsAcknowledged(false);
          localStorage.removeItem("fis_alert_acknowledged_at");
        },
        30 * 60 * 1000,
      );
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-borderColor bg-bgCard p-6 backdrop-blur-2xl xl:col-span-4"
    >
      {/* Decorative Background Element */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accentPrimary/5 blur-[100px]" />

      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-3xl font-extrabold tracking-tight text-textPrimary">
            FIS Alert Engine
          </h3>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-textMuted">
            Intelligence Core Active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-accentPrimary/20 bg-accentPrimary/10 px-4 py-2 shadow-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-accentPrimary" />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accentPrimary">
              Live Monitor
            </span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-full border border-borderColor bg-bgCard px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>Export Data</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showExportMenu ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl border border-borderColor bg-bgCard p-2.5 shadow-2xl z-50 backdrop-blur-xl"
                >
                  <div className="text-xs font-semibold text-textSecondary mb-2 px-2 pt-1">
                    Select Range
                  </div>
                  <button
                    onClick={() => handleExportCSV("7d")}
                    className="w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-bgCardHover text-textPrimary"
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => handleExportCSV("15d")}
                    className="w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-bgCardHover text-textPrimary"
                  >
                    Last 15 Days
                  </button>
                  <button
                    onClick={() => handleExportCSV("30d")}
                    className="w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-bgCardHover text-textPrimary"
                  >
                    Last 30 Days
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card: any) => {
          // card.icon may be: a component (function), a rendered React element (object with $$typeof),
          // a string (icon name from API), or undefined. Only functions are safe to render as <Icon />.
          const rawIcon = card.icon;
          const isComponent = typeof rawIcon === "function";
          const isElement = isValidElement(rawIcon);
          const IconComponent = isComponent
            ? rawIcon
            : FIS_CARDS.find((c: any) => c.title === card.title)?.icon ||
              Activity;

          const statusColors = {
            Optimal:
              "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
            Warning:
              "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
            Critical:
              "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20",
          };

          const barColors = {
            Optimal: "from-emerald-400 to-emerald-600 shadow-emerald-500/40",
            Warning: "from-amber-400 to-amber-600 shadow-amber-500/40",
            Critical: "from-rose-400 to-rose-600 shadow-rose-500/40",
          };

          const isViewableCard = [
            "Pest Analysis",
            "Fungal Activity",
            "Irrigation Analysis",
          ].includes(card.title);

          return (
            <motion.div
              key={card.title}
              className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-borderColor/45 bg-bgCardHover/20 p-4 transition-all hover:bg-bgCardHover/40 hover:border-borderColor"
            >
              <div className="relative z-10">
                {/* Icon and Title - Horizontal Layout */}
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-bgCardHover border border-borderColor">
                      {isElement
                        ? rawIcon
                        : IconComponent && (
                            <IconComponent className="h-4 w-4 text-accentPrimary" />
                          )}
                    </div>
                    <h4 className="text-lg font-bold tracking-tight text-textPrimary leading-tight pt-0.5">
                      {card.title}
                    </h4>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-lg border px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.25em] whitespace-nowrap ${statusColors[card.status as keyof typeof statusColors]}`}
                  >
                    {card.status}
                  </span>
                </div>

                <p className="mb-4 text-[0.85rem] font-medium leading-[1.5] text-textSecondary line-clamp-2 transition-all duration-300 group-hover:line-clamp-none">
                  {typeof card.body === "object" && card.body !== null
                    ? JSON.stringify(card.body)
                    : card.body}
                </p>
              </div>

              <div className="relative z-10">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-textMuted">
                    Metrics
                  </span>
                  <span className="text-sm font-bold tabular-nums text-textSecondary">
                    {card.value}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bgInput border border-borderColor mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${card.value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r shadow-lg ${barColors[card.status as keyof typeof barColors]}`}
                  />
                </div>

                {isViewableCard && (
                  <button
                    onClick={() => setSelectedCard(card)}
                    aria-label={`View more details for ${card.title || 'alert'}`}
                    className="w-full rounded-lg border border-borderColor bg-bgCardHover/60 px-3 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-textSecondary transition-all hover:bg-bgCardHover hover:text-textPrimary hover:border-borderColor"
                  >
                    View More
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setSelectedCard(null)}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 mx-4 w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl bg-bgCard text-textPrimary border border-borderColor"
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex items-start justify-between border-b border-borderColor/45 px-5 py-4">
                <div className="max-w-[80%]">
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                    {selectedCard.title}
                  </h3>
                  <p className="text-base md:text-lg mt-2 text-textSecondary">
                    {selectedCard.body}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="ml-4 p-2 text-textSecondary hover:opacity-80"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 text-textPrimary">
                {/* Card-specific fields (advisory displayed once above) */}
                {selectedCard.title === "Pest Analysis" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Pest Risk Score
                      </h4>
                      <p className="mt-1 text-xl md:text-2xl font-bold">
                        {selectedCard.value ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Rainfall (mm)
                      </h4>
                      <p className="mt-1 text-xl md:text-2xl font-bold">
                        {selectedCard.rainfall_mm ??
                          selectedCard.rainfall ??
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Recommendation
                      </h4>
                      <p className="mt-1 text-base md:text-lg text-textMuted">
                        {selectedCard.recommendation ??
                          selectedCard.body ??
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Temperature
                      </h4>
                      <p className="mt-1 text-xl md:text-2xl font-bold">
                        {selectedCard.temperature ?? "N/A"}
                      </p>
                    </div>
                  </div>
                )}

                {selectedCard.title === "Irrigation Analysis" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Confidence
                      </h4>
                      <p className="mt-1 text-xl md:text-2xl font-bold">
                        {selectedCard.confidence ??
                          data?.suggestion?.confidence ??
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Decision
                      </h4>
                      <p className="mt-1 text-xl md:text-2xl font-bold">
                        {selectedCard.decision ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Water Requirement
                      </h4>
                      <p className="mt-1 text-xl md:text-2xl font-bold">
                        {selectedCard.water_requirement_mm ??
                          selectedCard.water_requirement ??
                          "N/A"}
                      </p>
                    </div>
                  </div>
                )}

                {selectedCard.title === "Fungal Activity" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Activity Level
                      </h4>
                      <p className="mt-1 text-xl md:text-2xl font-bold">
                        {selectedCard.activity_level ??
                          selectedCard.activity ??
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Dew Point
                      </h4>
                      <p className="mt-1 text-xl md:text-2xl font-bold">
                        {selectedCard.dew_point ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Leaf Wetness
                      </h4>
                      <p className="mt-1 text-xl md:text-2xl font-bold">
                        {selectedCard.leaf_wetness_pct ??
                          selectedCard.leaf ??
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Likely Disease
                      </h4>
                      <p className="mt-1 text-base md:text-lg text-textMuted">
                        {selectedCard.likely_disease ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-textSecondary">
                        Recommendation
                      </h4>
                      <p className="mt-1 text-base md:text-lg text-textMuted">
                        {selectedCard.recommendation ??
                          selectedCard.body ??
                          "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-borderColor bg-bgCardHover/30 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentPrimary/10 border border-accentPrimary/25 shadow-sm">
                <Activity className="h-5 w-5 text-accentPrimary" />
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-bold tracking-tight text-textPrimary">
                  {suggestion.title || "AI Prescription"}
                </p>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-accentPrimary/80">
                  Expert Recommendation
                </p>
              </div>
            </div>

            <button
              onClick={handleAcknowledge}
              disabled={isAcknowledged || isSubmitting}
              className={`hidden sm:flex items-center gap-2 rounded-xl px-7 py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 ${
                isAcknowledged
                  ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-accentPrimary text-black dark:text-black hover:bg-accentSecondary"
              }`}
            >
              {isAcknowledged ? (
                <>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  Acknowledged
                </>
              ) : isSubmitting ? (
                "Processing..."
              ) : (
                "Acknowledge"
              )}
            </button>
          </div>

          <p className="text-[0.95rem] font-medium leading-[1.7] text-textSecondary">
            {typeof suggestion.body === "object" && suggestion.body !== null
              ? JSON.stringify(suggestion.body)
              : suggestion.body}
          </p>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-textMuted">
                System Confidence
              </span>
              <span className="text-sm font-bold text-accentPrimary tabular-nums">
                {suggestion.confidence}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-bgInput border border-borderColor">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: suggestion.confidence }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-accentPrimary to-accentSecondary shadow-md"
              />
            </div>
          </div>

          <button
            onClick={handleAcknowledge}
            disabled={isAcknowledged || isSubmitting}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 sm:hidden ${
              isAcknowledged
                ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-accentPrimary text-black dark:text-black hover:bg-accentSecondary"
            }`}
          >
            {isAcknowledged
              ? "Acknowledged"
              : isSubmitting
                ? "Acknowledge"
                : "Acknowledge"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
