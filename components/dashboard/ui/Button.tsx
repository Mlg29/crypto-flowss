import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "signal";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium " +
  "transition-[background-color,border-color,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45";
const sizes: Record<Size, string> = { sm: "h-8 rounded-lg px-3 text-[13px]", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-[15px]" };
const variants: Record<Variant, string> = {
  primary: "border-transparent bg-brand text-on-brand hover:bg-brand-hover",
  secondary: "border-line-strong bg-surface-200 text-ink hover:bg-surface-300",
  ghost: "border-transparent bg-transparent text-ink hover:bg-surface-300",
  signal: "border-transparent bg-signal text-on-signal hover:brightness-105",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({ variant = "primary", size = "md", className = "", children, ...rest }: Common & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button type="button" className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", className = "", children, href }: Common & { href: string }) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
