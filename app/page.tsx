import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { AssetsMarquee } from "@/components/sections/AssetsMarquee";
import { Platform } from "@/components/sections/Platform";
import { Exchange } from "@/components/sections/Exchange";
import { Privacy } from "@/components/sections/Privacy";
import { Features } from "@/components/sections/Features";
import { GettingStarted } from "@/components/sections/GettingStarted";
import { Developers } from "@/components/sections/Developers";
import { UseCases } from "@/components/sections/UseCases";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AssetsMarquee />
        <Platform />
        <Exchange />
        <Privacy />
        <Features />
        <GettingStarted />
        <Developers />
        <UseCases />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
