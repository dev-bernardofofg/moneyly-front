"use client";

import { Period } from "@/app/(types)/period.type";
import { createContext, useContext, useEffect, useState } from "react";

interface PeriodContextType {
  selectedPeriodId: string | null;
  setSelectedPeriodId: (periodId: string) => void;
  periods: Period[];
  setPeriods: (periods: Period[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

const STORAGE_KEY = "moneyly_selected_period";

export const PeriodProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPeriodId, setSelectedPeriodIdState] = useState<string | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar período selecionado do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSelectedPeriodIdState(stored);
      }
    }
  }, []);

  // Persistir período selecionado no localStorage
  const setSelectedPeriodId = (periodId: string) => {
    setSelectedPeriodIdState(periodId);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, periodId);
    }
  };

  // Sincronizar entre abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setSelectedPeriodIdState(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <PeriodContext.Provider
      value={{
        selectedPeriodId,
        setSelectedPeriodId,
        periods,
        setPeriods,
        loading,
        setLoading,
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriod = () => {
  const context = useContext(PeriodContext);
  if (context === undefined) {
    throw new Error("usePeriod must be used within a PeriodProvider");
  }
  return context;
}; 