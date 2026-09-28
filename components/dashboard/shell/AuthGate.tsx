"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRefreshMutation } from "@/lib/api/auth";
import { merchantApi } from "@/lib/api/merchant";
import { clearAuth, setCredentials, setMerchant } from "@/lib/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getCookie } from "@/lib/cookie";

/**
 * Protects every /dashboard route.
 * - Access token in memory: render.
 * - Only a refresh token (page reload): POST /account/refresh, then load the merchant.
 * - Neither, or the session is cleared later: send to /login?next=<current path>.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);
  const merchantId = useAppSelector((s) => s.auth.merchantId);
  const [refresh] = useRefreshMutation();
  const [ready, setReady] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const toLogin = () => router.replace(`/login?next=${encodeURIComponent(path)}`);

    if (accessToken) {
      setReady(true);
      return;
    }
    if (!refreshToken) {
      toLogin();
      return;
    }
    refresh({ refresh_token: refreshToken })
      .unwrap()
      .then((res) => {
        dispatch(setCredentials({ accessToken: res.data.access_token, refreshToken: getCookie("refresh_token") ?? undefined, email: "" }));
        setReady(true);
      })
      .catch(() => {
        dispatch(clearAuth());
        toLogin();
      });
  }, [accessToken, refreshToken, dispatch, path, refresh, router]);

  // Pick a merchant once signed in, if none is selected yet.
  useEffect(() => {
    if (!ready || merchantId) return;
    dispatch(merchantApi.endpoints.getMerchants.initiate())
      .unwrap()
      .then((m) => {
        const first = m.data?.merchants?.[0];
        if (first) dispatch(setMerchant({ merchantId: first.id }));
      })
      .catch(() => {});
  }, [ready, merchantId, dispatch]);

  // Session ended after load (sign out, or refresh failed inside an API call).
  useEffect(() => {
    if (ready && !accessToken) router.replace("/login");
  }, [ready, accessToken, router]);

  if (!ready || !accessToken) {
    return (
      <div className="grid h-dvh place-items-center bg-surface-100" role="status" aria-label="Loading your dashboard">
        <span className="spin size-8 rounded-full border-[3px] border-brand border-t-transparent" />
      </div>
    );
  }
  return <>{children}</>;
}
