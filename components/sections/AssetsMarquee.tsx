import { assets } from "@/lib/content";
import { AssetPill } from "@/components/ui/AssetPill";

/** Continuous loop of supported assets. The list is rendered twice so the -50% translate loops seamlessly. */
export function AssetsMarquee() {
  const loop = [...assets, ...assets];
  return (
    <section aria-label="Supported assets" className="border-b border-line bg-surface-200">
      <div className="container-cf flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:gap-8 lg:py-10">
        <p className="eyebrow w-44 shrink-0 text-ink-muted">Supported assets</p>
        <div className="marquee-mask min-w-0 flex-1 overflow-hidden">
          <ul className="marquee-track flex w-max gap-2.5">
            {loop.map((a, i) => (
              <li key={i} aria-hidden={i >= assets.length ? true : undefined}>
                <AssetPill symbol={a.symbol} network={a.network} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
