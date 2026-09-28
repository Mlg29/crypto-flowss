import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "signal" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none " +
  "transition-[background-color,border-color,filter,transform] duration-150 ease-out active:scale-[0.98] " +
  "disabled:opacity-45 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-[15px]",
};

function variantClass(variant: Variant, onNight: boolean) {
  switch (variant) {
    case "primary":
      return "bg-brand text-on-brand hover:bg-brand-hover";
    case "signal":
      return "bg-signal text-on-signal hover:brightness-105";
    case "secondary":
      return onNight
        ? "border border-on-night-muted text-on-night hover:bg-night-raised"
        : "border border-line-strong text-ink hover:bg-surface-300";
    case "ghost":
      return onNight ? "text-on-night hover:bg-night-raised" : "text-ink hover:bg-surface-300";
  }
}

type Common = {
  variant?: Variant;
  size?: Size;
  /** Use on the dark "night" bands so secondary and ghost buttons stay legible. */
  onNight?: boolean;
  block?: boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", onNight = false, block = false, className = "", children, ...rest } = props;
  const cls = [base, sizes[size], variantClass(variant, onNight), block ? "w-full" : "", className].join(" ");
  if ("href" in rest && rest.href) {
    const { href, ...a } = rest as AsLink;
    return (
      <Link href={href} className={cls} {...a}>
        {children}
      </Link>
    );
  }
  const b = rest as Omit<AsButton, keyof Common>;
  return (
    <button type="button" className={cls} {...b}>
      {children}
    </button>
  );
}
