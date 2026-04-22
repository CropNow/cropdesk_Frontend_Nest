/**
 * Devices API endpoints
 */

import apiClient from './client';

export const devicesAPI = {
  /**
   * Get all devices for a farm
   */
  getDevices: (farmId: string) =>
    apiClient.get(`/devices/farm/${farmId}`),

  /**
   * Get single device details
   */
  getDevice: (deviceId: string) =>
    apiClient.get(`/devices/${deviceId}`),

  /**
   * Update device configuration
   */
  updateDevice: (deviceId: string, data: any) =>
    apiClient.patch(`/devices/${deviceId}`, data),

  /**
   * Get device status and health
   */
  getDeviceStatus: (deviceId: string) =>
    apiClient.get(`/devices/${deviceId}/status`),

  /**
   * Delete a device
   */
  deleteDevice: (deviceId: string) =>
    apiClient.delete(`/devices/${deviceId}`),

  /**
   * Add new device to farm
   */
  addDevice: (farmId: string, data: any) =>
    apiClient.post(`/devices/farm/${farmId}`, data),
};
