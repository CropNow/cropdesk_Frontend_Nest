/**
 * useNotificationSettings hook
 * Fetches and updates notification preferences via the real API.
 */

import { useState, useEffect, useCallback } from "react";
import { notificationsAPI } from "@features/settings/api/settings.api";
import { NotificationPreferences } from "@shared/types/settings.types";

const DEFAULT_PREFERENCES: NotificationPreferences = {
  alertTypes: { pest: true, fungal: true, irrigation: true, weather: true },
  channels: { sms: false, email: true, push: true },
  pushTokens: [],
};

export type NotificationStatus =
  | "idle"
  | "loading"
  | "saving"
  | "testing"
  | "registering";

export const useNotificationSettings = () => {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [status, setStatus] = useState<NotificationStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const fetchPreferences = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await notificationsAPI.getPreferences();
      const data = res.data?.data ?? res.data;
      if (data) setPreferences(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Failed to load notification preferences",
      );
    } finally {
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const savePreferences = useCallback(
    async (patch: {
      alertTypes?: Partial<NotificationPreferences["alertTypes"]>;
      channels?: Partial<NotificationPreferences["channels"]>;
    }) => {
      setStatus("saving");
      setError(null);
      try {
        const res = await notificationsAPI.updatePreferences(patch);
        const updated = res.data?.data ?? res.data;
        if (updated) setPreferences(updated);
        showSuccess("Notification preferences saved successfully");
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to save preferences");
        throw err;
      } finally {
        setStatus("idle");
      }
    },
    [],
  );

  const registerDeviceToken = useCallback(async (token: string) => {
    if (!token.trim()) {
      setError("Device token cannot be empty");
      return;
    }
    setStatus("registering");
    setError(null);
    try {
      await notificationsAPI.registerDeviceToken(token.trim());
      showSuccess("Device token registered successfully");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Failed to register device token",
      );
      throw err;
    } finally {
      setStatus("idle");
    }
  }, []);

  const sendTestNotification = useCallback(async () => {
    setStatus("testing");
    setError(null);
    try {
      await notificationsAPI.sendTestNotification();
      showSuccess("Test notification triggered successfully!");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Failed to send test notification",
      );
      throw err;
    } finally {
      setStatus("idle");
    }
  }, []);

  return {
    preferences,
    setPreferences,
    status,
    isLoading: status === "loading",
    isSaving: status === "saving",
    isTesting: status === "testing",
    isRegistering: status === "registering",
    error,
    successMessage,
    fetchPreferences,
    savePreferences,
    registerDeviceToken,
    sendTestNotification,
  };
};
