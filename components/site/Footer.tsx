import Link from "next/link";
import { footer } from "@/lib/content";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-night text-on-night">
      <div className="container-cf flex flex-col gap-12 pb-10 pt-12 lg:gap-14 lg:pb-12 lg:pt-18">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo small />
            <p className="max-w-xs text-sm leading-[22px] text-on-night-muted">{footer.blurb}</p>
          </div>
          {footer.columns.map((col) => (
            <div key={col.head} className="flex flex-col">
              <span className="eyebrow pb-3 text-on-night">{col.head}</span>
              {col.links.map((l) => (
                <Link key={l} href="#" className="text-sm leading-8 text-on-night-muted transition-colors hover:text-on-night">
                  {l}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-line-night pt-6 text-[13px] text-on-night-muted lg:flex-row lg:justify-between">
          <span>{footer.legal}</span>
          <span>{footer.disclosure}</span>
        </div>
      </div>
    </footer>
  );
}
