import { exchange, nav } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { RateCalculator } from "./RateCalculator";

export function Exchange() {
  return (
    <section id="exchange" className="border-y border-line bg-surface-200 py-16 lg:py-24">
      <div className="container-cf grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col gap-5">
          <p className="eyebrow text-brand">Exchange</p>
          <Reveal as="h2" className="h2">{exchange.title}</Reveal>
          <p className="max-w-[520px] text-base leading-[26px] text-ink-muted lg:text-lg lg:leading-7">{exchange.body}</p>
          <ul className="flex flex-col gap-3 pt-2">
            {exchange.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] leading-6">
                <Icon name="check" className="mt-[3px] shrink-0" color="var(--brand)" />
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-3">
            <Button href={nav.create.href}>Request a quote</Button>
            <Button href="/exchange" variant="ghost">See supported pairs</Button>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <RateCalculator />
        </div>
      </div>
    </section>
  );
}
