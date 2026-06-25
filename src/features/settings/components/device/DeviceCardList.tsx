import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Pencil, Plus, Trash2 } from "lucide-react";
import { DeviceSettingsState } from "../SettingsLayout";

interface DeviceCardListProps {
  devices: DeviceSettingsState[];
  onRename: (id: any, name: string) => void;
  onToggleStatus: (id: any) => void;
  onUpdateDetails: (id: any, patch: Partial<DeviceSettingsState>) => void;
  handleDelete: (id: any) => void;
  handleSave: () => void;
  onAddClick: () => void;
  error: string;
  isSaving: boolean;
  isSubmitting: boolean;
}

export function DeviceCardList({
  devices,
  onRename,
  onToggleStatus,
  onUpdateDetails,
  handleDelete,
  handleSave,
  onAddClick,
  error,
  isSaving,
  isSubmitting,
}: DeviceCardListProps) {
  const [editingId, setEditingId] = useState<any>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cardBorder bg-bgInput p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-textBody">Add New Device</p>
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center gap-2 rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary"
          >
            <Plus className="h-4 w-4" />
            Add Device
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {devices.map((device) => (
          <motion.div
            key={device.id}
            layout
            className="rounded-2xl border border-cardBorder bg-bgInput p-4"
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accentPrimary/15 text-accentPrimary">
                  <Cpu className="h-5 w-5" />
                </span>
                <div>
                  {editingId === device.id ? (
                    <input
                      value={device.name}
                      onChange={(event) => onRename(device.id, event.target.value)}
                      className="w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-xl font-bold text-textHeading outline-none transition focus:border-accentPrimary/60"
                    />
                  ) : (
                    <p className="text-xl font-bold text-textHeading">{device.name}</p>
                  )}
                  <p className="text-sm uppercase text-textSecondary">{device.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onToggleStatus(device.id)}
                  className={[
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
                    device.status === "Connected"
                      ? "bg-rose-200 text-rose-600"
                      : "bg-amber-200 text-amber-700",
                  ].join(" ")}
                >
                  {device.status === "Connected" ? "Active" : "Offline"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingId(editingId === device.id ? null : device.id)}
                  className="text-textLabel transition hover:text-textHeading"
                  aria-label="Edit device"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(device.id)}
                  className="text-textLabel transition hover:text-rose-300 disabled:opacity-50"
                  disabled={isSubmitting}
                  aria-label="Remove device"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase text-textMuted">Serial Number</p>
                {editingId === device.id ? (
                  <input
                    value={device.serialNumber}
                    onChange={(event) =>
                      onUpdateDetails(device.id, {
                        serialNumber: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-textHeading">{device.serialNumber}</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-textMuted">Model</p>
                {editingId === device.id ? (
                  <input
                    value={device.model}
                    onChange={(event) =>
                      onUpdateDetails(device.id, {
                        model: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-textHeading">{device.model}</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-textMuted">Manufacturer</p>
                {editingId === device.id ? (
                  <input
                    value={device.manufacturer}
                    onChange={(event) =>
                      onUpdateDetails(device.id, {
                        manufacturer: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-textHeading">{device.manufacturer}</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-textMuted">Field ID</p>
                {editingId === device.id ? (
                  <input
                    value={device.fieldId}
                    onChange={(event) =>
                      onUpdateDetails(device.id, {
                        fieldId: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-textHeading">{device.fieldId}</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-textMuted">Firmware</p>
                {editingId === device.id ? (
                  <input
                    value={device.firmware}
                    onChange={(event) =>
                      onUpdateDetails(device.id, {
                        firmware: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-textHeading">{device.firmware}</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-textMuted">Connected</p>
                {editingId === device.id ? (
                  <input
                    value={device.connectedOn}
                    onChange={(event) =>
                      onUpdateDetails(device.id, {
                        connectedOn: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-textHeading">{device.connectedOn}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving || isSubmitting}
        className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving || isSubmitting ? "Saving..." : "Save Changes"}
      </motion.button>
    </div>
  );
}
