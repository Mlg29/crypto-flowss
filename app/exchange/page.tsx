import { PageStub } from "@/components/site/PageStub";
export const metadata = { title: "Exchange | CryptoFlow" };
export default function Page() {
  return <PageStub eyebrow="Exchange" title="Firm quotes, fast settlement, no surprises." intro="Convert between stablecoins, crypto and local currency from the desk or by API." needs={["Live rate feed: pricing source and refresh interval", "Real fee or spread model, and volume tiers", "Rate-lock rules: how long a quote holds and what happens at expiry", "Minimum and maximum trade sizes, and OTC handling for large tickets", "Timing for each stage: funds received, converted, settled"]} />;
}
