import React from "react";

interface FarmDetailsStepProps {
  wizardData: {
    farmName: string;
    addressLine: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    soilType: string;
    irrigationType: string;
    farmingType: string;
    area: string;
  };
  onChange: (fields: Partial<typeof props.wizardData>) => void;
}

export function FarmDetailsStep({ wizardData, onChange }: FarmDetailsStepProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold text-textHeading">Farm Details</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Name *
          </p>
          <input
            value={wizardData.farmName}
            onChange={(event) => onChange({ farmName: event.target.value })}
            placeholder="Farm Name"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Address Line *
          </p>
          <input
            value={wizardData.addressLine}
            onChange={(event) => onChange({ addressLine: event.target.value })}
            placeholder="Address / Landmark"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            City *
          </p>
          <input
            value={wizardData.city}
            onChange={(event) => onChange({ city: event.target.value })}
            placeholder="City"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            State *
          </p>
          <input
            value={wizardData.state}
            onChange={(event) => onChange({ state: event.target.value })}
            placeholder="State"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Country *
          </p>
          <input
            value={wizardData.country}
            onChange={(event) => onChange({ country: event.target.value })}
            placeholder="Country"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Zipcode *
          </p>
          <input
            value={wizardData.zipCode}
            onChange={(event) => onChange({ zipCode: event.target.value })}
            placeholder="Zip Code"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
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
            Irrigation Type *
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

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
          Farming Type *
        </p>
        <select
          value={wizardData.farmingType}
          onChange={(event) => onChange({ farmingType: event.target.value })}
          className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
        >
          <option value="conventional">Conventional</option>
          <option value="organic">Organic</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>
    </div>
  );
}
