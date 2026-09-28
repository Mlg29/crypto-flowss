import type { ReactNode } from "react";
import { DashboardProvider } from "./DashboardContext";
import { AuthGate } from "./AuthGate";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { TestModeBanner } from "./TestModeBanner";
import { Modals } from "@/components/dashboard/modals/Modals";

/** Desktop app frame: fixed sidebar, top bar, scrolling content, global modals. Everything sits behind AuthGate. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <DashboardProvider>
        <div className="flex h-dvh overflow-hidden bg-surface-100">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <TestModeBanner />
            <main className="min-h-0 flex-1 overflow-y-auto p-7">
              <div className="screen-in mx-auto flex max-w-[1240px] flex-col gap-5">{children}</div>
            </main>
          </div>
        </div>
        <Modals />
      </DashboardProvider>
    </AuthGate>
  );
}
