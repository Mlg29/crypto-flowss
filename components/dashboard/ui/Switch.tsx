"use client";

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`flex h-[26px] w-11 shrink-0 rounded-full p-[3px] transition-colors ${checked ? "justify-end bg-brand" : "justify-start bg-line-strong"}`}
    >
      <span className="block size-5 rounded-full bg-white shadow" />
    </button>
  );
}
