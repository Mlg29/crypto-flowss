"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OtpInput, Spinner, emptyOtp } from "./fields";

/** Shared "enter the 6-digit code" step used by sign-in, merchant creation and password reset. */
export function OtpStep({ email, verifying, resending, verifyLabel = "Verify and continue", onVerify, onResend, onBack }: {
  email: string;
  verifying: boolean;
  resending: boolean;
  verifyLabel?: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState(emptyOtp);
  const complete = digits.every((d) => d !== "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete) return;
    const ok = await onVerify(digits.join(""));
    if (!ok) setDigits(emptyOtp());
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <p className="text-[15px] leading-6 text-ink-muted">
        We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>.
      </p>
      <OtpInput value={digits} onChange={setDigits} disabled={verifying} />
      <Button type="submit" size="lg" block disabled={!complete || verifying}>
        {verifying ? <><Spinner />Verifying</> : verifyLabel}
      </Button>
      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={onBack} className="font-medium text-ink-muted hover:text-ink">Back</button>
        <button type="button" onClick={onResend} disabled={resending} className="inline-flex items-center gap-2 font-semibold text-brand hover:underline disabled:opacity-50">
          {resending ? <Spinner /> : null}Resend code
        </button>
      </div>
    </form>
  );
}
