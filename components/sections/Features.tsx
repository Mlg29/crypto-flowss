import Link from "next/link";
import { features } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "./SectionHeader";

export function Features() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-cf flex flex-col gap-10 lg:gap-12">
        <SectionHeader eyebrow="What you get" title="Everything between the wallet and the bank." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((f, i) => (
            <Reveal as="article" key={f.title} delay={(i % 3) * 0.08} className="lift flex flex-col gap-3 rounded-lg border border-line bg-surface-200 p-6">
              <h3 className="text-xl font-semibold leading-7 tracking-[-0.01em]">{f.title}</h3>
              <p className="text-[15px] leading-6 text-ink-muted">{f.body}</p>
              <Link href="/platform" className="text-sm font-medium text-brand hover:underline">
                Learn more <span className="arrow-nudge">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
