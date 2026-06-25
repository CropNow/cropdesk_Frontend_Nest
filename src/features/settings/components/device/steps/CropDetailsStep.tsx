import React from "react";

interface CropDetailsStepProps {
  wizardData: {
    cropName: string;
    plantingDate: string;
    expectedHarvest: string;
    cultivationArea: string;
  };
  onChange: (fields: Partial<typeof props.wizardData>) => void;
}

export function CropDetailsStep({ wizardData, onChange }: CropDetailsStepProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold text-textHeading">Crop Details</h4>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
          Crop Name *
        </p>
        <input
          value={wizardData.cropName}
          onChange={(event) => onChange({ cropName: event.target.value })}
          placeholder="e.g. Wheat, Corn"
          className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Planting Date *
          </p>
          <input
            type="date"
            value={wizardData.plantingDate}
            onChange={(event) => onChange({ plantingDate: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none [color-scheme:dark]"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Expected Harvest *
          </p>
          <input
            type="date"
            value={wizardData.expectedHarvest}
            onChange={(event) => onChange({ expectedHarvest: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none [color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
          Cultivation Area (Acres) *
        </p>
        <input
          value={wizardData.cultivationArea}
          onChange={(event) => onChange({ cultivationArea: event.target.value })}
          placeholder="Area in acres"
          className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
        />
      </div>
    </div>
  );
}
