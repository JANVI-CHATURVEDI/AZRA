import { Arrival } from "@/components/effects/arrival";
import { CharBloat } from "@/components/effects/char-bloat";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { WaveBackground } from "@/components/effects/wave-background";
import { Hud } from "@/components/layout/hud";
import { MotionProvider } from "@/components/layout/motion-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HorizontalPhase } from "@/components/scroll/horizontal-phase";
import { SmoothScroll } from "@/components/scroll/smooth-scroll";
import { StackPhase } from "@/components/scroll/stack-phase";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Partnership } from "@/components/sections/partnership";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";

export default function HomePage() {
  return (
    <MotionProvider>
      <div className="relative min-h-screen bg-bg text-fg">
        {}
        <WaveBackground />
        <CustomCursor />
        <CharBloat />
        <Arrival />
        <Hud />
        <SmoothScroll />

        <SiteHeader />

        <main id="top" className="relative z-1 pb-28">
          {}
          <StackPhase>
            <Hero />
            <Manifesto />
            <Services />
          </StackPhase>

          {}
          <HorizontalPhase>
            <Work />
            <Process />
          </HorizontalPhase>

          {}
          <Partnership />
          <Contact />
        </main>

        <SiteFooter />
      </div>
    </MotionProvider>
  );
}
