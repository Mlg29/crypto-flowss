"use client";

import { useId, useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { Icon } from "@/components/ui/icons";

export const inputCls =
  "h-12 w-full rounded-md border border-line-strong bg-surface-200 px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand disabled:opacity-60";

export function Field({ label, hint, children, id, trailing }: { label: string; hint?: ReactNode; children: ReactNode; id: string; trailing?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {trailing}
      </div>
      {children}
      {hint ? <p className="text-[13px] text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function TextField({ label, hint, trailing, ...props }: { label: string; hint?: ReactNode; trailing?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} trailing={trailing}>
      <input id={id} className={inputCls} {...props} />
    </Field>
  );
}

export function SelectField({ label, hint, children, ...props }: { label: string; hint?: ReactNode; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint}>
      <select id={id} className={`${inputCls} appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function passwordScore(v: string) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return s;
}

const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"];
const strengthBar = ["bg-line-strong", "bg-negative", "bg-warning", "bg-info", "bg-positive"];

export function PasswordField({ label, showStrength = false, trailing, value, ...props }: { label: string; showStrength?: boolean; trailing?: ReactNode; value: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value">) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const score = passwordScore(value);
  return (
    <Field id={id} label={label} trailing={trailing}>
      <div className="relative">
        <input id={id} type={shown ? "text" : "password"} value={value} className={`${inputCls} pr-12`} {...props} />
        <button type="button" onClick={() => setShown((v) => !v)} aria-label={shown ? "Hide password" : "Show password"} className="absolute right-1.5 top-1.5 grid size-9 place-items-center rounded-md text-ink-muted hover:bg-surface-300">
          <Icon name="eye" size={18} strokeWidth={1.8} />
        </button>
      </div>
      {showStrength && value ? (
        <div className="flex items-center gap-3" aria-live="polite">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2, 3].map((i) => <span key={i} className={`h-1 flex-1 rounded-full ${i < score ? strengthBar[score] : "bg-surface-300"}`} />)}
          </div>
          <span className="w-16 text-right text-xs text-ink-muted">{strengthLabel[score]}</span>
        </div>
      ) : null}
    </Field>
  );
}

/** Six single-digit boxes. Supports paste of the full code and backspace to the previous box. */
export function OtpInput({ value, onChange, disabled }: { value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  function set(i: number, v: string) {
    if (!/^[0-9]?$/.test(v)) return;
    const next = [...value];
    next[i] = v;
    onChange(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  }
  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Verification code">
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={d}
          autoFocus={i === 0}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => set(i, e.target.value.slice(-1))}
          onKeyDown={(e) => { if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus(); }}
          onPaste={(e) => {
            const code = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (code.length === 6) { e.preventDefault(); onChange(code.split("")); refs.current[5]?.focus(); }
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          className="h-14 w-full min-w-0 rounded-md border border-line-strong bg-surface-200 text-center font-mono text-2xl font-medium outline-none focus:border-brand disabled:opacity-50"
        />
      ))}
    </div>
  );
}

export const emptyOtp = () => Array<string>(6).fill("");

export function Spinner() {
  return <span aria-hidden="true" className="spin inline-block size-4 rounded-full border-2 border-current border-t-transparent" />;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warning" | "negative"; children: ReactNode }) {
  const t = { info: "bg-info-tint text-info", warning: "bg-warning-tint text-warning", negative: "bg-negative-tint text-negative" }[tone];
  return <div className={`rounded-md px-4 py-3 text-sm leading-6 ${t}`}>{children}</div>;
}
