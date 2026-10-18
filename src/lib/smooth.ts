import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from './gsap';

export interface SmoothScrollController {
  lenis: Lenis;
  destroy: () => void;
}

let activeInstance: Lenis | null = null;

export function createSmoothScroll(): SmoothScrollController {
  const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
  });

  activeInstance = lenis;
  lenis.on('scroll', ScrollTrigger.update);

  const tick = (t: number) => {
    lenis.raf(t * 1000);
  };

  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy() {
      if (activeInstance === lenis) {
        activeInstance = null;
      }
      gsap.ticker.remove(tick);
      lenis.destroy();
    },
  };
}

export function getLenis(): Lenis | null {
  return activeInstance;
}

export function scrollToSection(target: string, offset = -80): void {
  const el = document.querySelector<HTMLElement>(target);
  if (!el) return;

  if (activeInstance) {
    activeInstance.scrollTo(el, { offset, duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
