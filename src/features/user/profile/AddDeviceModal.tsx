import React, { useState } from 'react';
import { X, Cpu, Activity, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (device: any) => void;
}

const AddDeviceModal = ({ isOpen, onClose, onAdd }: AddDeviceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    fieldId: '',
    status: 'Active',
    manufacturer: '',
    model: '',
    serialNumber: '',
    firmwareVersion: '',
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.fieldId) {
      alert('Please fill in all required fields marked with *');
      return;
    }
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#1a1a1a]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <Cpu className="text-green-500 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Device</h2>
              <p className="text-sm text-gray-400 mt-1">
                Register a new sensor or IoT device
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          className="p-6 overflow-y-auto flex-1 space-y-8"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#555 #121212',
          }}
        >
          {/* Core Information Section */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-white uppercase tracking-wider">
              <Activity className="w-4 h-4 text-white" />
              Core Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs text-gray-400 font-semibold">
                  Device Name *
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Field A Moisture Sensor"
                  className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-green-500/50 h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-400 font-semibold">
                  Device Type *
                </Label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border bg-[#0a0a0a] border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent placeholder:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  required
                >
                  <option value="" disabled>
                    Select Device Type
                  </option>
                  <option value="NEST">NEST (Main Controller)</option>
                  <option value="SENSOR_NODE">Sensor Node</option>
                  <option value="VALVE_CONTROLLER">Valve Controller</option>
                  <option value="WEATHER_STATION">Weather Station</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-400 font-semibold">
                  Field ID *
                </Label>
                <Input
                  name="fieldId"
                  value={formData.fieldId}
                  onChange={handleChange}
                  placeholder="Enter Field ID"
                  className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-green-500/50 h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-400 font-semibold">
                  Status
                </Label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border bg-[#0a0a0a] border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent placeholder:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full"></div>

          {/* Hardware Identity Section */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-white uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-white" />
              Hardware Identity
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs text-gray-400 font-semibold">
                  Manufacturer
                </Label>
                <Input
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. CropNow Systems"
                  className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-green-500/50 h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-400 font-semibold">
                  Model
                </Label>
                <Input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. MS-200"
                  className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-green-500/50 h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-400 font-semibold">
                  Serial Number
                </Label>
                <Input
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Unique Serial No."
                  className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-green-500/50 h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-400 font-semibold">
                  Firmware Version
                </Label>
                <Input
                  name="firmwareVersion"
                  value={formData.firmwareVersion}
                  onChange={handleChange}
                  placeholder="e.g. v1.0.4"
                  className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-green-500/50 h-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 flex items-center gap-2"
          >
            <Save size={18} />
            Add Device
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
