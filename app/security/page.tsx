import { PageStub } from "@/components/site/PageStub";
export const metadata = { title: "Security | CryptoFlow" };
export default function Page() {
  return <PageStub eyebrow="Privacy and security" title="Compliant with the rules. Discreet with your business." intro="How CryptoFlow protects funds and data. Every claim on this page must be true and provable." needs={["Licensing and regulatory status, with the licence numbers you may publish", "How funds are held: custody model, wallet provider, cold and hot storage, multi-sig or MPC", "Compliance process: KYB steps, AML and sanctions screening provider, Travel Rule approach", "Data practices: what is collected, where it is stored, retention, encryption, access", "Certifications and audits (ISO 27001, SOC 2, penetration tests) and a security contact"]} />;
}
