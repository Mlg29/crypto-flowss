/** Compact token label: mark, ticker and network. Replace the letter mark with the issuer's official SVG. */
export function AssetPill({ symbol, network }: { symbol: string; network?: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface-200 py-1 pl-1 pr-3 font-mono text-[13px] font-medium leading-5 text-ink">
      <span aria-hidden="true" className="grid size-[22px] place-items-center rounded-full bg-surface-300 text-[10px] font-semibold">
        {symbol.slice(0, 1)}
      </span>
      {symbol}
      {network ? <span className="font-sans font-normal text-ink-muted">{network}</span> : null}
    </span>
  );
}
