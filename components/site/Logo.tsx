import Link from "next/link";

/** Temporary wordmark: replace with the real logo SVG when supplied. */
export function Logo({ pulse = false, small = false }: { pulse?: boolean; small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-on-night no-underline" aria-label="CryptoFlow home">
      <span aria-hidden="true" className={`${small ? "size-3" : "size-3.5"} rounded-full bg-signal ${pulse ? "pulse-dot" : ""}`} />
      <span className={`font-display font-semibold tracking-[-0.02em] ${small ? "text-xl" : "text-[22px]"}`}>CryptoFlow</span>
    </Link>
  );
}
