import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DNSZone, DNSRecord, DNSRecordType } from "./lib/schema";

export interface AppSettings {
  theme: "light" | "dark";
  defaultTTL: number;
  autoSave: boolean;
  validation: {
    strictMode: boolean;
  };
}

export interface ImportHistory {
  id: string;
  filename: string;
  timestamp: string;
  zoneCount: number;
}

interface AppState {
  zones: DNSZone[];
  settings: AppSettings;
  recentImports: ImportHistory[];

  // Actions
  addZone: (zone: DNSZone) => void;
  updateZone: (name: string, zone: DNSZone) => void;
  deleteZone: (name: string) => void;
  getZone: (name: string) => DNSZone | undefined;

  addRecord: (zoneName: string, record: DNSRecord) => void;
  updateRecord: (
    zoneName: string,
    recordIndex: number,
    record: DNSRecord
  ) => void;
  deleteRecord: (zoneName: string, recordIndex: number) => void;

  updateSettings: (settings: Partial<AppSettings>) => void;
  addImportHistory: (history: ImportHistory) => void;
  clearZones: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      zones: [],
      settings: {
        theme: "light",
        defaultTTL: 3600,
        autoSave: true,
        validation: {
          strictMode: true,
        },
      },
      recentImports: [],

      addZone: (zone) =>
        set((state) => ({
          zones: [...state.zones, zone],
        })),

      updateZone: (name, updatedZone) =>
        set((state) => ({
          zones: state.zones.map((z) => (z.name === name ? updatedZone : z)),
        })),

      deleteZone: (name) =>
        set((state) => ({
          zones: state.zones.filter((z) => z.name !== name),
        })),

      getZone: (name) => get().zones.find((z) => z.name === name),

      addRecord: (zoneName, record) =>
        set((state) => ({
          zones: state.zones.map((z) => {
            if (z.name !== zoneName) return z;
            return { ...z, records: [...z.records, record] };
          }),
        })),

      updateRecord: (zoneName, recordIndex, record) =>
        set((state) => ({
          zones: state.zones.map((z) => {
            if (z.name !== zoneName) return z;
            const newRecords = [...z.records];
            newRecords[recordIndex] = record;
            return { ...z, records: newRecords };
          }),
        })),

      deleteRecord: (zoneName, recordIndex) =>
        set((state) => ({
          zones: state.zones.map((z) => {
            if (z.name !== zoneName) return z;
            return {
              ...z,
              records: z.records.filter((_, i) => i !== recordIndex),
            };
          }),
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addImportHistory: (history) =>
        set((state) => ({
          recentImports: [history, ...state.recentImports].slice(0, 10),
        })),

      clearZones: () => set({ zones: [] }),
    }),
    {
      name: "erldns-dashboard-storage",
    }
  )
);
