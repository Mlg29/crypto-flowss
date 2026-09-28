"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { Logo } from "./Logo";

/**
 * Sticky top navigation. After 40px of scroll it shrinks (80px to 64px on desktop)
 * and gains a translucent, blurred background so the CTAs stay reachable.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line-night text-on-night transition-[height,background-color,box-shadow] duration-300 ${
        scrolled ? "bg-night/85 shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-md" : "bg-night"
      }`}
    >
      <nav aria-label="Main" className={`container-cf flex items-center gap-10 transition-[height] duration-300 ${scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"}`}>
        <Logo pulse />
        <div className="hidden flex-1 items-center gap-8 lg:flex">
          {nav.links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-on-night-muted transition-colors hover:text-on-night">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Button href={nav.login.href} variant="ghost" size="sm" onNight>{nav.login.label}</Button>
          <Button href={nav.create.href} variant="signal" size="sm">{nav.create.label}</Button>
        </div>
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link href={nav.login.href} className="inline-flex h-11 items-center px-3 text-sm font-medium text-on-night">{nav.login.label}</Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-md border border-line-night text-on-night"
          >
            <Icon name={open ? "close" : "menu"} size={20} strokeWidth={1.75} />
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-menu" className="container-cf flex h-[calc(100dvh-64px)] flex-col gap-2 overflow-y-auto border-t border-line-night bg-night pb-8 pt-4 lg:hidden">
          {nav.links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line-night py-4 text-lg font-medium text-on-night">
              {l.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Button href={nav.create.href} variant="signal" size="lg" block>{nav.create.label}</Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
