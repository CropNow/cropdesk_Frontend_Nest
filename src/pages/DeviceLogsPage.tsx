import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Radio, WifiOff, Clock, Search, Server, Power, AlertCircle } from 'lucide-react';
import { sensorsAPI } from '../api/sensors.api';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

type DeviceLog = {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  isOnline: boolean;
  installationDate: string | null;
  lastOfflineTiming: string | null;
  offlineDuration: string | null;
  farmName?: string;
  statusText: string;
};

export function DeviceLogsPage() {
  const [logs, setLogs] = useState<DeviceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDeviceLogs();
  }, []);

  const fetchDeviceLogs = async () => {
    setIsLoading(true);
    try {
      const todayDate = new Date().toISOString().split('T')[0].replace(/-/g, '/'); // format YYYY/MM/DD
      
      const res = await sensorsAPI.getSensors();
      const rawSensors = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      
      const nestSensors = rawSensors.filter((s: any) => s.type === 'NEST' || s.serialNumber);

      const logsData: DeviceLog[] = await Promise.all(
        nestSensors.map(async (sensor: any) => {
          let isOnline = false;
          let statusTxt = 'Unknown';
          let lastOffline = null;
          let offlineDurationStr = null;

          try {
            if (sensor.serialNumber) {
              const nestRes = await sensorsAPI.getNestDeviceData(sensor.serialNumber, todayDate);
              const data = nestRes.data;
              
              if (data?.status === 'online') {
                isOnline = true;
                statusTxt = 'Active & Streaming';
              } else {
                isOnline = false;
                statusTxt = data?.reason || 'Device Offline';
                lastOffline = data?.lastValidTimestamp || sensor.updatedAt || null;
                
                if (lastOffline) {
                  const diff = Date.now() - new Date(lastOffline).getTime();
                  if (diff > 0) {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    offlineDurationStr = `${hours}h ${mins}m`;
                  }
                }
              }
            } else {
              // Fallback for non-nest or missing serial
              isOnline = sensor.status === 'active';
              statusTxt = sensor.status;
            }
          } catch (err) {
            isOnline = false;
            statusTxt = 'Connection Error';
            lastOffline = sensor.updatedAt || null;
          }

          return {
            id: sensor._id || sensor.id,
            name: sensor.name || 'Unknown Device',
            type: sensor.type || 'NEST',
            serialNumber: sensor.serialNumber || 'N/A',
            isOnline,
            installationDate: sensor.createdAt || sensor.installationDate || null,
            lastOfflineTiming: lastOffline,
            offlineDuration: offlineDurationStr,
            farmName: sensor.farm?.name || 'Main Farm',
            statusText: statusTxt
          };
        })
      );

      setLogs(logsData);
    } catch (error) {
      console.error('Failed to fetch device logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-textHeading">Device Logs</h1>
          <p className="mt-1 text-sm text-textSecondary">Real-time connectivity and operational history for all deployed devices.</p>
        </div>
        
        <div className="relative max-w-sm flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-textMuted" />
          </div>
          <input
            type="text"
            className="w-full rounded-2xl border border-cardBorder bg-cardBg py-2.5 pl-10 pr-4 text-sm text-textPrimary placeholder-textMuted outline-none transition-all hover:border-textMuted/30 focus:border-accentPrimary/50 focus:ring-1 focus:ring-accentPrimary/50"
            placeholder="Search by device name or serial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-cardBorder bg-cardBg p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Online Devices</p>
              <h3 className="text-2xl font-bold text-textHeading">{logs.filter(l => l.isOnline).length}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-cardBorder bg-cardBg p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <WifiOff className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Offline Devices</p>
              <h3 className="text-2xl font-bold text-textHeading">{logs.filter(l => !l.isOnline).length}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-cardBorder bg-cardBg p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Total Devices</p>
              <h3 className="text-2xl font-bold text-textHeading">{logs.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-cardBorder bg-cardBg/50 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cardBorder bg-black/20">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 font-semibold text-textSecondary">Device Name</th>
                <th className="whitespace-nowrap px-6 py-4 font-semibold text-textSecondary">Status</th>
                <th className="whitespace-nowrap px-6 py-4 font-semibold text-textSecondary">Installation Date</th>
                <th className="whitespace-nowrap px-6 py-4 font-semibold text-textSecondary">Last Offline Timing</th>
                <th className="whitespace-nowrap px-6 py-4 font-semibold text-textSecondary">Offline Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder">
              <AnimatePresence>
                {filteredLogs.map((log) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${log.isOnline ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-red-500/20 bg-red-500/10 text-red-400'}`}>
                          {log.isOnline ? <Activity className="h-5 w-5" /> : <Power className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-textHeading">{log.name}</p>
                          <p className="text-xs text-textMuted font-mono">SN: {log.serialNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${log.isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${log.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                        {log.isOnline ? 'ONLINE' : 'OFFLINE'}
                      </span>
                      <p className="mt-1 text-[10px] text-textMuted uppercase tracking-wider">{log.statusText}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-textSecondary">
                        <Clock className="h-4 w-4 text-emerald-500/70" />
                        <span>{formatTime(log.installationDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-textSecondary">
                        {!log.isOnline ? (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-500/70" />
                            <span>{formatTime(log.lastOfflineTiming)}</span>
                          </>
                        ) : (
                          <span className="text-textMuted">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-textSecondary">
                        {!log.isOnline && log.offlineDuration ? (
                          <>
                            <Clock className="h-4 w-4 text-amber-500/70" />
                            <span className="font-medium text-amber-500/90">{log.offlineDuration}</span>
                          </>
                        ) : (
                          <span className="text-textMuted">—</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Server className="h-12 w-12 text-textMuted opacity-50 mb-4" />
              <p className="text-lg font-medium text-textHeading">No devices found</p>
              <p className="text-sm text-textSecondary mt-1">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DeviceLogsPage;
