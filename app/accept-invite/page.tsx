import { Suspense } from "react";
import { AcceptInviteForm } from "@/components/auth/AcceptInviteForm";

export const metadata = { title: "Accept invite | CryptoFlow", robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <AcceptInviteForm />
    </Suspense>
  );
}
