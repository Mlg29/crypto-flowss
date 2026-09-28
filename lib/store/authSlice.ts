import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  accountId: string | null;
  email: string | null;
  merchantId: string | null;
  activityId: string | null;
}

const TOKEN_KEY = "rt";

/** The refresh token survives reloads in sessionStorage (per tab); the access token lives in memory only. */
export function loadRefreshToken(): string | null {
  try {
    return typeof window === "undefined" ? null : sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

const META_KEY = "cf-session";
type SessionMeta = { email: string | null; accountId: string | null; merchantId: string | null };

/** Non-secret session details, so a reload can restore who is signed in without asking the API. */
export function loadSessionMeta(): Partial<SessionMeta> {
  try {
    const raw = typeof window === "undefined" ? null : sessionStorage.getItem(META_KEY);
    return raw ? (JSON.parse(raw) as SessionMeta) : {};
  } catch {
    return {};
  }
}

function saveSessionMeta(state: AuthState) {
  try {
    sessionStorage.setItem(META_KEY, JSON.stringify({ email: state.email, accountId: state.accountId, merchantId: state.merchantId }));
  } catch {}
}

function saveRefreshToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export const initialAuthState: AuthState = { accessToken: null, refreshToken: null, accountId: null, email: null, merchantId: null, activityId: null };

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ accessToken: string; refreshToken?: string; email: string; accountId?: string; merchantId?: string }>) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        saveRefreshToken(action.payload.refreshToken);
      }
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.accountId) state.accountId = action.payload.accountId;
      if (action.payload.merchantId) state.merchantId = action.payload.merchantId;
      saveSessionMeta(state);
    },
    setMerchant(state, action: PayloadAction<{ merchantId: string; accountId?: string }>) {
      state.merchantId = action.payload.merchantId;
      if (action.payload.accountId) state.accountId = action.payload.accountId;
      saveSessionMeta(state);
    },
    setActivityId(state, action: PayloadAction<string>) {
      state.activityId = action.payload;
    },
    clearAuth(state) {
      Object.assign(state, initialAuthState);
      saveRefreshToken(null);
      try { sessionStorage.removeItem(META_KEY); } catch {}
    },
  },
});

export const { setCredentials, setMerchant, setActivityId, clearAuth } = authSlice.actions;
export default authSlice.reducer;
