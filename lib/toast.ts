export type ToastTone = "success" | "danger" | "info";
export type ToastItem = { id: number; tone: ToastTone; message: string };

type Listener = (t: ToastItem) => void;
const listeners = new Set<Listener>();
let seq = 0;

function push(tone: ToastTone, message: string) {
  const t = { id: ++seq, tone, message };
  listeners.forEach((l) => l(t));
}

/** Tiny global toast bus. <Toaster /> in the root layout renders them. */
export const toast = {
  success: (m: string) => push("success", m),
  danger: (m: string) => push("danger", m),
  info: (m: string) => push("info", m),
  subscribe(l: Listener) {
    listeners.add(l);
    return () => { listeners.delete(l); };
  },
};

/** Pull the API's `message` out of an RTK Query error, with a fallback. */
export function errorMessage(err: unknown, fallback: string): string {
  const data = (err as { data?: { message?: string | string[] } })?.data;
  const m = data?.message;
  if (Array.isArray(m)) return m[0] ?? fallback;
  return m || fallback;
}
