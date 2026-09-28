import type { ReactNode } from "react";

export type Column<T> = { key: string; header: string; width: string; align?: "left" | "right"; render: (row: T) => ReactNode };

/**
 * Grid-based table. Header row uses the mono eyebrow style; rows highlight on hover.
 * Uses real table semantics (role="table") so screen readers announce rows and columns.
 */
export function DataTable<T>({ title, action, columns, rows, rowKey, empty = "Nothing here yet.", footer }: {
  title?: string; action?: ReactNode; columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string; empty?: string; footer?: ReactNode;
}) {
  const template = columns.map((c) => c.width).join(" ");
  return (
    <div className="card overflow-hidden">
      {title ? (
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-[15px] font-semibold">{title}</h2>
          {action}
        </div>
      ) : null}
      <div role="table" aria-label={title}>
        <div role="row" className="grid gap-3 border-b border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted" style={{ gridTemplateColumns: template }}>
          {columns.map((c) => (
            <span role="columnheader" key={c.key} className={c.align === "right" ? "text-right" : ""}>{c.header}</span>
          ))}
        </div>
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-muted">{empty}</p>
        ) : (
          rows.map((r) => (
            <div role="row" key={rowKey(r)} className="grid items-center gap-3 border-b border-line px-5 py-3 text-sm transition-colors last:border-b-0 hover:bg-surface-100" style={{ gridTemplateColumns: template }}>
              {columns.map((c) => (
                <span role="cell" key={c.key} className={c.align === "right" ? "text-right" : ""}>{c.render(r)}</span>
              ))}
            </div>
          ))
        )}
      </div>
      {footer}
    </div>
  );
}
