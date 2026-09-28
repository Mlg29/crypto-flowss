import { Badge } from "@/components/dashboard/ui/Badge";
import { Button, ButtonLink } from "@/components/dashboard/ui/Button";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { apiKeys, webhook, webhookEvents } from "@/lib/dashboard/mock-data";
import { relativeTime } from "@/lib/dashboard/format";

export function Developers() {
  return (
    <>
      <PageHeader title="Developers" sub="API keys, webhooks and event logs for your integration." actions={<ButtonLink href="#" variant="secondary">API reference</ButtonLink>} />
      <DataTable
        title="API keys"
        action={<Button variant="secondary" size="sm">Create key</Button>}
        rows={apiKeys}
        rowKey={(r) => r.id}
        columns={[
          { key: "n", header: "Name", width: "1.2fr", render: (r) => <span className="font-medium">{r.name}</span> },
          { key: "k", header: "Key", width: "2.2fr", render: (r) => <span className="font-mono text-[13px]">{r.masked}</span> },
          { key: "m", header: "Mode", width: "1fr", render: (r) => <Badge tone={r.mode === "live" ? "positive" : "info"}>{r.mode === "live" ? "Live" : "Test"}</Badge> },
          { key: "u", header: "Last used", width: "1.2fr", render: (r) => <span className="text-[13px] text-ink-muted" suppressHydrationWarning>{relativeTime(r.lastUsedAt)}</span> },
          { key: "x", header: "", width: "1.4fr", align: "right", render: () => <span className="inline-flex gap-1.5"><Button variant="ghost" size="sm">Copy</Button><Button variant="ghost" size="sm">Roll key</Button></span> },
        ]}
      />
      <div className="grid grid-cols-2 gap-4">
        <section className="card flex flex-col gap-3.5 p-5" aria-labelledby="wh-title">
          <div className="flex items-center justify-between"><h2 id="wh-title" className="text-[15px] font-semibold">Webhook endpoint</h2><Badge tone={webhook.healthy ? "positive" : "negative"}>{webhook.healthy ? "Healthy" : "Failing"}</Badge></div>
          <span className="rounded-[10px] bg-surface-300 px-3 py-2.5 font-mono text-[13px]">{webhook.url}</span>
          <ul className="flex flex-wrap gap-1.5">{webhook.subscribed.map((e) => <li key={e} className="rounded-md bg-brand-tint px-2 py-0.5 font-mono text-xs">{e}</li>)}</ul>
          <dl className="grid grid-cols-2 gap-3 text-[13px]">
            <div><dt className="text-ink-muted">Delivery rate, 7 days</dt><dd className="text-base font-semibold">{webhook.deliveryRate7d}</dd></div>
            <div><dt className="text-ink-muted">Signing secret</dt><dd className="font-mono font-medium">{webhook.secretMasked}</dd></div>
          </dl>
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[13px] font-medium">IP allowlist</span>
            <div className="flex flex-wrap gap-1.5">
              {webhook.allowlist.map((ip) => <span key={ip} className="inline-flex h-8 items-center rounded-full border border-line px-3 font-mono text-[13px] text-ink-muted">{ip}</span>)}
              <button type="button" className="inline-flex h-8 items-center rounded-full border border-line px-3 text-[13px] font-medium text-ink-muted hover:text-ink">+ Add IP</button>
            </div>
          </div>
        </section>
        <DataTable
          title="Recent events"
          rows={webhookEvents}
          rowKey={(r) => r.id}
          columns={[
            { key: "t", header: "Event", width: "1.8fr", render: (r) => <span className="font-mono text-[13px]">{r.type}</span> },
            { key: "c", header: "Response", width: "0.8fr", render: (r) => <span className={`font-mono text-[13px] font-semibold ${r.responseCode < 300 ? "text-positive" : "text-negative"}`}>{r.responseCode}</span> },
            { key: "w", header: "When", width: "1.2fr", align: "right", render: (r) => <span className="text-[13px] text-ink-muted" suppressHydrationWarning>{relativeTime(r.at)}{r.note ? ` · ${r.note}` : ""}</span> },
          ]}
        />
      </div>
    </>
  );
}
