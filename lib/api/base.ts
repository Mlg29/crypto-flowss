import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "@/lib/store";
import { clearAuth, setCredentials } from "@/lib/store/authSlice";
import { getDeviceId } from "@/lib/device-id";
import { getCookie } from "@/lib/cookie";

/**
 * All calls go to this app's own /api/v1/* route (app/api/[...path]/route.ts),
 * which signs them with the HMAC secret on the server and forwards to the API.
 * The browser only adds the bearer token and the device fingerprint.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "",
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("x-device-id", await getDeviceId());
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

/** On a 401, refresh the access token once (shared across concurrent calls) and retry. */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401) return result;

  const url = typeof args === "string" ? args : args.url;
  if (url.includes("/account/refresh") || url.includes("/account/login")) return result;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refreshToken;
      if (!refreshToken) {
        api.dispatch(clearAuth());
        return false;
      }
      const refreshResult = await rawBaseQuery(
        { url: "/api/v1/account/refresh", method: "POST", body: { refresh_token: refreshToken } },
        api,
        extraOptions,
      );
      if (refreshResult.data) {
        const data = (refreshResult.data as { data: { access_token: string } }).data;
        api.dispatch(
          setCredentials({
            accessToken: data.access_token,
            refreshToken: getCookie("refresh_token") ?? undefined,
            email: state.auth.email ?? "",
            merchantId: state.auth.merchantId ?? undefined,
          }),
        );
        return true;
      }
      api.dispatch(clearAuth());
      return false;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  if (await refreshPromise) result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: ["Merchants", "MerchantAccounts", "AuditLogs", "Roles", "UserProfile", "MemberRoles"],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
