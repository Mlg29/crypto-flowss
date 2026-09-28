"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  /** Seconds to wait after the element enters the viewport. */
  delay?: number;
  children: ReactNode;
  [key: string]: unknown;
};

/**
 * Fades and lifts its content into place the first time it scrolls into view.
 * Runs once per element. Respects prefers-reduced-motion via globals.css.
 */
export function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = { "--reveal-delay": `${delay}s` } as CSSProperties;
  return (
    <Tag ref={ref} className={`reveal ${className}`} data-shown={shown ? "true" : "false"} style={style} {...rest}>
      {children}
    </Tag>
  );
}
