"use client";

import { useState } from "react";
import { Badge } from "@/components/dashboard/ui/Badge";
import { Button } from "@/components/dashboard/ui/Button";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { Icon } from "@/components/dashboard/ui/Icon";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { Pager } from "@/components/dashboard/ui/Pager";
import { Segmented } from "@/components/dashboard/ui/Segmented";
import { ErrorState, Loading, dateOnly, humanize, statusTone } from "@/components/dashboard/ui/States";
import { initialsOf, useSession } from "@/components/dashboard/shell/useSession";
import { InviteModal } from "@/components/dashboard/team/InviteModal";
import { MemberRolesModal } from "@/components/dashboard/team/MemberRolesModal";
import { useGetAllCountriesQuery } from "@/lib/api/auth";
import {
  useActivateAccountMutation,
  useGetMerchantAccountsQuery,
  useGetMerchantDetailsQuery,
  useReinviteAccountMutation,
  useSuspendAccountMutation,
  type MerchantAccount,
} from "@/lib/api/merchant";
import { kybSteps, securityRules } from "@/lib/dashboard/mock-data";
import { errorMessage, toast } from "@/lib/toast";

type StatusFilter = "all" | "active" | "inactive" | "suspended";

export function Settings() {
  const { merchantId, accountId } = useSession();
  const { data: detailsRes, isLoading: loadingDetails } = useGetMerchantDetailsQuery(merchantId, { skip: !merchantId });
  const { data: countries } = useGetAllCountriesQuery();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const { data: accountsRes, isLoading: loadingTeam, isFetching, isError, refetch } = useGetMerchantAccountsQuery(
    { merchant_id: merchantId, page, limit: 20, status: status === "all" ? undefined : status },
    { skip: !merchantId },
  );
  const [suspend] = useSuspendAccountMutation();
  const [activate] = useActivateAccountMutation();
  const [reinvite] = useReinviteAccountMutation();
  const [inviting, setInviting] = useState(false);
  const [managing, setManaging] = useState<MerchantAccount | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const merchant = detailsRes?.data;
  const country = countries?.find((c) => c.id === merchant?.country_id)?.name;
  const accounts = accountsRes?.data.items ?? [];
  const done = kybSteps.filter((s) => s.done).length;

  async function run(id: string, fn: () => Promise<unknown>, ok: string, fail: string) {
    setBusyId(id);
    try {
      await fn();
      toast.success(ok);
    } catch (err) {
      toast.danger(errorMessage(err, fail));
    } finally {
      setBusyId(null);
    }
  }

  const bizInitials = merchant?.business_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") ?? "–";

  return (
    <>
      <PageHeader
        title="Business and team"
        sub="Your business profile, verification, people and approval rules."
      />

      <section className="card p-5" aria-labelledby="biz-title">
        {loadingDetails || !merchant ? (
          <Loading label="Loading business" />
        ) : (
          <div className="flex flex-wrap items-center gap-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-tint font-display text-lg font-bold text-brand">{bizInitials}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h2 id="biz-title" className="text-[15px] font-semibold leading-none">{merchant.business_name}</h2>
                <Badge tone={statusTone(merchant.status)}>{humanize(merchant.status)}</Badge>
              </div>
              <p className="text-xs text-ink-muted">Merchant account</p>
            </div>
            <dl className="flex items-center gap-8 border-l border-line pl-6 text-sm">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-ink-muted">Country</dt>
                <dd className="font-medium">{country ?? "–"}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-ink-muted">Member since</dt>
                <dd className="font-medium">{dateOnly(merchant.created_at)}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-ink-muted">Merchant ID</dt>
                <dd className="flex items-center gap-2">
                  <code className="font-mono text-[13px]">{merchant.id.length > 18 ? `${merchant.id.slice(0, 18)}…` : merchant.id}</code>
                  <button type="button" className="text-xs font-semibold text-brand hover:underline" onClick={() => { navigator.clipboard?.writeText(merchant.id); toast.success("Merchant ID copied."); }}>Copy</button>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      <div className={isFetching && !loadingTeam ? "opacity-70 transition-opacity" : ""}>
        {loadingTeam || !merchantId ? (
          <div className="card"><Loading label="Loading team" /></div>
        ) : isError ? (
          <div className="card"><ErrorState onRetry={refetch} /></div>
        ) : (
          <DataTable
            title="Team"
            action={
              <div className="flex items-center gap-2.5">
                <Segmented<StatusFilter>
                  label="Filter by status"
                  value={status}
                  onChange={(v) => { setStatus(v); setPage(1); }}
                  options={[{ value: "all", label: "All" }, { value: "active", label: "Active" }, { value: "inactive", label: "Pending" }, { value: "suspended", label: "Suspended" }]}
                />
                <Button onClick={() => setInviting(true)} disabled={!merchantId}><Icon name="plus" size={16} strokeWidth={2.2} />Invite</Button>
              </div>
            }
            rows={accounts}
            rowKey={(r) => r.id}
            empty={status === "all" ? "No team members yet. Invite someone to get started." : "No members with this status."}
            columns={[
              { key: "m", header: "Member", width: "2.2fr", render: (m) => (
                <span className="flex items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-bold text-ink">{initialsOf(m.email.split("@")[0])}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{m.email}</span>
                    <span className="text-xs text-ink-muted">{m.account_id === accountId ? "You" : `Joined ${dateOnly(m.created_at)}`}</span>
                  </span>
                </span>
              ) },
              { key: "s", header: "Status", width: "1fr", render: (m) => <Badge tone={statusTone(m.status)}>{m.status === "inactive" ? "Pending" : humanize(m.status)}</Badge> },
              { key: "a", header: "", width: "2fr", align: "right", render: (m) => {
                const self = m.account_id === accountId;
                const busy = busyId === m.id;
                return (
                  <span className="inline-flex flex-wrap justify-end gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => setManaging(m)}>Roles</Button>
                    {m.status !== "active" && m.status !== "suspended" ? (
                      <Button size="sm" variant="ghost" disabled={busy} onClick={() => run(m.id, () => reinvite({ merchant_id: merchantId, invite_id: m.id }).unwrap(), "Invite resent.", "Could not resend the invite.")}>Resend</Button>
                    ) : null}
                    {!self && m.status === "active" ? (
                      <Button size="sm" variant="secondary" disabled={busy} onClick={() => run(m.id, () => suspend({ merchant_id: merchantId, account_id: m.account_id }).unwrap(), "Member suspended.", "Could not suspend this member.")}>Suspend</Button>
                    ) : null}
                    {!self && m.status === "suspended" ? (
                      <Button size="sm" variant="secondary" disabled={busy} onClick={() => run(m.id, () => activate({ merchant_id: merchantId, account_id: m.account_id }).unwrap(), "Member re-activated.", "Could not activate this member.")}>Activate</Button>
                    ) : null}
                  </span>
                );
              } },
            ]}
            footer={<Pager pagination={accountsRes?.data.pagination} onPage={setPage} />}
          />
        )}
      </div>

      <div className="grid grid-cols-2 items-start gap-4">
        <section className="card flex flex-col gap-3.5 p-5" aria-labelledby="kyb-title">
          <div className="flex items-center justify-between">
            <h2 id="kyb-title" className="text-[15px] font-semibold">Business verification (KYB)</h2>
            <Badge tone="neutral">Sample data</Badge>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs"><span className="text-ink-muted">Progress to Tier 3</span><span className="font-semibold">{done} of {kybSteps.length}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-300"><div className="h-2 bg-brand" style={{ width: `${(done / kybSteps.length) * 100}%` }} /></div>
          </div>
          <ul>
            {kybSteps.map((s) => (
              <li key={s.id} className="flex items-center gap-3 border-t border-line py-2.5">
                <span className={`grid size-[26px] place-items-center rounded-full ${s.done ? "bg-positive-tint text-positive" : "bg-warning-tint text-warning"}`}><Icon name={s.done ? "check" : "dot"} size={14} strokeWidth={2.4} /></span>
                <span className="flex flex-1 flex-col"><span className="text-sm font-medium">{s.label}</span><span className="text-xs text-ink-muted">{s.detail}</span></span>
                {!s.done ? <Button size="sm">Upload</Button> : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="card flex flex-col gap-3 p-5" aria-labelledby="sec-title">
          <div className="flex items-center justify-between">
            <h2 id="sec-title" className="text-[15px] font-semibold">Security and approval rules</h2>
            <Badge tone="neutral">Sample data</Badge>
          </div>
          <ul>
            {securityRules.map((r) => (
              <li key={r.id} className="flex items-center gap-3 border-t border-line py-2.5">
                <span className="flex flex-1 flex-col"><span className="text-sm font-medium">{r.label}</span><span className="text-xs text-ink-muted">{r.detail}</span></span>
                <Badge tone={r.tone}>{r.state}</Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {inviting ? <InviteModal merchantId={merchantId} onClose={() => setInviting(false)} /> : null}
      {managing ? <MemberRolesModal merchantId={merchantId} accountId={managing.account_id} email={managing.email} onClose={() => setManaging(null)} /> : null}
    </>
  );
}
