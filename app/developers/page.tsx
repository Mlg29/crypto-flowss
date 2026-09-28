import { PageStub } from "@/components/site/PageStub";
export const metadata = { title: "Developers | CryptoFlow" };
export default function Page() {
  return <PageStub eyebrow="Developers" title="One API for every money movement." intro="REST endpoints, signed webhooks and a testnet sandbox that mirrors production." needs={["Link to the API reference: quotes, exchanges, payouts, settlements, webhooks", "Sandbox access and whether it is self-serve", "Authentication: API keys, secret handling, IP allowlisting", "Webhook events and signing, idempotency and rate limits", "SDKs and languages actually shipped, and a status page link"]} />;
}
