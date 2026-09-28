import type { ReactNode } from "react";

export function PageHeader({ title, sub, actions, eyebrow }: { title: string; sub?: string; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        {eyebrow ? <span className="text-[13px] text-ink-muted">{eyebrow}</span> : null}
        <h1 className="font-display text-[28px] font-semibold leading-[34px] tracking-[-0.02em]">{title}</h1>
        {sub ? <p className="text-sm text-ink-muted">{sub}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2.5">{actions}</div> : null}
    </div>
  );
}
