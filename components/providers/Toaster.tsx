"use client";

import { useEffect, useState } from "react";
import { toast, type ToastItem } from "@/lib/toast";

const tones: Record<ToastItem["tone"], string> = {
  success: "border-positive/30 bg-positive-tint text-positive",
  danger: "border-negative/30 bg-negative-tint text-negative",
  info: "border-info/30 bg-info-tint text-info",
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(
    () =>
      toast.subscribe((t) => {
        setItems((prev) => [...prev, t]);
        setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 4500);
      }),
    [],
  );
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(380px,calc(100vw-40px))] flex-col gap-2">
      {items.map((t) => (
        <div key={t.id} role="status" className={`modal-in pointer-events-auto rounded-md border px-4 py-3 text-sm font-medium shadow-[var(--shadow-pop)] ${tones[t.tone]}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
