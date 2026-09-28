import Link from "next/link";
import { useCases } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "./SectionHeader";

export function UseCases() {
  return (
    <section id="use-cases" className="border-t border-line bg-surface-200 py-16 lg:py-24">
      <div className="container-cf flex flex-col gap-10 lg:gap-12">
        <SectionHeader eyebrow="Use cases" title="Built for how business money moves." />
        <div className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u, i) => (
            <Reveal key={u.n} delay={i * 0.08}>
              <Link href="/use-cases" className="flex flex-col gap-3 py-8 pr-8 text-ink no-underline">
                <span className="font-mono text-[13px] text-ink-muted">{u.n}</span>
                <span className="text-xl font-semibold leading-7">{u.title}</span>
                <span className="text-[15px] leading-6 text-ink-muted">{u.body}</span>
                <span className="text-sm font-medium text-brand">Learn more <span className="arrow-nudge">→</span></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
