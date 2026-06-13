/**
 * Dashboard Cache Utilities
 * Persists the latest dashboard API response to localStorage so the
 * dashboard can render cached data when the user is offline.
 *
 * Keys used:
 *   dashboard-data        — serialised dashboard snapshot
 *   dashboard-last-sync   — ISO timestamp of when the data was saved
 */

const DATA_KEY = 'dashboard-data';
const SYNC_KEY = 'dashboard-last-sync';

export interface DashboardCachePayload {
  dashboardData: any;
  devices: any[];
  farms: any[];
  selectedFarmId: string | null;
}

/**
 * Persist the latest successful fetch result.
 * Call this every time a real API fetch succeeds.
 */
export function saveDashboardCache(payload: DashboardCachePayload): void {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(payload));
    localStorage.setItem(SYNC_KEY, new Date().toISOString());
  } catch (e) {
    // localStorage quota exceeded or private mode — silently ignore
    console.warn('[DashboardCache] Failed to save cache:', e);
  }
}

/**
 * Return the cached payload, or null if nothing is stored yet.
 */
export function loadDashboardCache(): DashboardCachePayload | null {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DashboardCachePayload;
  } catch (e) {
    console.warn('[DashboardCache] Failed to load cache:', e);
    return null;
  }
}

/**
 * Return the timestamp of the last successful sync, or null.
 */
export function getLastSyncTime(): Date | null {
  try {
    const iso = localStorage.getItem(SYNC_KEY);
    if (!iso) return null;
    return new Date(iso);
  } catch {
    return null;
  }
}

/**
 * Format a Date for display: "13 Jun 2026, 10:49 AM"
 */
export function formatSyncTime(date: Date): string {
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Wipe the cached data (e.g. on logout).
 */
export function clearDashboardCache(): void {
  try {
    localStorage.removeItem(DATA_KEY);
    localStorage.removeItem(SYNC_KEY);
  } catch {
    // ignore
  }
}
