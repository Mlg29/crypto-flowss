"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/icons";
import { RATE_LOCK_SECONDS, FEE_RATE, formatAmount, formatRate, getIndicativeRates, parseAmount, quote } from "@/lib/rates";

type QuoteState = "idle" | "loading" | "done";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

/** Tweens a number to its target over `duration` ms with an ease-out curve. */
function useCountUp(target: number, duration = 420, disabled = false) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    if (disabled) { setValue(target); fromRef.current = target; return; }
    const start = fromRef.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = start + (target - start) * eased;
      fromRef.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, disabled]);
  return value;
}

const selectCls =
  "h-10 cursor-pointer appearance-none rounded-full border border-line-strong bg-surface-200 pl-3.5 pr-8 text-sm font-semibold text-ink";

function CurrencySelect({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: string[] }) {
  return (
    <span className="relative shrink-0">
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <Icon name="chevron" size={14} strokeWidth={2.2} className="pointer-events-none absolute right-3 top-[13px] text-ink-muted" />
    </span>
  );
}

export function RateCalculator() {
  const currencies = useMemo(() => getIndicativeRates(), []);
  const codes = currencies.map((c) => c.code);
  const amountId = useId();
  const reduce = usePrefersReducedMotion();

  const [from, setFrom] = useState("USDT");
  const [to, setTo] = useState("NGN");
  const [input, setInput] = useState("25,000");
  const [invalid, setInvalid] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flashKey, setFlashKey] = useState(0);
  const [lockLeft, setLockLeft] = useState(RATE_LOCK_SECONDS);
  const [quoteState, setQuoteState] = useState<QuoteState>("idle");
  const lockStart = useRef(0);

  const amount = parseAmount(input) ?? 0;
  const q = quote(currencies, from, to, amount);
  const shown = useCountUp(q.receive, 420, reduce);

  // Restart the rate lock and flash the result whenever the quote changes.
  useEffect(() => {
    lockStart.current = Date.now();
    setLockLeft(RATE_LOCK_SECONDS);
    const t = setTimeout(() => setFlashKey((k) => k + 1), 420);
    return () => clearTimeout(t);
  }, [q.receive]);

  // Countdown. At zero the (indicative) rate refreshes and the lock restarts.
  useEffect(() => {
    lockStart.current = Date.now();
    const id = setInterval(() => {
      const left = RATE_LOCK_SECONDS - Math.floor((Date.now() - lockStart.current) / 1000);
      if (left <= 0) {
        lockStart.current = Date.now();
        setLockLeft(RATE_LOCK_SECONDS);
        setFlashKey((k) => k + 1);
        // TODO: re-fetch live rates here when the pricing API is connected.
      } else {
        setLockLeft(left);
      }
    }, 250);
    return () => clearInterval(id);
  }, []);

  const onAmount = (v: string) => {
    setInput(v);
    const ok = parseAmount(v) !== null;
    setInvalid(!ok);
    if (!ok) setShakeKey((k) => k + 1);
  };
  const onFrom = (v: string) => { if (v === to) setTo(from); setFrom(v); };
  const onTo = (v: string) => { if (v === from) setFrom(to); setTo(v); };
  const onFlip = () => { setFrom(to); setTo(from); setRotation((r) => r + 180); };
  const onQuote = () => {
    if (quoteState !== "idle") return;
    setQuoteState("loading");
    // TODO: POST to the quote request endpoint or CRM, then show confirmation.
    setTimeout(() => setQuoteState("done"), 1400);
    setTimeout(() => setQuoteState("idle"), 4200);
  };

  return (
    <div className="float flex w-full max-w-[460px] flex-col gap-4 rounded-xl border border-line bg-surface-200 p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <span className="text-[17px] font-semibold">Rate calculator</span>
        <Badge tone="info">Indicative</Badge>
      </div>

      <div className={`flex flex-col gap-1.5 rounded-lg bg-surface-300 px-[18px] py-4 ${invalid ? `${shakeKey % 2 ? "shake-a" : "shake-b"} shadow-[inset_0_0_0_2px_var(--negative)]` : ""}`}>
        <label htmlFor={amountId} className="text-[13px] text-ink-muted">You send</label>
        <div className="flex items-center gap-3">
          <input
            id={amountId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={input}
            onChange={(e) => onAmount(e.target.value)}
            aria-invalid={invalid}
            aria-describedby={`${amountId}-hint`}
            size={1}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-display text-[26px] font-semibold leading-9 sm:text-[32px] sm:leading-10 tracking-[-0.02em] text-ink outline-none"
          />
          <CurrencySelect value={from} onChange={onFrom} label="Currency you send" options={codes} />
        </div>
        <span id={`${amountId}-hint`} role={invalid ? "alert" : undefined} className={`text-xs ${invalid ? "font-medium text-negative" : "text-ink-muted"}`}>
          {invalid ? "Enter a number, for example 25,000" : q.from.name}
        </span>
      </div>

      <div className="relative z-10 -my-[26px] flex justify-center">
        <button
          type="button"
          onClick={onFlip}
          aria-label="Switch currencies"
          style={{ transform: `rotate(${rotation}deg)` }}
          className="grid size-10 place-items-center rounded-xl border-4 border-surface-200 bg-night text-signal transition-[transform,background-color] duration-[450ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-night-raised"
        >
          <Icon name="swap" size={16} strokeWidth={2.2} />
        </button>
      </div>

      <div className={`flex flex-col gap-1.5 rounded-lg bg-brand-tint px-[18px] py-4 ${flashKey > 0 ? (flashKey % 2 ? "flash-a" : "flash-b") : ""}`}>
        <span className="text-[13px] text-ink-muted">You receive</span>
        <div className="flex items-center gap-3">
          <output aria-live="polite" className="min-w-0 flex-1 truncate font-display text-[26px] font-semibold leading-9 sm:text-[32px] sm:leading-10 tracking-[-0.02em]">
            {formatAmount(shown, q.to.dp)}
          </output>
          <CurrencySelect value={to} onChange={onTo} label="Currency you receive" options={codes} />
        </div>
        <span className="text-xs text-ink-muted">{q.to.name}</span>
      </div>

      <dl className="flex flex-col gap-2 px-0.5 pt-1 text-sm">
        <div className="flex justify-between gap-3"><dt className="text-ink-muted">Rate</dt><dd className="font-medium">1 {q.from.code} = {formatRate(q.rate)} {q.to.code}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-ink-muted">Fee ({(FEE_RATE * 100).toFixed(1)}%)</dt><dd className="font-medium">{formatAmount(q.fee, q.from.dp)} {q.from.code}</dd></div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-muted">Rate lock</dt>
          <dd className="flex items-center gap-2 font-medium">
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className="-rotate-90">
              <circle cx="10" cy="10" r="8" fill="none" stroke="var(--line)" strokeWidth="2.5" />
              <circle cx="10" cy="10" r="8" fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - lockLeft / RATE_LOCK_SECONDS} className="transition-[stroke-dashoffset] duration-200 ease-linear" />
            </svg>
            {lockLeft}s left on this rate
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onQuote}
        aria-live="polite"
        className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-md bg-brand px-8 text-[15px] font-medium text-on-brand transition-[background-color,transform] duration-150 hover:bg-brand-hover active:scale-[0.98]"
      >
        {quoteState === "idle" && "Get a firm quote"}
        {quoteState === "loading" && (<><span aria-hidden="true" className="spin size-4 rounded-full border-2 border-current border-r-transparent" />Requesting quote</>)}
        {quoteState === "done" && (<><Icon name="check" size={16} strokeWidth={2.5} />Request sent. We will be in touch.</>)}
      </button>
      <p className="text-center text-xs leading-[18px] text-ink-muted">Indicative rates for illustration. Your firm rate and fees are shown before you accept.</p>
    </div>
  );
}
