import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Footer } from './components/layout/Footer';
import { Nav } from './components/layout/Nav';
import { Preloader } from './components/layout/Preloader';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { Cursor } from './components/ui/Cursor';
import { ScrollTrigger } from './lib/gsap';
import { useIsTouch, usePrefersReducedMotion } from './lib/hooks';
import { createSmoothScroll, getLenis, scrollToSection } from './lib/smooth';
import { Hero } from './sections/Hero';

const Manifesto = lazy(() => import('./sections/Manifesto').then((m) => ({ default: m.Manifesto })));
const About = lazy(() => import('./sections/About').then((m) => ({ default: m.About })));
const MarqueeBand = lazy(() => import('./sections/MarqueeBand').then((m) => ({ default: m.MarqueeBand })));
const World = lazy(() => import('./sections/World').then((m) => ({ default: m.World })));
const Characters = lazy(() => import('./sections/Characters').then((m) => ({ default: m.Characters })));
const Realms = lazy(() => import('./sections/Realms').then((m) => ({ default: m.Realms })));
const HowItWorks = lazy(() => import('./sections/HowItWorks').then((m) => ({ default: m.HowItWorks })));
const Research = lazy(() => import('./sections/Research').then((m) => ({ default: m.Research })));
const Hardware = lazy(() => import('./sections/Hardware').then((m) => ({ default: m.Hardware })));
const Roadmap = lazy(() => import('./sections/Roadmap').then((m) => ({ default: m.Roadmap })));
const WhyNow = lazy(() => import('./sections/WhyNow').then((m) => ({ default: m.WhyNow })));
const Investors = lazy(() => import('./sections/Investors').then((m) => ({ default: m.Investors })));
const Founder = lazy(() => import('./sections/Founder').then((m) => ({ default: m.Founder })));
const Faq = lazy(() => import('./sections/Faq').then((m) => ({ default: m.Faq })));
const Join = lazy(() => import('./sections/Join').then((m) => ({ default: m.Join })));

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const [heroReady, setHeroReady] = useState<boolean>(false);

  const handlePreloaderComplete = useCallback(() => {
    setHeroReady(true);
    window.requestAnimationFrame(() => {
      getLenis()?.resize();
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
  }, []);

  useEffect(() => {
    let smoothController: ReturnType<typeof createSmoothScroll> | null = null;
    // Native touch scrolling is more predictable and cheaper on phones.
    if (!reducedMotion && !isTouch) smoothController = createSmoothScroll();

    const refreshAll = () => {
      getLenis()?.resize();
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    const initTimer = window.setTimeout(refreshAll, 120);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(refreshAll).catch(() => undefined);
    }
    window.addEventListener('load', refreshAll);

    return () => {
      window.clearTimeout(initTimer);
      window.removeEventListener('load', refreshAll);
      smoothController?.destroy();
    };
  }, [reducedMotion, isTouch]);

  return (
    <div className="relative min-h-[100svh] w-full bg-paper text-ink">
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
        <Suspense fallback={<div className="min-h-[30vh] bg-paper" aria-hidden="true" />}>
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
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
