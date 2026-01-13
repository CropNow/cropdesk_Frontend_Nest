import React, { useState, useEffect } from 'react';
import { Sprout, Calendar } from 'lucide-react';

const CropDetailsTab = ({
  crops,
  onAdd,
  onUpdate,
  onDelete,
}: {
  crops: any[];
  onAdd: (crop: any) => void;
  onUpdate: (crop: any) => void;
  onDelete: (id: string) => void;
}) => {
  const [editingCrop, setEditingCrop] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cropName: '',
    plantingDate: '',
    harvestingDate: '',
    area: '',
  });

  // When editingCrop changes, update form data
  useEffect(() => {
    if (editingCrop) {
      setFormData({
        cropName: editingCrop.cropName || '',
        plantingDate: editingCrop.plantingDate || '',
        harvestingDate: editingCrop.harvestingDate || '',
        area: editingCrop.area || '',
      });
    } else {
      setFormData({
        cropName: '',
        plantingDate: '',
        harvestingDate: '',
        area: '',
      });
    }
  }, [editingCrop, isAdding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isAdding) {
      onAdd(formData);
      setIsAdding(false);
    } else if (editingCrop) {
      onUpdate({ ...editingCrop, ...formData });
      setEditingCrop(null);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingCrop(null);
  };

  // LIST VIEW
  if (!isAdding && !editingCrop) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-foreground">Crop Details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Current season crops
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-500 text-black rounded-xl font-bold hover:bg-green-400"
          >
            + Add Crop
          </button>
        </div>

        {crops.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">No crops added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-2xl border border-transparent hover:border-green-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-xl">
                    <Sprout size={20} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">
                      {crop.cropName || 'Unnamed Crop'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {crop.area || '0'} acres • Planted:{' '}
                      {crop.plantingDate || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCrop(crop)}
                    className="px-3 py-1.5 bg-muted text-foreground text-xs font-bold rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(crop.id)}
                    className="px-3 py-1.5 bg-[#ffe4e6] text-[#e11d48] text-xs font-bold rounded-lg hover:bg-[#ffced4] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // FORM VIEW (Edit or Add)
  return (
    <div className="bg-card border border-border rounded-3xl p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">
          {isAdding ? 'Add New Crop' : 'Edit Crop Details'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdding ? 'Enter crop information' : 'Update crop information'}
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Crop Name */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Crop Name
          </label>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-muted rounded-xl">
              <Sprout size={18} className="text-foreground" />
            </div>
            <input
              type="text"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
              placeholder="e.g. Wheat, Corn"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Planting Date */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Planting Date
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Calendar size={18} className="text-foreground" />
              </div>
              <input
                type="date"
                name="plantingDate"
                value={formData.plantingDate}
                onChange={handleChange}
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Expected Harvest
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Calendar size={18} className="text-foreground" />
              </div>
              <input
                type="date"
                name="harvestingDate"
                value={formData.harvestingDate}
                onChange={handleChange}
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>
          </div>
        </div>

        {/* Area */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Cultivation Area (Acres)
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8 border-t border-border pt-6">
          <button
            onClick={handleSave}
            className="w-fit px-6 py-2 bg-green-500 text-black rounded-xl text-sm font-bold hover:bg-green-400 transition-all"
          >
            {isAdding ? 'Add Crop' : 'Save Changes'}
          </button>
          <button
            onClick={handleCancel}
            className="w-fit px-6 py-2 bg-muted text-foreground rounded-xl text-sm font-bold hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropDetailsTab;
