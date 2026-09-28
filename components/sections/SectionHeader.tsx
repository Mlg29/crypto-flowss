import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function SectionHeader({ eyebrow, title, aside, onNight = false }: { eyebrow: string; title: ReactNode; aside?: ReactNode; onNight?: boolean }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
      <div className="flex max-w-[720px] flex-col gap-4">
        <p className={`eyebrow ${onNight ? "text-signal" : "text-brand"}`}>{eyebrow}</p>
        <Reveal as="h2" className="h2">{title}</Reveal>
      </div>
      {aside ? <p className={`max-w-[420px] text-base leading-[26px] lg:text-lg lg:leading-7 ${onNight ? "text-on-night-muted" : "text-ink-muted"}`}>{aside}</p> : null}
    </div>
  );
}
