import React, { useState, useEffect } from 'react';
import { X, Cpu, Save, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dropdown } from '@/components/ui/dropdown';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProfile } from './context/useProfile';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (deviceData: any) => void;
}

const AddDeviceModal = ({ isOpen, onClose, onAdd }: AddDeviceModalProps) => {
  const { selectedFarmer } = useProfile();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Soil Sensor', // Default
    fieldId: '',
    status: 'Active',
    manufacturer: '',
    model: '',
    serialNumber: '',
    firmwareVersion: '',
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [availableFields, setAvailableFields] = useState<any[]>([]);

  // Extract available fields from the selected farmer's farms
  useEffect(() => {
    if (selectedFarmer && selectedFarmer.farms) {
      const fields = selectedFarmer.farms.flatMap((farm: any) =>
        (farm.fields || []).map((field: any) => ({
          id: field.id || field._id,
          name: field.fieldName || field.name || 'Unnamed Field',
          farmName: farm.name || farm.farmName,
        }))
      );
      setAvailableFields(fields);

      // Auto-select first field if available and not set
      if (fields.length > 0 && !formData.fieldId) {
        setFormData((prev) => ({ ...prev, fieldId: fields[0].id }));
      }
    }
  }, [selectedFarmer]);

  const deviceTypes = [
    'Soil Sensor',
    'Weather Station',
    'Camera',
    'Drone',
    'Irrigation Controller',
    'Gateway',
    'NEST (Main Controller)',
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.serialNumber ||
      !formData.type ||
      !formData.fieldId
    ) {
      setAlertOpen(true);
      return;
    }
    onAdd(formData);
    // Reset form
    setFormData({
      name: '',
      type: 'Soil Sensor',
      fieldId: availableFields.length > 0 ? availableFields[0].id : '',
      status: 'Active',
      manufacturer: '',
      model: '',
      serialNumber: '',
      firmwareVersion: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <Card className="w-full max-w-3xl flex flex-col shadow-2xl p-0 overflow-hidden bg-[#0d0d0d] border-[#1f1f1f] text-white">
          <CardHeader className="border-b border-[#1f1f1f] py-4 px-6 flex flex-row items-center justify-between bg-[#111111]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Cpu size={24} />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  Add New Device
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Register a new sensor or IoT device
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-8 space-y-8">
            <form
              id="add-device-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* CORE INFORMATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400 uppercase text-xs font-bold tracking-wider">
                  <Activity size={14} />
                  Core Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400">
                      Device Name *
                    </Label>
                    <Input
                      name="name"
                      placeholder="e.g. Field A Moisture Sensor"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#333] text-white focus:border-green-500 rounded-lg h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400">
                      Device Type *
                    </Label>
                    <Dropdown
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#333] text-white focus:border-green-500 rounded-lg h-11"
                    >
                      {deviceTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-[#1a1a1a]"
                        >
                          {type}
                        </option>
                      ))}
                    </Dropdown>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400">
                      Field ID *
                    </Label>
                    <Dropdown
                      name="fieldId"
                      value={formData.fieldId}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#333] text-white focus:border-green-500 rounded-lg h-11"
                    >
                      <option value="" disabled className="bg-[#1a1a1a]">
                        Select Field
                      </option>
                      {availableFields.map((field) => (
                        <option
                          key={field.id}
                          value={field.id}
                          className="bg-[#1a1a1a]"
                        >
                          {field.name}
                        </option>
                      ))}
                    </Dropdown>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400">
                      Status
                    </Label>
                    <Dropdown
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#333] text-white focus:border-green-500 rounded-lg h-11"
                    >
                      <option value="Active" className="bg-[#1a1a1a]">
                        Active
                      </option>
                      <option value="Inactive" className="bg-[#1a1a1a]">
                        Inactive
                      </option>
                      <option value="Maintenance" className="bg-[#1a1a1a]">
                        Maintenance
                      </option>
                    </Dropdown>
                  </div>
                </div>
              </div>

              {/* HARDWARE IDENTITY */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400 uppercase text-xs font-bold tracking-wider">
                  <Cpu size={14} />
                  Hardware Identity
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400">
                      Manufacturer
                    </Label>
                    <Input
                      name="manufacturer"
                      placeholder="e.g. CropNow Systems"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#333] text-white focus:border-green-500 rounded-lg h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400">
                      Model
                    </Label>
                    <Input
                      name="model"
                      placeholder="e.g. MS-200"
                      value={formData.model}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#333] text-white focus:border-green-500 rounded-lg h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400">
                      Serial Number *
                    </Label>
                    <Input
                      name="serialNumber"
                      placeholder="Unique Serial No."
                      value={formData.serialNumber}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#333] text-white focus:border-green-500 rounded-lg h-11 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400">
                      Firmware Version
                    </Label>
                    <Input
                      name="firmwareVersion"
                      placeholder="e.g. v1.0.4"
                      value={formData.firmwareVersion}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#333] text-white focus:border-green-500 rounded-lg h-11"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="p-6 border-t border-[#1f1f1f] bg-[#111111] flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-device-form"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Save size={18} />
              Add Device
            </Button>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="z-[60] bg-[#1a1a1a] border-[#333] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Missing Information
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Please fill in all required fields marked with *.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertOpen(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddDeviceModal;
