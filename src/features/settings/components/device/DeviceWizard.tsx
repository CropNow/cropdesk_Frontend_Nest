import React from "react";
import { createPortal } from "react-dom";
import { Cpu, X } from "lucide-react";
import { WizardStep } from "../../hooks/useDeviceWizard";
import { FarmerDetailsStep } from "./steps/FarmerDetailsStep";
import { FarmDetailsStep } from "./steps/FarmDetailsStep";
import { FieldDetailsStep } from "./steps/FieldDetailsStep";
import { CropDetailsStep } from "./steps/CropDetailsStep";
import { DeviceInfoStep } from "./steps/DeviceInfoStep";

interface DeviceWizardProps {
  step: WizardStep;
  wizardData: any;
  isSubmitting: boolean;
  error: string;
  successMessage: string;
  onChange: (fields: Partial<any>) => void;
  goNext: () => Promise<void>;
  goPrev: () => void;
  submitWizard: () => Promise<void>;
  resetWizard: () => void;
}

export function DeviceWizard({
  step,
  wizardData,
  isSubmitting,
  error,
  successMessage,
  onChange,
  goNext,
  goPrev,
  submitWizard,
  resetWizard,
}: DeviceWizardProps) {
  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="max-h-[96vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-cardBorder bg-bgSidebar">
        <div className="border-b border-cardBorder p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-accentPrimary/30 bg-accentPrimary/10 text-accentPrimary">
                <Cpu className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-3xl font-bold text-textHeading">Add New Device</h3>
                <p className="text-base text-textSecondary">Register sensor or IoT device</p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetWizard}
              className="rounded-lg p-2 text-textHint transition hover:bg-cardBg hover:text-textHeading"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-cardBorder px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {[
              { id: 1, title: "Farmer Details" },
              { id: 2, title: "Farm Details" },
              { id: 3, title: "Field Details" },
              { id: 4, title: "Crop Details" },
              { id: 5, title: "Device Info" },
            ].map((item) => (
              <div key={item.id} className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className={[
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                    step > item.id
                      ? "bg-accentPrimary text-black"
                      : step === item.id
                        ? "border border-accentPrimary bg-accentPrimary/15 text-accentPrimary"
                        : "bg-cardBg text-textHint",
                  ].join(" ")}
                >
                  {item.id}
                </span>
                <span className="whitespace-nowrap text-xs font-semibold text-textSecondary">
                  {item.title}
                </span>
                {item.id < 5 ? (
                  <div className="h-px flex-1 rounded-full bg-gradient-to-r from-[#00FF9C]/90 via-[#00FF9C]/35 to-transparent shadow-[0_0_14px_rgba(0,255,156,0.85)]" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 p-6">
          {step === 1 && <FarmerDetailsStep wizardData={wizardData} onChange={onChange} />}
          {step === 2 && <FarmDetailsStep wizardData={wizardData} onChange={onChange} />}
          {step === 3 && <FieldDetailsStep wizardData={wizardData} onChange={onChange} />}
          {step === 4 && <CropDetailsStep wizardData={wizardData} onChange={onChange} />}
          {step === 5 && <DeviceInfoStep wizardData={wizardData} onChange={onChange} />}

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {successMessage ? (
            <p className="text-sm font-semibold text-emerald-400">{successMessage}</p>
          ) : null}
        </div>

        <div className="border-t border-cardBorder p-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={step === 1 ? resetWizard : goPrev}
              className="rounded-xl px-4 py-2 text-lg font-semibold text-textHint transition hover:text-textHeading"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              type="button"
              onClick={step === 5 ? submitWizard : goNext}
              disabled={isSubmitting}
              className="flex h-12 min-w-[140px] items-center justify-center rounded-2xl bg-accentPrimary px-8 text-lg font-bold text-black transition hover:bg-[#00e68d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 5 ? "Add Device" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
