"use client";

import { useEffect, useState } from "react";
import { Modal, Field, inputCls } from "@/components/dashboard/modals/Modal";
import { Badge } from "@/components/dashboard/ui/Badge";
import { Button } from "@/components/dashboard/ui/Button";
import { Icon } from "@/components/dashboard/ui/Icon";
import { Loading } from "@/components/dashboard/ui/States";
import { PermissionPicker } from "./PermissionPicker";
import {
  useGetMerchantAccountPermissionsQuery,
  useGetMerchantAccountRolesQuery,
  useGetPermissionsQuery,
  useGetRolesQuery,
  useMerchantAssignRoleMutation,
  useMerchantRemoveRoleMutation,
  useUpdateMerchantAccountPermissionsMutation,
} from "@/lib/api/rbac";
import { errorMessage, toast } from "@/lib/toast";

/**
 * Roles for one member of this merchant:
 * GET  /merchants/:id/rbac/accounts/:account/roles | permissions
 * POST /merchants/:id/rbac/assign-role | remove-role
 * PUT  /merchants/:id/rbac/accounts/:account/permissions
 */
export function MemberRolesModal({ merchantId, accountId, email, onClose }: { merchantId: string; accountId: string; email: string; onClose: () => void }) {
  const args = { merchant_id: merchantId, account_id: accountId };
  const { data: memberRolesRes, isLoading } = useGetMerchantAccountRolesQuery(args);
  const { data: memberPermsRes } = useGetMerchantAccountPermissionsQuery(args);
  const { data: rolesRes } = useGetRolesQuery({ scope: "merchant" });
  const { data: permsRes } = useGetPermissionsQuery();
  const [assign, { isLoading: assigning }] = useMerchantAssignRoleMutation();
  const [remove] = useMerchantRemoveRoleMutation();
  const [updatePerms, { isLoading: savingPerms }] = useUpdateMerchantAccountPermissionsMutation();

  const memberRoles = memberRolesRes?.data ?? [];
  const available = (rolesRes?.data ?? []).filter((r) => !memberRoles.some((m) => m.id === r.id));
  const [roleId, setRoleId] = useState("");
  const [editPerms, setEditPerms] = useState(false);
  const [perms, setPerms] = useState<string[]>([]);
  const [permRoleId, setPermRoleId] = useState("");

  useEffect(() => {
    if (editPerms) {
      setPerms(memberPermsRes?.data ?? []);
      setPermRoleId((id) => id || memberRoles[0]?.id || "");
    }
  }, [editPerms, memberPermsRes, memberRoles]);

  async function handleAssign() {
    try {
      await assign({ ...args, role_id: roleId }).unwrap();
      toast.success("Role assigned.");
      setRoleId("");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not assign the role."));
    }
  }

  async function handleRemove(id: string) {
    try {
      await remove({ ...args, role_id: id }).unwrap();
      toast.success("Role removed.");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not remove the role."));
    }
  }

  async function handleSavePerms() {
    try {
      await updatePerms({ ...args, role_id: permRoleId, permissions: perms }).unwrap();
      toast.success("Permissions updated.");
      setEditPerms(false);
    } catch (err) {
      toast.danger(errorMessage(err, "Could not update permissions."));
    }
  }

  return (
    <Modal
      title="Manage roles"
      onClose={onClose}
      width={editPerms ? 640 : 520}
      footer={
        editPerms ? (
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={() => setEditPerms(false)}>Back</Button>
            <Button onClick={handleSavePerms} disabled={!permRoleId || savingPerms}>{savingPerms ? "Saving…" : "Save permissions"}</Button>
          </div>
        ) : (
          <div className="flex justify-between gap-2.5">
            <Button variant="ghost" onClick={() => setEditPerms(true)} disabled={!memberRoles.length}><Icon name="edit" size={15} />Edit permissions</Button>
            <Button variant="secondary" onClick={onClose}>Done</Button>
          </div>
        )
      }
    >
      <p className="-mt-2 text-sm text-ink-muted">{email}</p>
      {editPerms ? (
        <>
          <Field id="perm-role" label="Apply to role">
            <select id="perm-role" value={permRoleId} onChange={(e) => setPermRoleId(e.target.value)} className={inputCls}>
              {memberRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <PermissionPicker grouped={permsRes?.data?.grouped_by_resource ?? {}} value={perms} onChange={setPerms} />
        </>
      ) : isLoading ? (
        <Loading label="Loading roles" />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium">Current roles</span>
            {memberRoles.length === 0 ? (
              <p className="text-sm text-ink-muted">No roles assigned.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {memberRoles.map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-[10px] border border-line px-3 py-2.5">
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">{r.name}</span>
                      {r.description ? <span className="text-xs text-ink-muted">{r.description}</span> : null}
                    </span>
                    <span className="flex items-center gap-2">
                      <Badge tone={r.type === "system" ? "info" : "brand"}>{r.type}</Badge>
                      <Button size="sm" variant="ghost" aria-label={`Remove ${r.name}`} onClick={() => handleRemove(r.id)}><Icon name="close" size={14} /></Button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-end gap-2.5">
            <div className="flex-1">
              <Field id="add-role" label="Add a role">
                <select id="add-role" value={roleId} onChange={(e) => setRoleId(e.target.value)} className={inputCls}>
                  <option value="" disabled>Choose a role</option>
                  {available.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </Field>
            </div>
            <Button className="h-[42px]" onClick={handleAssign} disabled={!roleId || assigning}>{assigning ? "Adding…" : "Add"}</Button>
          </div>
        </>
      )}
    </Modal>
  );
}
