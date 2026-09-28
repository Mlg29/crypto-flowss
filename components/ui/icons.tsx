/** Outline icons (Lucide style, 1.75 to 2px stroke). `pathLength={1}` lets the line-draw animation work. */
const paths = {
  check: "M20 6 9 17l-5-5",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z",
  wallet: "M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3zM3 7l12-4v4M17 13h.01",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  swap: "M7 4v16M7 20l-4-4M7 20l4-4M17 20V4M17 4l-4 4M17 4l4 4",
  chevron: "m6 9 6 6 6-6",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 18, strokeWidth = 2, className = "", color = "currentColor" }: { name: IconName; size?: number; strokeWidth?: number; className?: string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path pathLength={1} d={paths[name]} />
    </svg>
  );
}
