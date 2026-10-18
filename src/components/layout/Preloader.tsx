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

  const hasCompletedRef = useRef<boolean>(false);

  const [shouldSkip] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [count, setCount] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(!(reducedMotion || shouldSkip));

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
    if (!root) {
      fireCompleteOnce();
      return undefined;
    }

    // Lock scroll while preloader is active
    document.body.classList.add('scroll-locked');
    getLenis()?.stop();

    let isCancelled = false;
    const startTime = Date.now();
    const minDuration = 1100;
    const maxDuration = 2200;

    // Track real readiness (fonts + hero image) with a strict 1.4s timeout fallback
    const fontsReady =
      typeof document !== 'undefined' && 'fonts' in document
        ? Promise.race([
            document.fonts.ready.catch(() => undefined),
            new Promise<void>((res) => window.setTimeout(res, 1400)),
          ])
        : Promise.resolve();

    const heroReady = new Promise<void>((resolve) => {
      const timeoutId = window.setTimeout(resolve, 1400);
      const done = () => {
        window.clearTimeout(timeoutId);
        resolve();
      };

      try {
        const img = new Image();
        img.onload = () => {
          if (typeof img.decode === 'function') {
            img.decode().then(done).catch(done);
          } else {
            done();
          }
        };
        img.onerror = done;
        img.src = MEDIA['world-hero'].src;
        if (img.complete) {
          done();
        }
      } catch {
        done();
      }
    });

    let assetsResolved = false;
    Promise.all([fontsReady, heroReady])
      .then(() => {
        assetsResolved = true;
      })
      .catch(() => {
        assetsResolved = true;
      });

    const ctx = gsap.context(() => {
      if (outerArchRef.current && innerArchRef.current && emberCoreRef.current) {
        gsap.set([outerArchRef.current, innerArchRef.current], {
          strokeDasharray: 1,
          strokeDashoffset: 1,
        });
        gsap.set(emberCoreRef.current, {
          scale: 0,
          transformOrigin: '32px 41px',
        });

        const drawTl = gsap.timeline();
        drawTl
          .to(
            [outerArchRef.current, innerArchRef.current],
            {
              strokeDashoffset: 0,
              duration: 0.9,
              stagger: 0.15,
              ease: 'expo.out',
            },
            0
          )
          .to(
            emberCoreRef.current,
            {
              scale: 1,
              duration: 0.55,
              ease: 'back.out(2.4)',
            },
            0.75
          );
      }
    }, root);

    let rafId = 0;
    let intervalId = 0;
    let exitStarted = false;

    const triggerExit = () => {
      if (exitStarted || isCancelled) return;
      exitStarted = true;
      window.cancelAnimationFrame(rafId);
      window.clearInterval(intervalId);
      setCount(100);

      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // ignore sessionStorage restrictions
      }

      // Immediately notify App so Hero begins its reveal while preloader slides up
      fireCompleteOnce();

      const exitTl = gsap.timeline({
        onComplete: () => {
          if (isCancelled) return;
          document.body.classList.remove('scroll-locked');
          getLenis()?.start();
          getLenis()?.resize();
          setVisible(false);
          window.requestAnimationFrame(() => {
            ScrollTrigger.sort();
            ScrollTrigger.refresh();
          });
        },
      });

      exitTl.to(
        root,
        {
          yPercent: -100,
          duration: 0.9,
          ease: 'expo.inOut',
        },
        0
      );

      if (curvePathRef.current) {
        exitTl.to(
          curvePathRef.current,
          {
            attr: { d: 'M0 0 L1440 0 Q720 0 0 0 Z' },
            duration: 0.9,
            ease: 'expo.inOut',
          },
          0
        );
      }
    };

    const tickProgress = () => {
      if (isCancelled || exitStarted) return;
      const elapsed = Date.now() - startTime;
      const minFraction = Math.min(1, elapsed / minDuration);
      const maxFraction = Math.min(1, elapsed / maxDuration);

      const targetProgress = assetsResolved
        ? minFraction
        : Math.min(0.94, maxFraction * 0.94);

      const displayVal = Math.min(100, Math.floor(targetProgress * 100));
      setCount(displayVal);

      if ((assetsResolved && elapsed >= minDuration) || elapsed >= maxDuration) {
        triggerExit();
      }
    };

    const rafLoop = () => {
      if (isCancelled || exitStarted) return;
      tickProgress();
      if (!exitStarted) {
        rafId = window.requestAnimationFrame(rafLoop);
      }
    };

    // Run both RAF and a 50ms interval so backgrounded tabs/iframes never stall
    rafId = window.requestAnimationFrame(rafLoop);
    intervalId = window.setInterval(tickProgress, 50);

    // Unconditional hard fallbacks so the preloader can never get stuck
    const hardExitTimer = window.setTimeout(() => {
      triggerExit();
    }, maxDuration + 50);

    const hardUnmountTimer = window.setTimeout(() => {
      if (isCancelled) return;
      fireCompleteOnce();
      setVisible(false);
    }, maxDuration + 1050);

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearInterval(intervalId);
      window.clearTimeout(hardExitTimer);
      window.clearTimeout(hardUnmountTimer);
      document.body.classList.remove('scroll-locked');
      getLenis()?.start();
      ctx.revert();
    };
  }, [reducedMotion, shouldSkip]);

  if (!visible) return null;

  const formattedCount = String(count).padStart(3, '0');

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading Arkvoid Inc."
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-paper text-ink select-none"
    >
      <div className="flex flex-col items-center gap-8">
        <svg
          width="84"
          height="84"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="butt"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            ref={outerArchRef}
            d="M10 56V30C10 17.85 19.85 8 32 8S54 17.85 54 30V56"
            pathLength="1"
          />
          <path
            ref={innerArchRef}
            d="M20 56V34C20 27.37 25.37 22 32 22S44 27.37 44 34V56"
            pathLength="1"
          />
          <circle
            ref={emberCoreRef}
            cx="32"
            cy="41"
            r="4.5"
            fill="var(--ember)"
            stroke="none"
          />
        </svg>

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink tabular-nums">
            {formattedCount}
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
            ARKVOID INC.
          </span>
        </div>
      </div>

      {/* Curved bottom edge morphing during slide-up exit */}
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-full h-[110px] w-full text-paper"
      >
        <path
          ref={curvePathRef}
          fill="currentColor"
          d="M0 0 L1440 0 Q720 140 0 0 Z"
        />
      </svg>
    </div>
  );
};
