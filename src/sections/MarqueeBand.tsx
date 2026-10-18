import React, { useEffect, useRef } from 'react';
import { CONTENT } from '../content/site';
import { usePrefersReducedMotion } from '../lib/hooks';
import { getLenis } from '../lib/smooth';

export const MarqueeBand: React.FC = () => {
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const band = bandRef.current;
    const track = trackRef.current;
    if (!band || !track) return undefined;

    // Pause CSS marquee when off screen
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            band.classList.remove('is-offscreen');
          } else {
            band.classList.add('is-offscreen');
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(band);

    if (reducedMotion) {
      return () => io.disconnect();
    }

    // Gently modulate playbackRate (1x to 3x) based on Lenis scroll velocity
    let rafId = 0;
    const updateVelocityRate = () => {
      const lenis = getLenis();
      const animations = track.getAnimations?.() || [];
      if (lenis && animations.length > 0) {
        const velocity = Math.abs(lenis.velocity || 0);
        const rate = Math.min(3, Math.max(1, 1 + velocity * 0.08));
        animations.forEach((anim) => {
          anim.playbackRate = rate;
        });
      }
      rafId = window.requestAnimationFrame(updateVelocityRate);
    };

    rafId = window.requestAnimationFrame(updateVelocityRate);

    return () => {
      io.disconnect();
      window.cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const sequenceWords = [
    ...CONTENT.marquee.words,
    ...CONTENT.marquee.words,
    ...CONTENT.marquee.words,
    ...CONTENT.marquee.words,
  ];

  const renderCopyGroup = (copyIndex: number) => (
    <div
      key={copyIndex}
      aria-hidden={copyIndex > 0 ? 'true' : undefined}
      className="flex items-center shrink-0"
    >
      {sequenceWords.map((word, idx) => {
        const isOutline = idx % 2 === 1;
        return (
          <span key={`${copyIndex}-${idx}`} className="inline-flex items-center">
            <span
              className={`font-sans font-medium tracking-[-0.04em] select-none px-4 md:px-6 ${
                isOutline ? 'marquee-outline-word' : 'text-ink'
              }`}
              style={{
                fontSize: 'clamp(2.8rem, 1.2rem + 5.5vw, 6.2rem)',
                lineHeight: 1,
              }}
            >
              {word}
            </span>
            <span
              aria-hidden="true"
              className="mx-2 md:mx-4 inline-flex h-3.5 w-3.5 md:h-4 md:w-4 items-center justify-center rounded-full border-2 border-ember shrink-0"
            />
          </span>
        );
      })}
    </div>
  );

  return (
    <div
      ref={bandRef}
      role="region"
      aria-label="Remember, Return, Rise"
      className="relative w-full overflow-hidden border-y border-line bg-paper flex items-center"
      style={{ height: 'clamp(96px, 14vw, 180px)' }}
    >
      <div ref={trackRef} className="marquee-track items-center">
        {renderCopyGroup(0)}
        {renderCopyGroup(1)}
      </div>
    </div>
  );
};
