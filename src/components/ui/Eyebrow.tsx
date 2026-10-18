import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { usePrefersReducedMotion } from '../../lib/hooks';

export interface EyebrowProps {
  children: React.ReactNode;
  withPulseDot?: boolean;
  className?: string;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  withPulseDot = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    const line = lineRef.current;
    if (!el) return undefined;

    // Pause infinite CSS animations when offscreen
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove('is-offscreen');
          } else {
            el.classList.add('is-offscreen');
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(el);

    if (reducedMotion || !line) {
      return () => io.disconnect();
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
        }
      );
    }, el);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center gap-3 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft ${className}`}
    >
      <span
        ref={lineRef}
        aria-hidden="true"
        className="h-[1.5px] w-6 bg-ember origin-left block shrink-0"
      />
      {withPulseDot && (
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-ember ember-pulse shrink-0"
        />
      )}
      <span>{children}</span>
    </div>
  );
};
