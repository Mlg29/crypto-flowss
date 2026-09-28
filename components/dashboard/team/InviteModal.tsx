"use client";

import { useState } from "react";
import { Modal, Field, inputCls } from "@/components/dashboard/modals/Modal";
import { Button } from "@/components/dashboard/ui/Button";
import { useInviteAccountMutation } from "@/lib/api/merchant";
import { useGetRolesQuery } from "@/lib/api/rbac";
import { errorMessage, toast } from "@/lib/toast";

/** POST /merchants/:id/invites { email, role_id } */
export function InviteModal({ merchantId, onClose }: { merchantId: string; onClose: () => void }) {
  const { data: rolesRes, isLoading: loadingRoles } = useGetRolesQuery({ scope: "merchant" });
  const [invite, { isLoading }] = useInviteAccountMutation();
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const roles = rolesRes?.data ?? [];

  async function submit() {
    try {
      await invite({ merchant_id: merchantId, email, role_id: roleId }).unwrap();
      toast.success(`Invite sent to ${email}.`);
      onClose();
    } catch (err) {
      toast.danger(errorMessage(err, "Could not send the invite."));
    }
  }

  const valid = /\S+@\S+\.\S+/.test(email) && roleId;
  return (
    <Modal
      title="Invite a team member"
      onClose={onClose}
      width={480}
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!valid || isLoading}>{isLoading ? "Sending…" : "Send invite"}</Button>
        </div>
      }
    >
      <p className="text-sm text-ink-muted">They get an email with a link to set a password and join this business.</p>
      <Field id="inv-email" label="Email">
        <input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@business.com" className={inputCls} />
      </Field>
      <Field id="inv-role" label="Role">
        <select id="inv-role" value={roleId} onChange={(e) => setRoleId(e.target.value)} className={inputCls} disabled={loadingRoles}>
          <option value="" disabled>{loadingRoles ? "Loading roles…" : "Choose a role"}</option>
          {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </Field>
      {!loadingRoles && roles.length === 0 ? <p className="text-[13px] text-ink-muted">No merchant roles yet. Create one under Roles first.</p> : null}
    </Modal>
  );
}
