import Link from "next/link";
import { nav } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <div className="container-cf py-12 lg:py-24">
      <Reveal as="section" className="shine flex flex-col gap-6 rounded-xl bg-signal p-6 text-on-signal sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-16">
        <div className="flex max-w-[720px] flex-col gap-3">
          <h2 className="font-display text-[30px] font-bold leading-[34px] tracking-[-0.025em] lg:text-5xl lg:leading-[52px]">Move digital assets like a business should.</h2>
          <p className="text-base leading-7 lg:text-lg">Create your merchant account and start in the sandbox today.</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link href={nav.create.href} className="inline-flex h-13 items-center justify-center rounded-md bg-night px-8 text-[15px] font-medium text-on-night transition-transform active:scale-[0.98]">{nav.create.label}</Link>
        </div>
      </Reveal>
    </div>
  );
}
