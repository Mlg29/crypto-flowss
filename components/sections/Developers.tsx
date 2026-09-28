import { api } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function Developers() {
  return (
    <section id="developers" className="py-16 lg:py-24">
      <div className="container-cf grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-5">
          <p className="eyebrow text-brand">For developers</p>
          <Reveal as="h2" className="h2 lg:!text-[44px] lg:!leading-[48px]">One API for every money movement.</Reveal>
          <p className="text-base leading-[26px] text-ink-muted">REST endpoints, signed webhooks and a testnet sandbox that mirrors production, so your team can ship without waiting on ours.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button href="/create-merchant">Get sandbox keys</Button>
            <Button href="/developers" variant="secondary">Read the docs</Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {api.map((x, i) => (
            <Reveal key={x.tag} delay={(i % 2) * 0.08} className="lift flex flex-col gap-2.5 rounded-lg border border-line bg-surface-200 p-6">
              <span className="self-start rounded-sm bg-brand-tint px-2 py-0.5 font-mono text-xs font-medium">{x.tag}</span>
              <span className="text-lg font-semibold leading-[26px]">{x.title}</span>
              <span className="text-[15px] leading-6 text-ink-muted">{x.body}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
