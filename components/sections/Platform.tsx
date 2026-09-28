import { pillars } from "@/lib/content";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "./SectionHeader";

export function Platform() {
  return (
    <section id="platform" className="py-16 lg:py-24">
      <div className="container-cf flex flex-col gap-10 lg:gap-12">
        <SectionHeader eyebrow="The platform" title="Exchange, settle and pay out from one place." aside="Built for finance and operations teams that move digital assets as part of how they run the business." />
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {pillars.map((p, i) => (
            <Reveal
              as="article"
              key={p.n}
              delay={i * 0.08}
              className={`lift flex flex-col gap-5 rounded-xl border p-6 lg:p-9 ${p.dark ? "border-night bg-night text-on-night" : "border-line bg-surface-200 text-ink"}`}
            >
              <span className={`font-mono text-[13px] ${p.dark ? "text-on-night-muted" : "text-ink-muted"}`}>{p.n}</span>
              <h3 className="font-display text-[26px] font-semibold leading-[30px] tracking-[-0.02em] lg:text-[32px] lg:leading-[38px]">{p.title}</h3>
              <p className={`text-base leading-[26px] ${p.dark ? "text-on-night-muted" : "text-ink-muted"}`}>{p.body}</p>
              <ul className="flex flex-col gap-2.5 pt-1">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-[15px] leading-6">
                    <Icon name="check" className="mt-[3px] shrink-0" color={p.dark ? "var(--signal)" : "var(--brand)"} />
                    {pt}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
