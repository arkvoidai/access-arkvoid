import React, { useEffect, useRef } from 'react';
import { Container } from '../components/ui/Container';
import { WaitlistForm } from '../components/ui/WaitlistForm';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT } from '../content/site';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

export const Join: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const bgArchesRef = useRef<SVGSVGElement>(null);
  const emberCoreRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      if (bgArchesRef.current) {
        gsap.fromTo(
          bgArchesRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );
      }

      if (emberCoreRef.current) {
        gsap.fromTo(
          emberCoreRef.current,
          { scale: 0.6, opacity: 0.4, transformOrigin: '32px 41px' },
          {
            scale: 1.35,
            opacity: 1,
            duration: 0.7,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
              once: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.join}
      aria-label="Join the waitlist"
      className="relative w-full overflow-hidden bg-paper text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(120px, 16vw, 240px)',
        paddingBottom: 'clamp(120px, 16vw, 240px)',
      }}
    >
      {/* Soft dusk radial wash allowed behind final CTA */}
      <div
        aria-hidden="true"
        className="dusk-wash pointer-events-none absolute inset-x-0 bottom-[-20%] mx-auto h-[85svh] w-[95vw] max-w-[1400px] rounded-full"
      />

      {/* Giant outline of Arkvoid arches slowly parallaxing in background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <svg
          ref={bgArchesRef}
          viewBox="0 0 64 64"
          fill="none"
          className="h-[180svh] w-auto min-w-[900px] text-ink"
        >
          <path
            d="M10 56V30C10 17.85 19.85 8 32 8S54 17.85 54 30V56"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeOpacity="0.08"
          />
          <path
            d="M20 56V34C20 27.37 25.37 22 32 22S44 27.37 44 34V56"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeOpacity="0.08"
          />
          <circle
            ref={emberCoreRef}
            cx="32"
            cy="41"
            r="1.1"
            fill="var(--ember)"
            fillOpacity="0.45"
          />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center text-center">
          <SplitHeading
            as="h2"
            text={CONTENT.join.heading}
            className="font-sans text-h1 font-medium tracking-[-0.045em] text-ink"
          />

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[48ch] text-lead text-ink-soft">
              {CONTENT.join.lead}
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-10 md:mt-12 w-full">
            <WaitlistForm />
          </Reveal>

          {/* Three small facts in a row */}
          <Reveal delay={0.24} className="mt-10">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
              <span>{CONTENT.join.facts[0]}</span>
              <span aria-hidden="true" className="text-ember">
                ·
              </span>
              <span>{CONTENT.join.facts[1]}</span>
              <span aria-hidden="true" className="text-ember">
                ·
              </span>
              <span>{CONTENT.join.facts[2]}</span>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
