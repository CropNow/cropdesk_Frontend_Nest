export interface CachedDashboardState {
  timestamp: number;
  dashboardData: any;
  backendDevices: any[];
}

export function saveDashboardCache(
  farmId: string,
  deviceType: string,
  deviceIndex: number,
  dashboardData: any,
  backendDevices: any[],
): void {
  try {
    const key = `cropdesk_cache_${farmId}_${deviceType}_${deviceIndex}`;
    const payload = {
      timestamp: Date.now(),
      dashboardData,
      backendDevices,
    };
    localStorage.setItem(key, JSON.stringify(payload));
    localStorage.setItem("cropdesk_last_sync_timestamp", Date.now().toString());
  } catch (e) {}
}

export function loadDashboardCache(
  farmId: string,
  deviceType: string,
  deviceIndex: number,
): CachedDashboardState | null {
  try {
    const key = `cropdesk_cache_${farmId}_${deviceType}_${deviceIndex}`;
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function saveFarmsCache(farms: any[], selectedFarmId: string | null): void {
  try {
    localStorage.setItem("cropdesk_cached_farms", JSON.stringify(farms));
    if (selectedFarmId) {
      localStorage.setItem("cropdesk_cached_selected_farm_id", selectedFarmId);
    }
  } catch (e) {}
}

export function loadFarmsCache(): { farms: any[]; selectedFarmId: string | null } {
  try {
    const farmsStr = localStorage.getItem("cropdesk_cached_farms");
    const selectedFarmId = localStorage.getItem("cropdesk_cached_selected_farm_id");
    const farms = farmsStr ? JSON.parse(farmsStr) : [];
    return { farms, selectedFarmId };
  } catch (e) {
    return { farms: [], selectedFarmId: null };
  }
}

export function getLastSyncTimestamp(): number | null {
  const ts = localStorage.getItem("cropdesk_last_sync_timestamp");
  return ts ? parseInt(ts, 10) : null;
}
