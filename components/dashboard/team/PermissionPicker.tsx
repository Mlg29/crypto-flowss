"use client";

import type { PermissionItem } from "@/lib/api/rbac";
import { humanize } from "@/components/dashboard/ui/States";

/** Checkbox grid of permissions grouped by resource, with select-all per group. */
export function PermissionPicker({ grouped, value, onChange }: { grouped: Record<string, PermissionItem[]>; value: string[]; onChange: (v: string[]) => void }) {
  const set = new Set(value);
  const toggle = (p: string) => onChange(set.has(p) ? value.filter((x) => x !== p) : [...value, p]);
  const resources = Object.keys(grouped).sort();
  if (!resources.length) return <p className="text-sm text-ink-muted">No permissions available.</p>;
  return (
    <div className="flex max-h-[340px] flex-col gap-3 overflow-y-auto rounded-[12px] border border-line p-3">
      {resources.map((r) => {
        const items = grouped[r];
        const keys = items.map((i) => i.permission);
        const all = keys.every((k) => set.has(k));
        return (
          <fieldset key={r} className="flex flex-col gap-2 border-b border-line pb-3 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between">
              <legend className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">{humanize(r)}</legend>
              <button
                type="button"
                className="text-xs font-semibold text-brand hover:underline"
                onClick={() => onChange(all ? value.filter((v) => !keys.includes(v)) : [...new Set([...value, ...keys])])}
              >
                {all ? "Clear" : "Select all"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {items.map((i) => (
                <label key={i.permission} className="flex cursor-pointer items-center gap-2 text-[13px]">
                  <input type="checkbox" checked={set.has(i.permission)} onChange={() => toggle(i.permission)} className="size-4 accent-[var(--brand)]" />
                  <span>{humanize(i.action)}{i.field ? <span className="text-ink-muted"> · {i.field}</span> : null}</span>
                </label>
              ))}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
