import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cached: string | null = null;
let pending: Promise<string> | null = null;

/** Stable browser fingerprint sent as x-device-id on every API call (sessions are tied to it). */
export function getDeviceId(): Promise<string> {
  if (cached) return Promise.resolve(cached);
  if (typeof window === "undefined") return Promise.resolve("server");
  if (!pending) {
    pending = FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        cached = result.visitorId;
        return cached;
      })
      .catch(() => {
        pending = null;
        return "unknown";
      });
  }
  return pending;
}
