import React from "react";
import { DeviceKind } from "../../SettingsLayout";

interface DeviceInfoStepProps {
  wizardData: {
    name: string;
    type: DeviceKind;
    fieldName: string;
    fieldId: string;
    serialNumber: string;
    manufacturer: string;
  };
  onChange: (fields: Partial<DeviceInfoStepProps["wizardData"]>) => void;
}

export function DeviceInfoStep({ wizardData, onChange }: DeviceInfoStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
        Device Identity *
      </p>
      <input
        value={wizardData.name}
        onChange={(event) => onChange({ name: event.target.value })}
        placeholder="e.g. Field A Moisture Sensor"
        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Type *
          </p>
          <select
            value={wizardData.type}
            onChange={(event) => onChange({ type: event.target.value as DeviceKind })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          >
            <option value="Seed">Soil Sensor</option>
            <option value="NEST">IoT Tower</option>
            <option value="Drone">Aero Drone</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Selected Field *
          </p>
          <div className="w-full rounded-xl border border-cardBorder bg-cardBg/50 px-4 py-3 text-lg text-textHeading">
            {wizardData.fieldName || "No field selected"}
            <span className="ml-2 text-xs text-textHint">({wizardData.fieldId || "No ID"})</span>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
          Serial Number *
        </p>
        <input
          value={wizardData.serialNumber}
          onChange={(event) => onChange({ serialNumber: event.target.value })}
          placeholder="Unique Serial No."
          className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
          Manufacturer
        </p>
        <input
          value={wizardData.manufacturer}
          onChange={(event) => onChange({ manufacturer: event.target.value })}
          placeholder="e.g. CropNow"
          className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
        />
      </div>
    </div>
  );
}
