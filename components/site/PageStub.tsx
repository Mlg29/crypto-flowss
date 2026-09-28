import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Button } from "@/components/ui/Button";

/**
 * Placeholder for pages that are not designed yet. Lists the content and data
 * each page needs so the team knows what to collect (see docs/website/06-content.md).
 */
export function PageStub({ eyebrow, title, intro, needs }: { eyebrow: string; title: string; intro: string; needs: string[] }) {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-night text-on-night">
          <div className="container-cf flex flex-col gap-5 py-18 lg:py-28">
            <p className="eyebrow text-signal">{eyebrow}</p>
            <h1 className="max-w-[900px] font-display text-5xl font-bold leading-[50px] tracking-[-0.04em] lg:text-7xl lg:leading-[76px]">{title}</h1>
            <p className="max-w-[640px] text-lg leading-7 text-on-night-muted">{intro}</p>
          </div>
        </section>
        <section className="py-16 lg:py-24">
          <div className="container-cf flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Content this page needs</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {needs.map((n) => (
                <li key={n} className="rounded-lg border border-dashed border-line-strong bg-surface-200 p-5 text-[15px] leading-6 text-ink-muted">{n}</li>
              ))}
            </ul>
            <div className="pt-4"><Button href="/" variant="secondary">Back to home</Button></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
