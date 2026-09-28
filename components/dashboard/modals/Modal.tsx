"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/dashboard/ui/Icon";

/** Accessible dialog: traps initial focus, closes on Escape or backdrop click, restores focus on close. */
export function Modal({ title, onClose, width = 560, children, footer }: { title: string; onClose: () => void; width?: number; children: ReactNode; footer: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("input, select, button")?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); prev?.focus(); };
  }, []);
  if (!mounted) return null;
  return createPortal(
    <div className="overlay-in fixed inset-0 z-[200] overflow-y-auto bg-night/55">
      <div className="flex min-h-screen items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{ width }} className="modal-in flex max-h-[90vh] max-w-full flex-col overflow-hidden rounded-[20px] bg-surface-200 shadow-[var(--shadow-pop)]">
          <div className="flex shrink-0 items-center justify-between px-7 pt-7">
            <h2 id="modal-title" className="font-display text-[22px] font-semibold">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-lg hover:bg-surface-300"><Icon name="close" size={16} strokeWidth={2} /></button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-7 py-[18px]">
            {children}
          </div>
          <div className="shrink-0 px-7 pb-7">
            {footer}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium">{label}</label>
      {children}
    </div>
  );
}

export const inputCls = "h-[42px] w-full rounded-[10px] border border-line-strong bg-surface-200 px-3 text-sm text-ink";
