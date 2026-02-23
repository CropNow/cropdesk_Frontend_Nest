/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

export interface ProfileContextValue {
  // State
  farmers: any[];
  selectedFarmerId: string;
  selectedFarmId: string;
  selectedFieldId: string;
  selectedCropId: string;
  loading: boolean;

  // Derived
  selectedFarmer: any;
  selectedFarm: any;
  selectedField: any;
  selectedCrop: any;

  // Actions
  setSelectedFarmerId: (id: string) => void;
  setSelectedFarmId: (id: string) => void;
  setSelectedFieldId: (id: string) => void;
  setSelectedCropId: (id: string) => void;

  // CRUD
  addFarmer: (newFarmer: any) => Promise<void>;
  updateFarmer: (id: string, updates: any) => Promise<void>;
  deleteFarmer: (id: string) => Promise<void>;

  addFarm: (newFarm: any) => void;
  updateFarm: (id: string, updates: any) => Promise<void>;
  deleteFarm: (id: string) => Promise<void>;

  addField: (newField: any) => void;
  updateField: (id: string, updates: any) => Promise<void>;
  deleteField: (id: string) => Promise<void>;

  addCrop: (newCrop: any) => void;
  updateCrop: (id: string, updates: any) => Promise<void>;
  deleteCrop: (id: string) => Promise<void>;

  refreshProfile: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);
