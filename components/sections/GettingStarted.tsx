import { steps } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "./SectionHeader";

export function GettingStarted() {
  return (
    <section className="border-y border-line bg-surface-200 py-16 lg:py-24">
      <div className="container-cf flex flex-col gap-10 lg:gap-12">
        <SectionHeader eyebrow="Getting started" title="Approved fast. Live the same day." />
        <Reveal className="relative grid border-t border-line lg:grid-cols-3">
          <div aria-hidden="true" className="stepbar absolute -top-px left-0 h-0.5 w-full bg-brand" />
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col gap-3.5 border-b border-line py-8 last:border-b-0 lg:border-b-0 lg:pb-2 lg:pr-10">
              <span className="font-mono text-[40px] font-medium leading-[44px] text-brand">{s.n}</span>
              <span className="text-[22px] font-semibold leading-[30px]">{s.title}</span>
              <span className="text-[15px] leading-6 text-ink-muted">{s.body}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
