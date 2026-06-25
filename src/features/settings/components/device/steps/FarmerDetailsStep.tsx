import React from "react";

interface FarmerDetailsStepProps {
  wizardData: {
    farmerName: string;
    phoneNumber: string;
    emailAddress: string;
    village: string;
    district: string;
    farmerState: string;
  };
  onChange: (fields: Partial<typeof props.wizardData>) => void;
}

export function FarmerDetailsStep({ wizardData, onChange }: FarmerDetailsStepProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold text-textHeading">Farmer Details</h4>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
          Full Name *
        </p>
        <input
          value={wizardData.farmerName}
          onChange={(event) => onChange({ farmerName: event.target.value })}
          placeholder="Full Name"
          className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Phone Number *
          </p>
          <input
            value={wizardData.phoneNumber}
            onChange={(event) => onChange({ phoneNumber: event.target.value })}
            placeholder="Phone Number"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Email Address *
          </p>
          <input
            value={wizardData.emailAddress}
            onChange={(event) => onChange({ emailAddress: event.target.value })}
            placeholder="Email Address"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            Village *
          </p>
          <input
            value={wizardData.village}
            onChange={(event) => onChange({ village: event.target.value })}
            placeholder="Village"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            District *
          </p>
          <input
            value={wizardData.district}
            onChange={(event) => onChange({ district: event.target.value })}
            placeholder="District"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
            State *
          </p>
          <input
            value={wizardData.farmerState}
            onChange={(event) => onChange({ farmerState: event.target.value })}
            placeholder="State"
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
          />
        </div>
      </div>
    </div>
  );
}
