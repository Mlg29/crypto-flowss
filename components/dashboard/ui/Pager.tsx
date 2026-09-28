import type { Pagination } from "@/lib/api/auth";
import { Button } from "./Button";

/** Previous / next pager driven by the API's pagination object. */
export function Pager({ pagination, onPage }: { pagination?: Pagination; onPage: (p: number) => void }) {
  if (!pagination || pagination.total_pages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[13px] text-ink-muted">
      <span>Page {pagination.page} of {pagination.total_pages} · {pagination.total_items} total</span>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" disabled={!pagination.has_previous} onClick={() => onPage(pagination.page - 1)}>Previous</Button>
        <Button size="sm" variant="secondary" disabled={!pagination.has_next} onClick={() => onPage(pagination.page + 1)}>Next</Button>
      </div>
    </div>
  );
}
