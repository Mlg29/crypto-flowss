"use client";

import { useEffect, useState } from "react";
import { Field, inputCls } from "@/components/dashboard/modals/Modal";
import { Badge } from "@/components/dashboard/ui/Badge";
import { Button } from "@/components/dashboard/ui/Button";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { Pager } from "@/components/dashboard/ui/Pager";
import { Loading, dateTime, humanize, statusTone } from "@/components/dashboard/ui/States";
import { useSession } from "@/components/dashboard/shell/useSession";
import { useGetSessionsQuery } from "@/lib/api/auth";
import { useGetMerchantAccountRolesQuery } from "@/lib/api/rbac";
import { useUpdateUserMutation } from "@/lib/api/user";
import { getDeviceId } from "@/lib/device-id";
import { errorMessage, toast } from "@/lib/toast";

function browserOf(ua: string) {
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return ua ? ua.slice(0, 28) : "Unknown";
}

/** GET/PUT /user, GET /merchants/:id/rbac/accounts/:account/roles, GET /account/sessions */
export function Profile() {
  const { user, merchantId, accountId, email, loading } = useSession();
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();
  const [form, setForm] = useState({ first_name: "", middle_name: "", last_name: "", phone_number: "" });
  const { data: rolesRes } = useGetMerchantAccountRolesQuery({ merchant_id: merchantId, account_id: accountId }, { skip: !merchantId || !accountId });
  const [page, setPage] = useState(1);
  const { data: sessionsRes, isLoading: loadingSessions } = useGetSessionsQuery({ page, limit: 10 });
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => { getDeviceId().then(setDeviceId); }, []);
  useEffect(() => {
    if (user) setForm({ first_name: user.first_name ?? "", middle_name: user.middle_name ?? "", last_name: user.last_name ?? "", phone_number: user.phone_number ?? "" });
  }, [user]);

  const dirty = !!user && (["first_name", "middle_name", "last_name", "phone_number"] as const).some((k) => (user[k] ?? "") !== form[k]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateUser(form).unwrap();
      toast.success("Profile saved.");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not save your profile."));
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const roles = rolesRes?.data ?? [];

  return (
    <>
      <PageHeader title="Your profile" sub="Personal details, access and active sessions." />
      <div className="grid grid-cols-12 items-start gap-4">
        <form onSubmit={save} className="card col-span-7 flex flex-col gap-4 p-5" aria-labelledby="pd-title">
          <h2 id="pd-title" className="text-[15px] font-semibold">Personal details</h2>
          {loading && !user ? <Loading /> : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Field id="p-first" label="First name"><input id="p-first" value={form.first_name} onChange={set("first_name")} className={inputCls} autoComplete="given-name" /></Field>
                <Field id="p-middle" label="Middle name"><input id="p-middle" value={form.middle_name} onChange={set("middle_name")} className={inputCls} autoComplete="additional-name" /></Field>
                <Field id="p-last" label="Last name"><input id="p-last" value={form.last_name} onChange={set("last_name")} className={inputCls} autoComplete="family-name" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field id="p-email" label="Email"><input id="p-email" value={email} readOnly disabled className={`${inputCls} opacity-70`} /></Field>
                <Field id="p-phone" label="Phone number"><input id="p-phone" value={form.phone_number} onChange={set("phone_number")} className={inputCls} autoComplete="tel" placeholder="+234…" /></Field>
              </div>
              <div className="flex justify-end"><Button type="submit" disabled={!dirty || saving}>{saving ? "Saving…" : "Save changes"}</Button></div>
            </>
          )}
        </form>
        <section className="card col-span-5 flex flex-col gap-3 p-5" aria-labelledby="acc-title">
          <h2 id="acc-title" className="text-[15px] font-semibold">Your access in this business</h2>
          {roles.length === 0 ? <p className="text-sm text-ink-muted">No roles assigned to you here.</p> : (
            <ul className="flex flex-col gap-2">
              {roles.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-[10px] border border-line px-3 py-2.5">
                  <span className="flex flex-col"><span className="text-sm font-medium">{r.name}</span><span className="text-xs text-ink-muted">{Array.isArray(r.permissions) ? r.permissions.length : 0} permissions</span></span>
                  <Badge tone={r.type === "system" ? "info" : "brand"}>{r.type === "system" ? "Built-in" : "Custom"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      {loadingSessions ? <div className="card"><Loading label="Loading sessions" /></div> : (
        <DataTable
          title="Sessions"
          rows={sessionsRes?.data.items ?? []}
          rowKey={(s) => s.id}
          empty="No sessions found."
          columns={[
            { key: "d", header: "Device", width: "1.6fr", render: (s) => (
              <span className="flex flex-col"><span className="font-medium">{browserOf(s.user_agent)}{s.device_id === deviceId ? <span className="ml-2 text-xs font-semibold text-brand">This device</span> : null}</span><span className="font-mono text-[11px] text-ink-muted">{s.ip_address || "–"}</span></span>
            ) },
            { key: "s", header: "Status", width: "1fr", render: (s) => <Badge tone={statusTone(s.status)}>{humanize(s.status)}</Badge> },
            { key: "v", header: "Verified", width: "0.8fr", render: (s) => <span className="text-[13px]">{s.otp_verified ? "Yes" : "No"}</span> },
            { key: "l", header: "Signed in", width: "1.3fr", render: (s) => <span className="text-[13px] text-ink-muted">{dateTime(s.login_time)}</span> },
            { key: "e", header: "Expires", width: "1.3fr", render: (s) => <span className="text-[13px] text-ink-muted">{dateTime(s.expiration_time)}</span> },
          ]}
          footer={<Pager pagination={sessionsRes?.data.pagination} onPage={setPage} />}
        />
      )}
    </>
  );
}
