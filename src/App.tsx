import { useCallback, useEffect, useState } from 'react';
import { Footer } from './components/layout/Footer';
import { Nav } from './components/layout/Nav';
import { Preloader } from './components/layout/Preloader';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { Cursor } from './components/ui/Cursor';
import { ScrollTrigger } from './lib/gsap';
import { useIsTouch, usePrefersReducedMotion } from './lib/hooks';
import { createSmoothScroll, scrollToSection } from './lib/smooth';
import { About } from './sections/About';
import { Characters } from './sections/Characters';
import { Faq } from './sections/Faq';
import { Founder } from './sections/Founder';
import { Hardware } from './sections/Hardware';
import { Hero } from './sections/Hero';
import { HowItWorks } from './sections/HowItWorks';
import { Investors } from './sections/Investors';
import { Join } from './sections/Join';
import { Manifesto } from './sections/Manifesto';
import { MarqueeBand } from './sections/MarqueeBand';
import { Realms } from './sections/Realms';
import { Research } from './sections/Research';
import { Roadmap } from './sections/Roadmap';
import { WhyNow } from './sections/WhyNow';
import { World } from './sections/World';

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const [heroReady, setHeroReady] = useState<boolean>(false);

  const handlePreloaderComplete = useCallback(() => {
    setHeroReady(true);
  }, []);

  useEffect(() => {
    let smoothController: ReturnType<typeof createSmoothScroll> | null = null;

    if (!reducedMotion && !isTouch) {
      smoothController = createSmoothScroll();
    }

    // Refresh ScrollTrigger once after fonts are ready
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready
        .then(() => {
          ScrollTrigger.refresh();
        })
        .catch(() => undefined);
    }

    return () => {
      smoothController?.destroy();
    };
  }, [reducedMotion, isTouch]);

  return (
    <div className="relative min-h-[100svh] w-full bg-paper text-ink">
      {/* Skip to content link as the first focusable element — never sets a URL hash */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          const mainEl = document.getElementById('main-content');
          mainEl?.focus();
          scrollToSection('main-content', 0);
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-mono focus:text-[13px] focus:uppercase focus:tracking-[0.14em] focus:text-paper"
      >
        Skip to content
      </a>

      <Preloader onComplete={handlePreloaderComplete} />
      <ScrollProgress />
      <Cursor />
      <Nav />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero ready={heroReady} />
        <Manifesto />
        <About />
        <MarqueeBand />
        <World />
        <Characters />
        <Realms />
        <HowItWorks />
        <Research />
        <Hardware />
        <Roadmap />
        <WhyNow />
        <Investors />
        <Founder />
        <Faq />
        <Join />
      </main>

      <Footer />
    </div>
  );
}
