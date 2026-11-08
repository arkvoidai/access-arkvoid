import React, { useEffect, useRef, useState } from 'react';
import { MEDIA } from '../../config/media';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { getLenis } from '../../lib/smooth';

export interface PreloaderProps {
  onComplete: () => void;
}

const SESSION_KEY = 'arkvoid_preloader_seen';

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const reducedMotion = usePrefersReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const hasCompletedRef = useRef(false);
  const [shouldSkip] = useState(() => {
    if (typeof window === 'undefined') return false;
    try { return window.sessionStorage.getItem(SESSION_KEY) === '1'; }
    catch { return false; }
  });
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(!(reducedMotion || shouldSkip));
  const rootRef = useRef<HTMLDivElement>(null);
  const outerArchRef = useRef<SVGPathElement>(null);
  const innerArchRef = useRef<SVGPathElement>(null);
  const emberCoreRef = useRef<SVGCircleElement>(null);
  const curvePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const fireCompleteOnce = () => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      document.body.classList.remove('scroll-locked');
      getLenis()?.start();
      getLenis()?.resize();
      onCompleteRef.current();
    };

    if (reducedMotion || shouldSkip) {
      setVisible(false);
      fireCompleteOnce();
      return undefined;
    }

    const root = rootRef.current;
    if (!root) { fireCompleteOnce(); return undefined; }

    document.body.classList.add('scroll-locked');
    getLenis()?.stop();
    let cancelled = false;
    let exitStarted = false;
    const startTime = Date.now();
    const minDuration = 650;
    const maxDuration = 1050;

    const fontsReady = ('fonts' in document)
      ? Promise.race([document.fonts.ready.catch(() => undefined), new Promise<void>((resolve) => window.setTimeout(resolve, 700))])
      : Promise.resolve();
    const heroReady = new Promise<void>((resolve) => {
      const timer = window.setTimeout(resolve, 700);
      const done = () => { window.clearTimeout(timer); resolve(); };
      const img = new Image();
      img.onload = () => typeof img.decode === 'function' ? img.decode().then(done).catch(done) : done();
      img.onerror = done;
      img.src = MEDIA['world-hero'].src;
      if (img.complete) done();
    });

    let assetsReady = false;
    Promise.all([fontsReady, heroReady]).then(() => { assetsReady = true; }).catch(() => { assetsReady = true; });

    const ctx = gsap.context(() => {
      if (outerArchRef.current && innerArchRef.current && emberCoreRef.current) {
        gsap.set([outerArchRef.current, innerArchRef.current], { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(emberCoreRef.current, { scale: 0, transformOrigin: '32px 41px' });
        gsap.timeline()
          .to([outerArchRef.current, innerArchRef.current], { strokeDashoffset: 0, duration: 0.65, stagger: 0.1, ease: 'expo.out' }, 0)
          .to(emberCoreRef.current, { scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 0.5);
      }
    }, root);

    let rafId = 0;
    let exitTimer = 0;
    const exit = () => {
      if (exitStarted || cancelled) return;
      exitStarted = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(exitTimer);
      try { window.sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage may be blocked */ }
      setCount(100);
      fireCompleteOnce();
      const finish = () => {
        if (cancelled) return;
        setVisible(false);
        document.body.classList.remove('scroll-locked');
        getLenis()?.start();
        window.requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
      };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
      gsap.to(root, { yPercent: -100, duration: 0.55, ease: 'expo.inOut', onComplete: finish });
    };

    const tick = () => {
      if (cancelled || exitStarted) return;
      const elapsed = Date.now() - startTime;
      const progress = assetsReady ? Math.min(1, elapsed / minDuration) : Math.min(0.94, elapsed / maxDuration * 0.94);
      setCount(Math.floor(progress * 100));
      if ((assetsReady && elapsed >= minDuration) || elapsed >= maxDuration) exit();
      else rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
    exitTimer = window.setTimeout(exit, maxDuration + 80);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(exitTimer);
      document.body.classList.remove('scroll-locked');
      getLenis()?.start();
      ctx.revert();
    };
  }, [reducedMotion, shouldSkip]);

  if (!visible) return null;
  return (
    <div ref={rootRef} role="status" aria-live="polite" aria-label="Loading Arkvoid" className="fixed inset-0 z-[90] flex select-none flex-col items-center justify-center bg-paper text-ink">
      <div className="flex flex-col items-center gap-8">
        <svg width="84" height="84" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="butt" strokeLinejoin="round" aria-hidden="true">
          <path ref={outerArchRef} d="M10 56V30C10 17.85 19.85 8 32 8S54 17.85 54 30V56" pathLength="1" />
          <path ref={innerArchRef} d="M20 56V34C20 27.37 25.37 22 32 22S44 27.37 44 34V56" pathLength="1" />
          <circle ref={emberCoreRef} cx="32" cy="41" r="4.5" fill="var(--ember)" stroke="none" />
        </svg>
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-mono text-[13px] uppercase tracking-[0.14em] tabular-nums">{String(count).padStart(3, '0')}</span>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">ARKVOID INC.</span>
        </div>
      </div>
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute left-0 top-full h-[110px] w-full text-paper">
        <path ref={curvePathRef} fill="currentColor" d="M0 0 L1440 0 Q720 140 0 0 Z" />
      </svg>
    </div>
  );
};
