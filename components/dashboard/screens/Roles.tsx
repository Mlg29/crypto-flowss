"use client";

import { useState } from "react";
import { Modal, Field, inputCls } from "@/components/dashboard/modals/Modal";
import { Badge } from "@/components/dashboard/ui/Badge";
import { Button } from "@/components/dashboard/ui/Button";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { Icon } from "@/components/dashboard/ui/Icon";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { Segmented } from "@/components/dashboard/ui/Segmented";
import { ErrorState, Loading, dateOnly } from "@/components/dashboard/ui/States";
import { PermissionPicker } from "@/components/dashboard/team/PermissionPicker";
import { useCreateRoleMutation, useDeleteRoleMutation, useGetPermissionsQuery, useGetRolesQuery, useUpdateRoleMutation, type Role } from "@/lib/api/rbac";
import { errorMessage, toast } from "@/lib/toast";

type Scope = "merchant" | "system";

/** GET/POST /rbac/roles, PUT/DELETE /rbac/roles/:id, GET /rbac/permissions */
export function Roles() {
  const [scope, setScope] = useState<Scope>("merchant");
  const { data, isLoading, isError, refetch } = useGetRolesQuery({ scope });
  const [editing, setEditing] = useState<Role | "new" | null>(null);
  const [deleting, setDeleting] = useState<Role | null>(null);
  const [deleteRole, { isLoading: removing }] = useDeleteRoleMutation();
  const roles = data?.data ?? [];

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteRole(deleting.id).unwrap();
      toast.success(`${deleting.name} deleted.`);
      setDeleting(null);
    } catch (err) {
      toast.danger(errorMessage(err, "Could not delete the role."));
    }
  }

  return (
    <>
      <PageHeader
        title="Roles"
        sub="Decide what each person on your team can see and do."
        actions={<Button onClick={() => setEditing("new")}><Icon name="plus" size={16} strokeWidth={2.2} />New role</Button>}
      />
      {isLoading ? (
        <div className="card"><Loading label="Loading roles" /></div>
      ) : isError ? (
        <div className="card"><ErrorState onRetry={refetch} /></div>
      ) : (
        <DataTable
          title={`${roles.length} ${roles.length === 1 ? "role" : "roles"}`}
          action={<Segmented<Scope> label="Scope" value={scope} onChange={setScope} options={[{ value: "merchant", label: "Merchant" }, { value: "system", label: "System" }]} />}
          rows={roles}
          rowKey={(r) => r.id}
          empty="No roles in this scope yet."
          columns={[
            { key: "n", header: "Role", width: "2.2fr", render: (r) => (
              <span className="flex flex-col"><span className="font-medium">{r.name}</span>{r.description ? <span className="text-xs text-ink-muted">{r.description}</span> : null}</span>
            ) },
            { key: "t", header: "Type", width: "1fr", render: (r) => <Badge tone={r.type === "system" ? "info" : "brand"}>{r.type === "system" ? "Built-in" : "Custom"}</Badge> },
            { key: "p", header: "Permissions", width: "1fr", render: (r) => <span className="font-mono text-[13px]">{Array.isArray(r.permissions) ? r.permissions.length : 0}</span> },
            { key: "u", header: "Updated", width: "1fr", render: (r) => <span className="text-[13px] text-ink-muted">{dateOnly(r.updated_at)}</span> },
            { key: "a", header: "", width: "1.3fr", align: "right", render: (r) => r.type === "custom" ? (
              <span className="inline-flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Icon name="edit" size={14} />Edit</Button>
                <Button size="sm" variant="ghost" aria-label={`Delete ${r.name}`} onClick={() => setDeleting(r)}><Icon name="trash" size={14} /></Button>
              </span>
            ) : <span className="text-xs text-ink-muted">Read only</span> },
          ]}
        />
      )}

      {editing ? <RoleEditor role={editing === "new" ? null : editing} defaultScope={scope} onClose={() => setEditing(null)} /> : null}
      {deleting ? (
        <Modal
          title="Delete role?"
          onClose={() => setDeleting(null)}
          width={440}
          footer={<div className="flex justify-end gap-2.5"><Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button><Button onClick={confirmDelete} disabled={removing} className="!bg-negative hover:!brightness-110">{removing ? "Deleting…" : "Delete role"}</Button></div>}
        >
          <p className="text-sm text-ink-muted">People with <span className="font-semibold text-ink">{deleting.name}</span> lose its permissions straight away. This cannot be undone.</p>
        </Modal>
      ) : null}
    </>
  );
}

function RoleEditor({ role, defaultScope, onClose }: { role: Role | null; defaultScope: Scope; onClose: () => void }) {
  const { data: permsRes, isLoading } = useGetPermissionsQuery();
  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [scope, setScope] = useState<Scope>(role?.scope ?? defaultScope);
  const [perms, setPerms] = useState<string[]>(Array.isArray(role?.permissions) ? role!.permissions : []);
  const saving = creating || updating;

  async function save() {
    try {
      const permissions = perms.filter(Boolean);
      if (role) await updateRole({ id: role.id, name, description, permissions }).unwrap();
      else await createRole({ name, description, permissions, scope }).unwrap();
      toast.success(role ? "Role updated." : "Role created.");
      onClose();
    } catch (err) {
      toast.danger(errorMessage(err, "Could not save the role."));
    }
  }

  return (
    <Modal
      title={role ? `Edit ${role.name}` : "New role"}
      onClose={onClose}
      width={680}
      footer={
        <div className="flex items-center justify-between gap-2.5">
          <span className="text-[13px] text-ink-muted">{perms.length} selected</span>
          <div className="flex gap-2.5">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={!name.trim() || saving}>{saving ? "Saving…" : role ? "Save changes" : "Create role"}</Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Field id="role-name" label="Name"><input id="role-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Finance approver" className={inputCls} /></Field>
        <Field id="role-scope" label="Scope">
          <select id="role-scope" value={scope} onChange={(e) => setScope(e.target.value as Scope)} className={inputCls} disabled={!!role}>
            <option value="merchant">Merchant</option>
            <option value="system">System</option>
          </select>
        </Field>
      </div>
      <Field id="role-desc" label="Description"><input id="role-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Can approve payouts up to the daily limit" className={inputCls} /></Field>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Permissions</span>
        {isLoading ? <Loading label="Loading permissions" /> : <PermissionPicker grouped={permsRes?.data?.grouped_by_resource ?? {}} value={perms} onChange={setPerms} />}
      </div>
    </Modal>
  );
}
