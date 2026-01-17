import React, { useState, useEffect } from 'react';
import { Sprout, Calendar, Plus, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const CropDetailsTab = ({
  crop,
  crops,
  onSelectCrop,
  onAdd,
  onUpdate,
  onDelete,
}: {
  crop: any;
  crops: any[];
  onSelectCrop: (id: string) => void;
  onAdd: (crop: any) => void;
  onUpdate: (crop: any) => void;
  onDelete: (id: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cropName: '',
    plantingDate: '',
    harvestingDate: '',
    area: '',
  });

  // Sync with prop
  useEffect(() => {
    if (isAdding) {
      setFormData({
        cropName: '',
        plantingDate: '',
        harvestingDate: '',
        area: '',
      });
      setIsEditing(true);
    } else if (crop) {
      setFormData({
        cropName: crop.cropName || '',
        plantingDate: crop.plantingDate || '',
        harvestingDate: crop.harvestingDate || '',
        area: crop.area || '',
      });
      setIsEditing(false);
    } else {
      // Reset if no crop selected
      setFormData({
        cropName: '',
        plantingDate: '',
        harvestingDate: '',
        area: '',
      });
      setIsEditing(false);
    }
  }, [crop, isAdding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isAdding) {
      onAdd(formData);
      setIsAdding(false);
    } else if (isEditing) {
      onUpdate({ ...crop, ...formData });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const toggleAddMode = () => {
    if (isAdding) {
      setIsAdding(false);
      setIsEditing(false);
    } else {
      setIsAdding(true);
    }
  };

  // No Crop Selected View
  if (!crop && !isAdding) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 flex items-center justify-center min-h-[400px] flex-col gap-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No crop selected.</p>
          <Button
            className="rounded-xl font-bold flex items-center gap-2 mx-auto"
            onClick={toggleAddMode}
          >
            <Plus size={16} />
            Add New Crop
          </Button>
        </div>
      </div>
    );
  }

  // FORM VIEW (Edit or Add)
  return (
    <div className="bg-card border border-border rounded-3xl p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isAdding ? 'Add New Crop' : 'Crop Details'}
          </h2>
        </div>

        {/* Crop Selector */}
        {!isAdding && crops && crops.length > 0 && onSelectCrop && (
          <div className="flex-1 mx-8">
            <Label className="block text-[10px] uppercase font-bold text-white mb-1">
              Select Crop
            </Label>
            <select
              className="w-fit min-w-[200px] bg-zinc-900 text-white border border-zinc-700 rounded-xl font-bold px-4 py-2 text-sm focus:outline-none cursor-pointer"
              value={crop?.id || ''}
              onChange={(e) => onSelectCrop(e.target.value)}
            >
              {crops.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                  className="bg-zinc-800 text-white"
                >
                  {c.cropName || 'Unnamed Crop'}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isAdding && (
          <Button
            onClick={toggleAddMode}
            size="sm"
            className="rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Plus size={16} />
            Add Crop
          </Button>
        )}
        {isAdding && (
          <Button
            onClick={toggleAddMode}
            variant="secondary"
            size="sm"
            className="rounded-xl text-xs font-bold"
          >
            Cancel
          </Button>
        )}
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Crop Name */}
        <div>
          <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Crop Name
          </Label>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-muted rounded-xl">
              <Sprout size={18} className="text-foreground" />
            </div>
            <Input
              type="text"
              name="cropName"
              value={formData.cropName}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
              placeholder={!isEditing ? '' : 'e.g. Wheat, Corn'}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Planting Date */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Planting Date
            </Label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Calendar size={18} className="text-foreground" />
              </div>
              <Input
                type="date"
                name="plantingDate"
                value={formData.plantingDate}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
              />
            </div>
          </div>

          {/* Harvest Date */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Expected Harvest
            </Label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Calendar size={18} className="text-foreground" />
              </div>
              <Input
                type="date"
                name="harvestingDate"
                value={formData.harvestingDate}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Area */}
        <div>
          <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Cultivation Area (Acres)
          </Label>
          <Input
            type="text"
            name="area"
            value={formData.area}
            readOnly={!isEditing}
            onChange={handleChange}
            className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8 border-t border-border pt-6">
          <Button
            onClick={handleSave}
            variant={isEditing ? 'default' : 'secondary'}
            className="w-fit rounded-xl text-xs font-bold"
          >
            {isAdding
              ? 'Save New Crop'
              : isEditing
                ? 'Save Changes'
                : 'Edit Details'}
          </Button>
          {!isAdding && (
            <Button
              onClick={() => onDelete(crop.id)}
              variant="destructive"
              className="w-fit rounded-xl text-xs font-bold"
            >
              Delete Crop
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDetailsTab;
