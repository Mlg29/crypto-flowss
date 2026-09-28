import { hero, nav } from "@/lib/content";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="bg-night text-on-night">
      <div className="container-cf flex flex-col gap-5 py-18 lg:items-center lg:gap-7 lg:py-32 lg:text-center">
        <h1 className="anim-in anim-d1 max-w-[1000px] font-display text-5xl font-bold leading-[50px] tracking-[-0.04em] lg:text-[88px] lg:leading-[90px]">
          {hero.titleLead} <span className="text-signal">{hero.titleAccent}</span>
        </h1>
        <p className="anim-in anim-d2 max-w-[620px] text-lg leading-7 text-on-night-muted lg:text-[21px] lg:leading-8">{hero.sub}</p>
        <div className="anim-in anim-d3 flex flex-col gap-3 pt-2 sm:flex-row lg:pt-3">
          <Button href={nav.create.href} variant="signal" size="lg">{nav.create.label}</Button>
        </div>
      </div>
    </section>
  );
}
