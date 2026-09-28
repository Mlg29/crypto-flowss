"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAcceptInviteMutation } from "@/lib/api/merchant";
import { errorMessage, toast } from "@/lib/toast";
import { AuthShell } from "./AuthShell";
import { Notice, PasswordField, Spinner, passwordScore } from "./fields";

/** Team invite link: /accept-invite?token=... -> POST /merchants/invites/accept */
export function AcceptInviteForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const mismatch = confirm.length > 0 && confirm !== password;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return;
    try {
      await acceptInvite({ token, password }).unwrap();
      toast.success("Invite accepted. Log in to continue.");
      router.push("/login");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not accept the invite. The link may have expired."));
    }
  }

  if (!token) {
    return (
      <AuthShell title="Invite link not valid" sub="This link is missing its invite token.">
        <Notice tone="warning">Open the link from your invite email again, or ask the business owner to resend your invite.</Notice>
        <Link href="/login" className="text-sm font-semibold text-brand hover:underline">Go to log in</Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Join your team on CryptoFlow" sub="Set a password to accept the invite.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" showStrength required />
        <PasswordField label="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
        {mismatch ? <p className="text-[13px] text-negative">Passwords do not match.</p> : null}
        <Button type="submit" size="lg" block disabled={isLoading || mismatch || passwordScore(password) < 3}>
          {isLoading ? <><Spinner />Accepting</> : "Accept invite"}
        </Button>
      </form>
    </AuthShell>
  );
}
