"use client";

/** Pill-style segmented control (tabs, date ranges). */
export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-[10px] bg-surface-300 p-[3px]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`h-9 rounded-lg px-3.5 text-sm font-medium transition-colors ${value === o.value ? "bg-surface-200 text-ink shadow-[0_1px_2px_rgba(10,20,17,0.08)]" : "text-ink-muted hover:text-ink"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
