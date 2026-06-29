import React from "react";
import { FieldBoundaryMap } from "../FieldBoundaryMap";

interface FieldDetailsStepProps {
  wizardData: {
    fieldName: string;
    area: string;
    boundaryType: string;
    soilType: string;
    irrigationType: string;
    boundaryCoordinates: [number, number][];
  };
  onChange: (fields: Partial<FieldDetailsStepProps["wizardData"]>) => void;
}

export function FieldDetailsStep({ wizardData, onChange }: FieldDetailsStepProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold text-textHeading">Field Details</h4>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
          Field Name *
        </p>
        <input
          value={wizardData.fieldName}
          onChange={(event) => onChange({ fieldName: event.target.value })}
          placeholder="Field Name"
          className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Area *
          </p>
          <input
            value={wizardData.area}
            onChange={(event) => onChange({ area: event.target.value })}
            placeholder="Area (e.g. 5)"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Boundary Type *
          </p>
          <select
            value={wizardData.boundaryType}
            onChange={(event) => onChange({ boundaryType: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          >
            <option value="Polygon">Polygon</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Circle">Circle</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
          Field Location (Draw Shape) *
        </p>
        <FieldBoundaryMap
          boundaryCoordinates={wizardData.boundaryCoordinates}
          onBoundaryChange={(coords, areaAcres) => {
            onChange({
              boundaryCoordinates: coords,
              area: areaAcres,
            });
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Soil Type *
          </p>
          <select
            value={wizardData.soilType}
            onChange={(event) => onChange({ soilType: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          >
            <option value="Loamy">Loamy</option>
            <option value="Sandy Loam">Sandy Loam</option>
            <option value="Clay Loam">Clay Loam</option>
            <option value="Silt Loam">Silt Loam</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Irrigation *
          </p>
          <select
            value={wizardData.irrigationType}
            onChange={(event) => onChange({ irrigationType: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          >
            <option value="Drip">Drip</option>
            <option value="Sprinkler">Sprinkler</option>
            <option value="Furrow">Furrow</option>
            <option value="Pivot">Pivot</option>
          </select>
        </div>
      </div>
    </div>
  );
}
