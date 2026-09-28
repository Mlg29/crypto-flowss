"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/dashboard/ui/Badge";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { Pager } from "@/components/dashboard/ui/Pager";
import { Empty, ErrorState, Loading, dateTime, humanize } from "@/components/dashboard/ui/States";
import { inputCls } from "@/components/dashboard/modals/Modal";
import { useSession } from "@/components/dashboard/shell/useSession";
import { useGetMerchantAuditLogsQuery } from "@/lib/api/audit";

function useDebounced<T>(value: T, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

/** GET /audit/merchants/:merchant_id with resource, action and date filters. */
export function AuditLog() {
  const { merchantId } = useSession();
  const [page, setPage] = useState(1);
  const [resource, setResource] = useState("");
  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const r = useDebounced(resource.trim());
  const a = useDebounced(action.trim());

  const { data, isLoading, isFetching, isError, refetch } = useGetMerchantAuditLogsQuery(
    {
      merchant_id: merchantId,
      page,
      limit: 20,
      resource: r || undefined,
      action: a || undefined,
      from: from ? new Date(from).toISOString() : undefined,
      to: to ? new Date(`${to}T23:59:59`).toISOString() : undefined,
    },
    { skip: !merchantId },
  );
  useEffect(() => setPage(1), [r, a, from, to]);

  const logs = data?.data.items ?? [];
  const filtered = !!(r || a || from || to);

  return (
    <>
      <PageHeader title="Audit log" sub="Every action taken in this business, who did it and when." />
      <div className="flex flex-wrap gap-3">
        <input value={resource} onChange={(e) => setResource(e.target.value)} placeholder="Resource, e.g. merchant" aria-label="Filter by resource" className={`${inputCls} max-w-[220px]`} />
        <input value={action} onChange={(e) => setAction(e.target.value)} placeholder="Action, e.g. invite" aria-label="Filter by action" className={`${inputCls} max-w-[220px]`} />
        <label className="flex items-center gap-2 text-[13px] text-ink-muted">From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`${inputCls} w-auto`} /></label>
        <label className="flex items-center gap-2 text-[13px] text-ink-muted">To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`${inputCls} w-auto`} /></label>
        {filtered ? <button type="button" className="text-sm font-semibold text-brand hover:underline" onClick={() => { setResource(""); setAction(""); setFrom(""); setTo(""); }}>Clear filters</button> : null}
      </div>
      <div className={isFetching && !isLoading ? "opacity-70 transition-opacity" : ""}>
        {isLoading || !merchantId ? (
          <div className="card"><Loading label="Loading audit log" /></div>
        ) : isError ? (
          <div className="card"><ErrorState onRetry={refetch} /></div>
        ) : logs.length === 0 ? (
          <div className="card"><Empty title={filtered ? "No entries match these filters" : "No activity recorded yet"}>{filtered ? "Try a wider date range or clear the filters." : "Actions like invites, role changes and suspensions will appear here."}</Empty></div>
        ) : (
          <DataTable
            rows={logs}
            rowKey={(l) => l.id}
            columns={[
              { key: "w", header: "When", width: "1.3fr", render: (l) => <span className="text-[13px]">{dateTime(l.created_at)}</span> },
              { key: "u", header: "Who", width: "1.8fr", render: (l) => <span className="truncate">{l.account?.email ?? "System"}</span> },
              { key: "a", header: "Action", width: "1fr", render: (l) => <Badge tone="brand">{humanize(l.action)}</Badge> },
              { key: "r", header: "Resource", width: "1.6fr", render: (l) => (
                <span className="flex min-w-0 flex-col"><span className="font-medium">{humanize(l.resource)}</span>{l.resource_id ? <code className="truncate font-mono text-[11px] text-ink-muted">{l.resource_id}</code> : null}</span>
              ) },
            ]}
            footer={<Pager pagination={data?.data.pagination} onPage={setPage} />}
          />
        )}
      </div>
    </>
  );
}
