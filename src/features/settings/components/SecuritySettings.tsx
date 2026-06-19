import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SecuritySettingsState, SessionState } from "./SettingsLayout";
import { authAPI } from "@features/auth/api/auth.api";
import { parseUserAgent, formatTimeAgo } from "@shared/utils/formatUtils";
import { useToast } from "@app/providers/ToastContext";

interface SecuritySettingsProps {
  values: SecuritySettingsState;
  onChange: (patch: Partial<SecuritySettingsState>) => void;
  onLogoutAll: () => void;
  onSave: () => void;
  isSaving: boolean;
}

function ToggleSwitch({
  checked,
  onToggle,
  disabled = false,
}: {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      disabled={disabled}
      className={[
        "relative h-6 w-11 flex-shrink-0 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accentPrimary/40 focus:ring-offset-1 focus:ring-offset-transparent",
        checked
          ? "border-accentPrimary/60 bg-accentPrimary/25 shadow-[0_0_10px_rgba(0,255,156,0.2)]"
          : "border-cardBorder bg-cardBg",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      ].join(" ")}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={[
          "absolute left-0 top-[3px] h-4 w-4 rounded-full transition-colors duration-300",
          checked
            ? "bg-accentPrimary shadow-[0_0_6px_rgba(0,255,156,0.5)]"
            : "bg-textMuted",
        ].join(" ")}
      />
    </button>
  );
}

export function SecuritySettings({
  values,
  onChange,
  onLogoutAll,
  onSave,
  isSaving,
}: SecuritySettingsProps) {
  const { addToast } = useToast();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [sessions, setSessions] = useState<SessionState[]>(
    values.activeSessions || [],
  );
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null,
  );
  const [sessionToLogout, setSessionToLogout] = useState<SessionState | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoadingSessions(true);
        const response = await authAPI.getSessions();
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setSessions(data);
        }
      } catch (err) {
        console.error("Failed to fetch active sessions:", err);
      } finally {
        setIsLoadingSessions(false);
      }
    };
    fetchSessions();
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (
      values.newPassword ||
      values.confirmPassword ||
      values.currentPassword
    ) {
      if (!values.currentPassword) {
        setError("Current password is required to set a new password.");
        return;
      }

      if (values.newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }

      if (values.newPassword !== values.confirmPassword) {
        setError("New password and confirm password must match.");
        return;
      }

      try {
        setIsChangingPassword(true);
        await authAPI.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });

        setSuccess("Password changed successfully.");
        onChange({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to change password. Please try again.",
        );
        return; // Return early so we don't show generic success toast if this failed
      } finally {
        setIsChangingPassword(false);
      }
    }

    onSave();
  };

  const handleLogoutAll = async () => {
    try {
      setError("");
      setSuccess("");
      setIsLoadingSessions(true);
      await authAPI.deleteSessions();
      setSessions([]);
      setSuccess("All other sessions terminated successfully.");
      onLogoutAll();
    } catch (err: any) {
      console.error("Failed to logout all devices:", err);
      setError(
        err.response?.data?.message ||
          "Failed to logout from other devices. Please try again.",
      );
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleLogoutSingle = async () => {
    if (!sessionToLogout) return;
    const targetSessionId = sessionToLogout.id || (sessionToLogout as any)._id;
    if (!targetSessionId) return;

    setIsModalOpen(false);
    setDeletingSessionId(targetSessionId);

    try {
      await authAPI.deleteSession(targetSessionId);
      setSessions((prev) =>
        prev.filter((s) => (s.id || (s as any)._id) !== targetSessionId),
      );
      addToast({ message: "Device logged out successfully.", type: "success" });
    } catch (err: any) {
      console.error("Failed to log out device:", err);
      addToast({
        message: "Failed to log out device. Please try again.",
        type: "error",
      });
    } finally {
      setDeletingSessionId(null);
      setSessionToLogout(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Current Password</span>
          <input
            type="password"
            value={values.currentPassword}
            onChange={(event) =>
              onChange({ currentPassword: event.target.value })
            }
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">New Password</span>
          <input
            type="password"
            value={values.newPassword}
            onChange={(event) => onChange({ newPassword: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Confirm Password</span>
          <input
            type="password"
            value={values.confirmPassword}
            onChange={(event) =>
              onChange({ confirmPassword: event.target.value })
            }
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          />
        </label>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-cardBorder bg-bgInput px-4 py-3">
        <span className="text-sm text-textBody">Two-factor authentication</span>
        <ToggleSwitch
          checked={values.twoFactorEnabled}
          onToggle={() =>
            onChange({ twoFactorEnabled: !values.twoFactorEnabled })
          }
        />
      </div>

      <div className="rounded-2xl border border-cardBorder bg-bgInput p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-textBody">Active Sessions</p>
          <button
            type="button"
            onClick={handleLogoutAll}
            disabled={isLoadingSessions}
            className="rounded-lg border border-rose-500/40 dark:border-rose-400/40 bg-rose-500/10 dark:bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-200 disabled:opacity-50 transition hover:bg-rose-500/20 dark:hover:bg-rose-400/20"
          >
            Logout all devices
          </button>
        </div>

        {isLoadingSessions ? (
          <p className="text-sm text-textMuted">Loading active sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-textMuted">No active sessions.</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session: any) => {
              const sessionId = session.id || session._id;
              const isCurrent =
                session.isCurrent ||
                session.current ||
                session.lastActive === "Now";
              const isDeleting = deletingSessionId === sessionId;
              return (
                <div
                  key={sessionId}
                  className="rounded-xl border border-cardBorder bg-cardBg px-3 py-2"
                >
                  <div className="flex items-center justify-between space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <p className="text-sm font-semibold text-textBody">
                          {session.device ||
                            session.deviceName ||
                            "Unknown Device"}
                        </p>
                        {isCurrent && (
                          <span className="rounded-full bg-accentPrimary/15 px-2.5 py-0.5 text-[10px] font-bold text-accentPrimary uppercase tracking-wider">
                            This Device
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-textMuted mt-1">
                        {session.location || session.ip || "Unknown Location"} •{" "}
                        {formatTimeAgo(
                          session.lastActive || session.createdAt || "",
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isDeleting || deletingSessionId !== null}
                      onClick={() => {
                        setSessionToLogout(session);
                        setIsModalOpen(true);
                      }}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDeleting ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving || isChangingPassword}
        className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving || isChangingPassword ? "Saving..." : "Save Changes"}
      </motion.button>

      <AnimatePresence>
        {isModalOpen && sessionToLogout && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cardBorder bg-bgSidebar p-6 shadow-2xl z-10"
            >
              <h3 className="text-lg font-bold text-textPrimary mb-2">
                Logout Device?
              </h3>
              <p className="text-sm text-textSecondary mb-6 leading-relaxed">
                Are you sure you want to log out this device?
                <br />
                <br />
                This session will be terminated immediately and the user will
                need to sign in again to access CropDesk.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-cardBorder bg-bgInput px-4 py-2.5 text-sm font-semibold text-textBody transition hover:bg-bgCardHover"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutSingle}
                  className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
