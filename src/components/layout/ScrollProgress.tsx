import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.2,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[85] h-[2px] overflow-hidden"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-ember origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};
