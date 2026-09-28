export function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card flex flex-col gap-1.5 px-5 py-[18px]">
      <span className="text-[13px] text-ink-muted">{label}</span>
      <span className="font-display text-[26px] font-semibold leading-8">{value}</span>
      <span className="text-xs text-ink-muted">{sub}</span>
    </div>
  );
}
