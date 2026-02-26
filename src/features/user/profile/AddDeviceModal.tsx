import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  Save,
  Activity,
  HardDrive,
  Settings,
  Hash,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dropdown } from '@/components/ui/dropdown';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
  initialData?: any; // Added for editing
}

const AddDeviceModal = ({
  isOpen,
  onClose,
  onAdd,
  initialData,
}: AddDeviceModalProps) => {
  const { selectedFarmer } = useProfile();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Soil Sensor',
    fieldId: '',
    status: 'Active',
    manufacturer: '',
    model: '',
    serialNumber: '',
    firmwareVersion: '',
  });

  const isEditing = !!initialData;

  // Sync with initialData if editing
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || '',
        type:
          initialData.type === 'NEST'
            ? 'NEST (Main Controller)'
            : initialData.type || 'Soil Sensor',
        fieldId: initialData.fieldId || '',
        status: initialData.status || 'Active',
        manufacturer: initialData.manufacturer || '',
        model: initialData.model || '',
        serialNumber: initialData.serialNumber || '',
        firmwareVersion: initialData.firmwareVersion || '',
      });
    } else if (!isOpen) {
      // Reset when closed
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
    }
  }, [initialData, isOpen]);

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

    // Map UI types to Backend enum ['NEST', 'SEED']
    const backendData = {
      ...formData,
      type: formData.type.includes('NEST') ? 'NEST' : 'SEED',
      unit: formData.type.includes('NEST') ? 'status' : 'percentage',
    };

    onAdd(backendData);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg z-10"
          >
            <Card className="flex flex-col shadow-2xl overflow-hidden bg-[#0d0d0d] border-[#1f1f1f] text-white rounded-3xl">
              <CardHeader className="border-b border-[#1f1f1f] py-5 px-6 flex flex-row items-center justify-between bg-gradient-to-r from-[#111] to-[#1a1a1a]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                    <Cpu size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white tracking-tight">
                      {isEditing ? 'Edit Device' : 'Add New Device'}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs">
                      {isEditing
                        ? 'Update device parameters'
                        : 'Register sensor or IoT device'}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </Button>
              </CardHeader>

              <CardContent className="overflow-y-auto p-6 space-y-6 max-h-[70vh]">
                <form
                  id="add-device-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Basic Details */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                        Device Identity *
                      </Label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors">
                          <Settings size={16} />
                        </div>
                        <Input
                          name="name"
                          placeholder="e.g. Field A Moisture Sensor"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-[#151515] border-[#222] text-white focus:border-green-500 focus:ring-1 focus:ring-green-500/20 rounded-xl pl-10 h-11 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                          Type *
                        </Label>
                        <Dropdown
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="bg-[#151515] border-[#222] text-white focus:border-green-500 rounded-xl h-11 transition-all"
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

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                          Field *
                        </Label>
                        <Dropdown
                          name="fieldId"
                          value={formData.fieldId}
                          onChange={handleChange}
                          className="bg-[#151515] border-[#222] text-white focus:border-green-500 rounded-xl h-11 transition-all"
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
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                        Serial Number *
                      </Label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors">
                          <Hash size={16} />
                        </div>
                        <Input
                          name="serialNumber"
                          placeholder="Unique Serial No."
                          value={formData.serialNumber}
                          onChange={handleChange}
                          className="bg-[#151515] border-[#222] text-white focus:border-green-500 focus:ring-1 focus:ring-green-500/20 rounded-xl pl-10 h-11 font-mono transition-all"
                        />
                      </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#222] to-transparent my-1" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                          Manufacturer
                        </Label>
                        <Input
                          name="manufacturer"
                          placeholder="e.g. CropNow"
                          value={formData.manufacturer}
                          onChange={handleChange}
                          className="bg-[#151515] border-[#222] text-white focus:border-green-500 rounded-xl h-11 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                          Model
                        </Label>
                        <Input
                          name="model"
                          placeholder="e.g. MS-200"
                          value={formData.model}
                          onChange={handleChange}
                          className="bg-[#151515] border-[#222] text-white focus:border-green-500 rounded-xl h-11 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                          Status
                        </Label>
                        <Dropdown
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="bg-[#151515] border-[#222] text-white focus:border-green-500 rounded-xl h-11 text-xs"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Maintenance">Maintenance</option>
                        </Dropdown>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                          Firmware
                        </Label>
                        <Input
                          name="firmwareVersion"
                          placeholder="e.g. v1.0"
                          value={formData.firmwareVersion}
                          onChange={handleChange}
                          className="bg-[#151515] border-[#222] text-white focus:border-green-500 rounded-xl h-11 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>

              <CardFooter className="p-6 border-t border-[#1f1f1f] bg-[#0d0d0d] flex flex-col gap-3">
                <Button
                  type="submit"
                  form="add-device-form"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all active:scale-[0.98]"
                >
                  <Save size={18} />
                  {isEditing ? 'Update Device' : 'Add Device'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="w-full text-gray-500 hover:text-white hover:bg-white/5 h-10 rounded-xl transition-all"
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      )}

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertDialogContent className="z-[60] bg-[#1a1a1a] border-[#333] text-white rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2">
                <Info size={20} className="text-amber-500" />
                Missing Information
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Please fill in all required fields marked with *.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => setAlertOpen(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold h-11"
              >
                Okay
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </motion.div>
      </AlertDialog>
    </AnimatePresence>
  );
};

export default AddDeviceModal;
