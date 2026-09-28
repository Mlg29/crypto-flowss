"use client";

import { useRouter } from "next/navigation";
import { useGetMerchantsQuery } from "@/lib/api/merchant";
import { useGetUserQuery } from "@/lib/api/user";
import { clearAuth } from "@/lib/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";

export function initialsOf(text: string | undefined | null, fallback = "?") {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return fallback;
  return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/** The signed-in user, their account id and the selected merchant, from the API. */
export function useSession() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((s) => s.auth);
  const { data: userRes, isLoading: loadingUser } = useGetUserQuery(undefined, { skip: !auth.accessToken });
  const { data: merchantsRes, isLoading: loadingMerchants } = useGetMerchantsQuery(undefined, { skip: !auth.accessToken });

  const user = userRes?.data;
  const merchants = merchantsRes?.data?.merchants ?? [];
  const merchant = merchants.find((m) => m.id === auth.merchantId) ?? merchants[0];
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  return {
    user,
    merchant,
    merchants,
    merchantId: merchant?.id ?? auth.merchantId ?? "",
    accountId: auth.accountId ?? "",
    email: user?.email ?? auth.email ?? "",
    displayName: fullName || user?.email || auth.email || "",
    firstName: user?.first_name || "",
    isOwner: !!merchant && !!auth.accountId && merchant.owner_id === auth.accountId,
    loading: loadingUser || loadingMerchants,
    signOut() {
      dispatch(clearAuth());
      router.replace("/login");
    },
  };
}
