import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { Icon } from "@/components/ui/icons";

const points = [
  "Collect, exchange and settle digital assets from one dashboard",
  "Sandbox first: test the whole flow before going live",
  "Team roles, approvals and a full audit trail",
];

/** Two-panel layout for sign-in and merchant creation: brand panel (night) + form (light). */
export function AuthShell({ title, sub, children, aside }: { title: string; sub?: ReactNode; children: ReactNode; aside?: { title: string; body: string } }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden flex-col justify-between gap-10 overflow-hidden bg-night p-12 text-on-night lg:flex">
        <Logo pulse />
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-[44px] font-bold leading-[48px] tracking-[-0.03em]">
            {aside?.title ?? <>Move digital assets <span className="text-signal">like a business should.</span></>}
          </h2>
          <p className="max-w-[440px] text-base leading-7 text-on-night-muted">{aside?.body ?? "Secure, privacy-conscious infrastructure for businesses to exchange, collect, pay out and settle digital assets."}</p>
          <ul className="flex flex-col gap-3 pt-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] leading-6">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-signal text-on-signal"><Icon name="check" size={14} strokeWidth={2.6} /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-on-night-muted">Secured with signed requests and session verification</p>
      </aside>
      <main className="flex flex-col bg-surface-100">
        <div className="flex h-16 items-center bg-night px-5 lg:hidden"><Logo small /></div>
        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
          <div className="anim-in flex w-full max-w-[440px] flex-col gap-7">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-[32px] font-bold leading-[38px] tracking-[-0.025em]">{title}</h1>
              {sub ? <p className="text-[15px] leading-6 text-ink-muted">{sub}</p> : null}
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
