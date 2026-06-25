/**
 * Devices API endpoints
 */

import apiClient from "@services/api/apiClient";
import { Device } from "@shared/types/device.types";

export type UpdateDeviceData = Partial<Pick<Device, "name" | "type" | "location" | "status">>;

export type AddDeviceData = Pick<Device, "name" | "type" | "location"> &
  Partial<Pick<Device, "batteryLevel" | "signalStrength">>;

export const devicesAPI = {
  /**
   * Get all devices for a farm
   */
  getDevices: (farmId: string) => apiClient.get(`/devices/farm/${farmId}`),

  /**
   * Get single device details
   */
  getDevice: (deviceId: string) => apiClient.get(`/devices/${deviceId}`),

  /**
   * Update device configuration
   */
  updateDevice: (deviceId: string, data: UpdateDeviceData) =>
    apiClient.patch(`/devices/${deviceId}`, data),

  /**
   * Get device status and health
   */
  getDeviceStatus: (deviceId: string) => apiClient.get(`/devices/${deviceId}/status`),

  /**
   * Delete a device
   */
  deleteDevice: (deviceId: string) => apiClient.delete(`/devices/${deviceId}`),

  /**
   * Add new device to farm
   */
  addDevice: (farmId: string, data: AddDeviceData) =>
    apiClient.post(`/devices/farm/${farmId}`, data),
};
