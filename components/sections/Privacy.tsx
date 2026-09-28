import { privacy } from "@/lib/content";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "./SectionHeader";

export function Privacy() {
  return (
    <section id="security" className="bg-night py-16 text-on-night lg:py-28">
      <div className="container-cf flex flex-col gap-10 lg:gap-14">
        <SectionHeader
          onNight
          eyebrow="Privacy-conscious by design"
          title="Compliant with the rules. Discreet with your business."
          aside="We verify who you are and screen every transfer. We do not expose your treasury, your counterparties or your volumes to anyone who does not need them."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {privacy.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="lift flex flex-col gap-4 rounded-lg border border-line-night bg-night-raised p-6 lg:p-7">
              <span className="icon-pop grid size-11 place-items-center rounded-xl bg-signal text-on-signal">
                <Icon name={v.icon} size={20} strokeWidth={1.9} className="draw" />
              </span>
              <span className="text-lg font-semibold leading-[26px]">{v.title}</span>
              <span className="text-[15px] leading-6 text-on-night-muted">{v.body}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
