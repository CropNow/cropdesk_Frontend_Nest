import { isValidElement, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, X, Download, ChevronDown, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { FIS_CARDS } from "@shared/constants/alertConstants";
import { alertsAPI } from "@features/alerts/api/alerts.api";
import { dashboardAPI } from "@features/dashboard/api/dashboard.api";
import { useTheme } from "@app/providers/ThemeContext";
import { useToast } from "@app/providers/ToastContext";
import { StatusBadge } from "@shared/components/StatusBadge";
import { Dropdown } from "@shared/components/ui/dropdown";

interface FISAlertSectionProps {
  data?: any;
  farmId?: string;
  sensorId?: string;
}

/**
 * FISAlertSection - Field Intelligence System alerts (Redesigned visual layer matching AI Insights)
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
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  const farmId = propFarmId || searchParams.get("farmId") || undefined;
  const sensorId =
    propSensorId || searchParams.get("sensorId") || searchParams.get("deviceId") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const range = searchParams.get("range") || undefined;

  const getParams = (customRange?: string) => {
    const p: any = {};
    p.range = customRange || range || "7d";
    return p;
  };

  const handleExportCSV = async (customRange?: string) => {
    if (isExporting || isEmailing) return;
    setIsExporting(true);
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
        } catch (parseErr) {}
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
    try {
      const response = await dashboardAPI.emailPredictions(getParams(customRange));
      const msg = response.data?.message || "CSV successfully emailed to your email address.";
      addToast({
        message: msg,
        type: "success",
      });
    } catch (err: any) {
      addToast({
        message:
          err.response?.data?.message || "Failed to email predictions report. Please try again.",
        type: "error",
      });
    } finally {
      setIsEmailing(false);
    }
  };



  useEffect(() => {
    const checkAcknowledgment = () => {
      const ackTimestamp = localStorage.getItem("fis_alert_acknowledged_at");
      if (ackTimestamp) {
        const timestamp = parseInt(ackTimestamp, 10);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        if (now - timestamp < thirtyMinutes) {
          setIsAcknowledged(true);
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

      setTimeout(
        () => {
          setIsAcknowledged(false);
          localStorage.removeItem("fis_alert_acknowledged_at");
        },
        30 * 60 * 1000,
      );
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card shadow-card p-6 relative overflow-hidden bg-cardBg xl:col-span-4"
    >
      {/* Decorative Background Element */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accentPrimary/5 blur-[100px]" />

      <div>
        {/* Header row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between px-2">
          <div>
            <h3 className="text-scale-section font-bold tracking-tight text-textHeading">
              FIS Alert Engine
            </h3>
            <p className="text-scale-caption font-semibold uppercase tracking-wider text-textMuted mt-1">
              Intelligence Core Active
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-lg border border-borderColor bg-bgInput px-3 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-accentPrimary" />
              <span className="text-scale-caption font-bold uppercase tracking-wider text-accentPrimary">
                Live Monitor
              </span>
            </div>
            
            {/* Export dropdown */}
            <Dropdown
              direction="down"
              align="right"
              title="Select Range"
              items={[
                { label: "Last 7 Days", onClick: () => handleExportCSV("7d") },
                { label: "Last 15 Days", onClick: () => handleExportCSV("15d") },
                { label: "Last 30 Days", onClick: () => handleExportCSV("30d") },
              ]}
              trigger={(isOpen, toggle) => (
                <button
                  onClick={toggle}
                  disabled={isExporting}
                  className="flex items-center gap-2 rounded-btn border border-borderColor bg-bgCard px-3 py-1.5 text-scale-caption font-bold uppercase tracking-wider text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>Export Data</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            />
          </div>
        </div>

        {/* Grid of Alert cards styled like AI Insights sub-cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {cards.map((card: any) => {
            const rawIcon = card.icon;
            const isComponent = typeof rawIcon === "function";
            const isElement = isValidElement(rawIcon);
            const IconComponent = isComponent
              ? rawIcon
              : FIS_CARDS.find((c: any) => c.title === card.title)?.icon || Activity;

            const badgeVariant =
              card.status === "Optimal"
                ? "success"
                : card.status === "Warning"
                ? "warning"
                : "danger";

            const barColorClass =
              card.status === "Optimal"
                ? "bg-success"
                : card.status === "Warning"
                ? "bg-warning"
                : "bg-danger";

            const isViewableCard = [
              "Pest Analysis",
              "Fungal Activity",
              "Irrigation Analysis",
            ].includes(card.title);

            return (
              <div
                key={card.title}
                className="rounded-card border border-borderColor bg-bgInput p-5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Icon & Title Row */}
                  <div className="mb-4 flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-bgCard border border-borderColor text-accentPrimary">
                        {isElement ? rawIcon : IconComponent && <IconComponent className="h-4.5 w-4.5" />}
                      </div>
                      <h4 className="text-scale-body font-bold text-textHeading leading-snug">
                        {card.title}
                      </h4>
                    </div>
                    <StatusBadge label={card.status} variant={badgeVariant} size="sm" />
                  </div>

                  <p className="mb-4 text-scale-caption font-medium leading-relaxed text-textSecondary line-clamp-2">
                    {typeof card.body === "object" && card.body !== null
                      ? JSON.stringify(card.body)
                      : card.body}
                  </p>
                </div>

                <div>
                  <div className="hidden sm:block">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                        Metrics
                      </span>
                      <span className="text-scale-caption font-bold text-textHeading">
                        {card.value}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-bgCard border border-borderColor mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${card.value}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`h-full rounded-full ${barColorClass}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-2 sm:mt-0">
                    {isViewableCard ? (
                      <button
                        onClick={() => setSelectedCard(card)}
                        className="rounded-btn border border-borderColor bg-bgCard px-4 py-1.5 text-scale-caption font-bold text-textSecondary transition hover:bg-bgCardHover hover:text-textPrimary hover:border-textSecondary/40"
                      >
                        View More
                      </button>
                    ) : (
                      <span className="text-scale-caption font-bold text-textMuted uppercase tracking-wider">
                        Metrics
                      </span>
                    )}

                    <span className="text-scale-body font-bold text-textHeading">{card.value}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggestion / AI Prescription Panel */}
      <div className="mt-6 rounded-card border border-borderColor bg-bgInput p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bgCard border border-borderColor text-accentPrimary">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <p className="text-scale-body font-bold text-textHeading">
                  {suggestion.title || "AI Prescription"}
                </p>
                <p className="text-scale-caption font-bold uppercase tracking-wider text-accentPrimary/80">
                  Expert Recommendation
                </p>
              </div>
            </div>

            <button
              onClick={handleAcknowledge}
              disabled={isAcknowledged || isSubmitting}
              className={`hidden sm:flex items-center gap-2 rounded-btn px-6 py-2.5 text-scale-caption font-bold transition-all disabled:opacity-50 ${
                isAcknowledged
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-accentPrimary hover:bg-accentHover text-white"
              }`}
            >
              {isAcknowledged ? (
                <>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Acknowledged
                </>
              ) : isSubmitting ? (
                "Processing..."
              ) : (
                "Acknowledge"
              )}
            </button>
          </div>

          <p className="text-scale-caption font-medium leading-relaxed text-textSecondary">
            {typeof suggestion.body === "object" && suggestion.body !== null
              ? JSON.stringify(suggestion.body)
              : suggestion.body}
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                System Confidence
              </span>
              <span className="text-scale-caption font-bold text-textHeading">
                {suggestion.confidence}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-bgCard border border-borderColor">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: suggestion.confidence }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="h-full rounded-full bg-accentPrimary"
              />
            </div>
          </div>

          <button
            onClick={handleAcknowledge}
            disabled={isAcknowledged || isSubmitting}
            className={`flex w-full items-center justify-center gap-2 rounded-btn py-3 text-scale-caption font-bold transition-all disabled:opacity-50 sm:hidden ${
              isAcknowledged
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-accentPrimary hover:bg-accentHover text-white"
            }`}
          >
            {isAcknowledged ? "Acknowledged" : isSubmitting ? "Processing..." : "Acknowledge"}
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <AlertDetailModal
            selectedCard={selectedCard}
            onClose={() => setSelectedCard(null)}
            data={data}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AlertDetailModal({
  selectedCard,
  onClose,
  data,
}: {
  selectedCard: any;
  onClose: () => void;
  data: any;
}) {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-borderColor bg-bgCard p-6 shadow-elevated"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-borderColor pb-4">
          <div className="max-w-[85%]">
            <h3 className="text-scale-card font-bold leading-tight text-textHeading">
              {selectedCard.title}
            </h3>
            <p className="text-scale-caption text-textSecondary font-medium mt-2 leading-relaxed">
              {selectedCard.body}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-bgInput text-textSecondary hover:text-textPrimary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-6 overflow-y-auto" style={{ maxHeight: "60vh" }}>
          {selectedCard.title === "Pest Analysis" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Pest Risk Score
                </h4>
                <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">
                  {selectedCard.value ?? "N/A"}%
                </p>
              </div>
              <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Rainfall
                </h4>
                <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">
                  {selectedCard.rainfall_mm ?? selectedCard.rainfall ?? "N/A"} mm
                </p>
              </div>
              <div className="rounded-lg border border-borderColor bg-bgInput p-4 sm:col-span-2">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Recommendation
                </h4>
                <p className="mt-1.5 text-scale-caption font-medium text-textSecondary leading-relaxed">
                  {selectedCard.recommendation ?? selectedCard.body ?? "N/A"}
                </p>
              </div>
            </div>
          )}

          {selectedCard.title === "Irrigation Analysis" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Confidence
                </h4>
                <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">
                  {selectedCard.confidence ?? data?.suggestion?.confidence ?? "N/A"}
                </p>
              </div>
              <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Decision
                </h4>
                <p className="mt-1.5 text-scale-body font-bold text-textHeading">
                  {selectedCard.decision ?? "N/A"}
                </p>
              </div>
              <div className="rounded-lg border border-borderColor bg-bgInput p-4 sm:col-span-2">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Water Requirement
                </h4>
                <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">
                  {selectedCard.water_requirement_mm ??
                    selectedCard.water_requirement ??
                    "N/A"}{" "}
                  mm
                </p>
              </div>
            </div>
          )}

          {selectedCard.title === "Fungal Activity" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Activity Level
                </h4>
                <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">
                  {selectedCard.activity_level ?? selectedCard.activity ?? "N/A"}
                </p>
              </div>
              <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Dew Point
                </h4>
                <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">
                  {selectedCard.dew_point ?? "N/A"}°C
                </p>
              </div>
              <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Leaf Wetness
                </h4>
                <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">
                  {selectedCard.leaf_wetness_pct ?? selectedCard.leaf ?? "N/A"}%
                </p>
              </div>
              <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Likely Disease
                </h4>
                <p className="mt-1.5 text-scale-body font-bold text-textHeading">
                  {selectedCard.likely_disease ?? "N/A"}
                </p>
              </div>
              <div className="rounded-lg border border-borderColor bg-bgInput p-4 sm:col-span-2">
                <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">
                  Recommendation
                </h4>
                <p className="mt-1.5 text-scale-caption font-medium text-textSecondary leading-relaxed">
                  {selectedCard.recommendation ?? selectedCard.body ?? "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
