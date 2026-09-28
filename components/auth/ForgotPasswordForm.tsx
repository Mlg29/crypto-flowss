"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useResetPasswordMutation, useSendOtpMutation, useVerifyOtpMutation } from "@/lib/api/auth";
import { errorMessage, toast } from "@/lib/toast";
import { AuthShell } from "./AuthShell";
import { OtpStep } from "./OtpStep";
import { PasswordField, Spinner, TextField, passwordScore } from "./fields";

/** otp/send (reset_password) -> otp/verify -> account/reset-password */
export function ForgotPasswordForm() {
  const router = useRouter();
  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [activityId, setActivityId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await sendOtp({ email, activity_type: "reset_password" }).unwrap();
      setActivityId(res.data.activity_id);
      setStep("otp");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not send the reset code."));
    }
  }

  async function handleVerify(otp: string) {
    try {
      await verifyOtp({ otp, activity_id: activityId }).unwrap();
      setStep("password");
      return true;
    } catch (err) {
      toast.danger(errorMessage(err, "That code did not work."));
      return false;
    }
  }

  async function handleResend() {
    try {
      const res = await sendOtp({ email, activity_id: activityId, activity_type: "reset_password" }).unwrap();
      setActivityId(res.data.activity_id);
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not resend the code."));
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return;
    try {
      await resetPassword({ email, password }).unwrap();
      toast.success("Password updated. Log in with your new password.");
      router.push("/login");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not reset your password."));
    }
  }

  if (step === "otp") {
    return (
      <AuthShell title="Check your email" sub="Enter the code to continue resetting your password.">
        <OtpStep email={email} verifying={verifying} resending={sending} onVerify={handleVerify} onResend={handleResend} onBack={() => setStep("email")} />
      </AuthShell>
    );
  }

  if (step === "password") {
    const mismatch = confirm.length > 0 && confirm !== password;
    return (
      <AuthShell title="Choose a new password" sub={`For ${email}`}>
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <PasswordField label="New password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" showStrength required />
          <PasswordField label="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
          {mismatch ? <p className="text-[13px] text-negative">Passwords do not match.</p> : null}
          <Button type="submit" size="lg" block disabled={resetting || mismatch || passwordScore(password) < 3}>
            {resetting ? <><Spinner />Saving</> : "Update password"}
          </Button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset your password" sub={<>Remembered it? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link></>}>
      <form onSubmit={handleEmail} className="flex flex-col gap-4">
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" autoComplete="email" required />
        <Button type="submit" size="lg" block disabled={sending}>
          {sending ? <><Spinner />Sending code</> : "Send reset code"}
        </Button>
      </form>
    </AuthShell>
  );
}
