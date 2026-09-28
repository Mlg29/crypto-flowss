import { createHash, createHmac, randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";


export const dynamic = "force-dynamic";

const API_URL = (process.env.CRYPTOFLOW_API_URL ?? "").replace(/\/+$/, "");
const SECRET = process.env.HMAC_SIGNATURE_SECRET ?? "";

const FORWARD_REQUEST_HEADERS = ["authorization", "content-type", "accept", "cookie", "x-device-id", "user-agent", "accept-language"];

function sign(method: string, path: string, body: string) {
  const timestamp = Date.now().toString();
  const nonce = randomBytes(16).toString("hex");
  const bodyHash = createHash("sha256").update(body).digest("hex");
  const canonical = [method.toUpperCase(), path, timestamp, nonce, bodyHash].join("\n");
  const signature = createHmac("sha256", SECRET).update(canonical).digest("hex");
  return { "x-signature": signature, "x-timestamp": timestamp, "x-nonce": nonce };
}

/** Drop the Domain attribute so cookies set by the API attach to this app's origin. */
function rewriteSetCookie(cookie: string) {
  return cookie.replace(/;\s*Domain=[^;]*/i, "");
}

async function proxy(req: NextRequest) {
  if (!API_URL || !SECRET) {
    return Response.json(
      { status: false, message: "API proxy is not configured. Set CRYPTOFLOW_API_URL and HMAC_SIGNATURE_SECRET in .env.local.", data: null },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const path = url.pathname; // e.g. /api/v1/account/login
  const method = req.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? "" : await req.text();

  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const v = req.headers.get(name);
    if (v) headers.set(name, v);
  }
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) headers.set("x-forwarded-for", forwardedFor);
  for (const [k, v] of Object.entries(sign(method, path, body))) headers.set(k, v);

  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}${path}${url.search}`, {
      method,
      headers,
      body: body || undefined,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    return Response.json({ status: false, message: "Could not reach the CryptoFlow API.", data: null }, { status: 502 });
  }

  const out = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) out.set("content-type", contentType);
  for (const c of upstream.headers.getSetCookie()) out.append("set-cookie", rewriteSetCookie(c));

  return new Response(upstream.status === 204 ? null : await upstream.arrayBuffer(), { status: upstream.status, headers: out });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
