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

export function scrollToTop(): void {
  if (window.location.hash) {
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );
  }
  if (activeInstance) {
    activeInstance.scrollTo(0, { duration: 1.4 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function scrollToSection(target: string, offset = -80): void {
  if (window.location.hash) {
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );
  }

  const cleanId = target.startsWith('#') ? target.slice(1) : target;
  if (cleanId === 'top') {
    scrollToTop();
    return;
  }

  const el = document.getElementById(cleanId);
  if (!el) return;

  if (activeInstance) {
    activeInstance.scrollTo(el, { offset, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
