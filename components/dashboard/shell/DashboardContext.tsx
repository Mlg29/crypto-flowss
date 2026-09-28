"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Mode } from "@/lib/dashboard/types";

type ModalName = "invoice" | "payout" | null;
type Ctx = { mode: Mode; setMode: (m: Mode) => void; modal: ModalName; openModal: (m: Exclude<ModalName, null>) => void; closeModal: () => void };

const DashboardCtx = createContext<Ctx | null>(null);

/**
 * Holds the Live/Test environment and which global modal is open.
 * TODO: persist `mode` per user (cookie or profile) and send it to the API as the key scope.
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("live");
  const [modal, setModal] = useState<ModalName>(null);
  return (
    <DashboardCtx.Provider value={{ mode, setMode, modal, openModal: setModal, closeModal: () => setModal(null) }}>
      {children}
    </DashboardCtx.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardCtx);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
