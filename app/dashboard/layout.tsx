import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/shell/AppShell";

export const metadata: Metadata = {
  title: "CryptoFlow Dashboard",
  description: "Exchange, collect, pay out and settle digital assets.",
  robots: { index: false, follow: false },
};

// AppShell wraps everything in AuthGate (session check, token refresh, redirect to /login).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
