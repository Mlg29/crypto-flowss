import { configureStore, isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer, { clearAuth, initialAuthState, loadRefreshToken, loadSessionMeta } from "./authSlice";
import { baseApi } from "@/lib/api/base";
import { toast } from "@/lib/toast";

const apiErrorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as { status?: number; data?: { message?: string } };
    if (typeof payload?.status === "number" && payload.status >= 500) {
      toast.danger(payload?.data?.message ?? "Server error. Please try again.");
    }
  }
  return next(action);
};

const resetCacheOnLogout: Middleware = ({ dispatch }) => (next) => (action) => {
  const result = next(action);
  if (clearAuth.match(action as Parameters<typeof clearAuth.match>[0])) dispatch(baseApi.util.resetApiState());
  return result;
};

/** One store per browser tab (created in StoreProvider), never shared between server requests. */
export function makeStore() {
  return configureStore({
    reducer: { auth: authReducer, [baseApi.reducerPath]: baseApi.reducer },
    preloadedState: { auth: { ...initialAuthState, ...loadSessionMeta(), refreshToken: loadRefreshToken() } },
    middleware: (gdm) => gdm().concat(baseApi.middleware, apiErrorMiddleware, resetCacheOnLogout),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
