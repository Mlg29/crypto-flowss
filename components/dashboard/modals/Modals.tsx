"use client";

import { useDashboard } from "@/components/dashboard/shell/DashboardContext";
import { InvoiceModal } from "./InvoiceModal";
import { PayoutModal } from "./PayoutModal";

export function Modals() {
  const { modal, closeModal } = useDashboard();
  if (modal === "invoice") return <InvoiceModal onClose={closeModal} />;
  if (modal === "payout") return <PayoutModal onClose={closeModal} />;
  return null;
}
