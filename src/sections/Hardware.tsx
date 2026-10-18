import React, { useEffect, useRef, useState } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Media } from '../components/ui/Media';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT, type HardwareLadderItem } from '../content/site';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

export const Hardware: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();

  const ladderRef = useRef<HTMLDivElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const glassesTransformRef = useRef<HTMLDivElement>(null);
  const detailsRowRef = useRef<HTMLDivElement>(null);

  const [activeHotspotCount, setActiveHotspotCount] = useState<number>(
    reducedMotion ? 3 : 0
  );
  const activeCountRef = useRef<number>(reducedMotion ? 3 : 0);

  // A1: Ladder rows mask-slide reveal
  useEffect(() => {
    const ladder = ladderRef.current;
    if (!ladder || reducedMotion) return undefined;

    const rowInners = Array.from(
      ladder.querySelectorAll<HTMLElement>('.hardware-ladder-row-inner')
    );

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowInners,
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ladder,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, ladder);

    return () => ctx.revert();
  }, [reducedMotion]);

  // A2: Pinned glasses concept showcase
  useEffect(() => {
    if (reducedMotion) {
      setActiveHotspotCount(3);
      return undefined;
    }

    const stage = pinStageRef.current;
    const mediaBox = glassesTransformRef.current;
    if (!stage || !mediaBox) return undefined;

    const mm = gsap.matchMedia();

    const buildPin = (scrollLengthVh: number) => {
      gsap.set(mediaBox, {
        scale: 0.82,
        rotateY: -8,
        yPercent: 6,
        transformPerspective: 1200,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: `+=${scrollLengthVh}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const nextCount = p < 0.18 ? 0 : p < 0.45 ? 1 : p < 0.72 ? 2 : 3;
            if (nextCount !== activeCountRef.current) {
              activeCountRef.current = nextCount;
              setActiveHotspotCount(nextCount);
            }
          },
        },
      });

      tl.to(
        mediaBox,
        {
          scale: 1.08,
          rotateY: 6,
          yPercent: -2,
          ease: 'none',
          duration: 1,
        },
        0
      );
    };

    mm.add('(min-width: 1024px)', () => {
      buildPin(220);
    });

    mm.add('(max-width: 1023px)', () => {
      buildPin(140);
    });

    return () => mm.revert();
  }, [reducedMotion]);

  // Staggered rise for the 3 detail squares
  useEffect(() => {
    const row = detailsRowRef.current;
    if (!row || reducedMotion) return undefined;

    const cards = Array.from(
      row.querySelectorAll<HTMLElement>('.glasses-detail-card')
    );

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 86%',
            once: true,
            onEnter: () => ScrollTrigger.refresh(),
          },
        }
      );
    }, row);

    return () => ctx.revert();
  }, [reducedMotion]);

  const renderChip = (chip: HardwareLadderItem['chip']) => {
    if (chip === 'In development') {
      return (
        <span className="inline-flex items-center rounded-full bg-ember px-3.5 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink font-medium shrink-0">
          {chip}
        </span>
      );
    }
    if (chip === 'Exploring') {
      return (
        <span className="inline-flex items-center rounded-full bg-violet-wash px-3.5 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-violet-deep font-medium shrink-0">
          {chip}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full border border-dashed border-ink/45 bg-[#FFFFFF] px-3.5 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink font-medium shrink-0">
        {chip}
      </span>
    );
  };

  const hotspots = CONTENT.hardware.showcase.hotspots;

  return (
    <section
      id={SECTION_IDS.hardware}
      aria-label="Software and Hardware"
      className="relative w-full bg-paper text-ink border-t border-line"
    >
      {/* Header + A1. The Ladder */}
      <div
        style={{
          paddingTop: 'clamp(96px, 14vw, 220px)',
          paddingBottom: 'clamp(64px, 8vw, 120px)',
        }}
      >
        <Container>
          <div className="mb-14 md:mb-20 max-w-[900px]">
            <Eyebrow>{CONTENT.hardware.eyebrow}</Eyebrow>
            <div className="mt-4">
              <SplitHeading
                as="h2"
                text={CONTENT.hardware.heading}
                className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
              />
            </div>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-[54ch] text-lead text-ink-soft">
                {CONTENT.hardware.lead}
              </p>
            </Reveal>
          </div>

          {/* A1. Four wide ladder rows */}
          <div ref={ladderRef} className="border-t border-line">
            {CONTENT.hardware.ladder.map((item) => (
              <div
                key={item.number}
                className="overflow-hidden border-b border-line"
              >
                <div className="hardware-ladder-row-inner group flex flex-col gap-4 px-4 py-6 sm:px-6 md:py-8 transition-colors duration-500 ease-expo-out hover:bg-paper-2 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                  <div className="flex items-baseline gap-5 lg:w-[28%] shrink-0">
                    <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink-soft tabular-nums">
                      {item.number}
                    </span>
                    <h3 className="font-sans text-h3 font-medium tracking-[-0.03em] text-ink">
                      {item.device}
                    </h3>
                  </div>

                  <p className="text-body text-ink-soft lg:flex-1">
                    {item.sentence}
                  </p>

                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
                    {renderChip(item.chip)}
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-8 items-center justify-center text-ink opacity-0 -translate-x-3 transition-all duration-500 ease-expo-out group-hover:opacity-100 group-hover:translate-x-0"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                          d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* A2. The Glasses Concept (Pinned Showcase) */}
      <div
        ref={pinStageRef}
        className={`relative w-full ${
          reducedMotion
            ? 'py-8'
            : 'flex h-[100svh] items-center justify-center py-4 md:py-6'
        }`}
      >
        <Container className="h-full flex items-center">
          <div className="relative flex h-full min-h-[540px] w-full flex-col justify-between overflow-hidden rounded-[28px] lg:rounded-[36px] border border-white/[0.08] bg-ink p-6 sm:p-10 lg:p-14 text-paper">
            {/* Soft ember-to-violet radial wash at bottom-right (18% opacity) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-12%] bottom-[-18%] h-[70%] w-[70%] rounded-full"
              style={{
                background:
                  'radial-gradient(60% 60% at 65% 65%, var(--ember-wash) 0%, var(--violet-wash) 55%, rgba(20, 21, 26, 0) 100%)',
                opacity: 0.18,
              }}
            />

            {/* Corner hairline ring graphics */}
            <svg
              viewBox="0 0 160 160"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 text-paper opacity-15"
            >
              <circle cx="80" cy="80" r="52" stroke="currentColor" strokeWidth="1" />
              <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="1" />
            </svg>
            <svg
              viewBox="0 0 160 160"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 text-paper opacity-15"
            >
              <circle cx="80" cy="80" r="52" stroke="currentColor" strokeWidth="1" />
              <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="1" />
            </svg>

            {/* Center Stage: Glasses Hero Media + Desktop Hotspots */}
            <div className="relative z-10 my-auto mx-auto w-full max-w-[780px]">
              <div
                ref={glassesTransformRef}
                className="relative mx-auto aspect-[16/10] w-full max-h-[48svh] overflow-hidden rounded-[24px] border border-white/10"
              >
                <Media mediaKey="glasses-hero" fill />
              </div>

              {/* Desktop SVG hotspot lines & paper pills */}
              <div className="hidden lg:block pointer-events-none absolute inset-0 z-20">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full overflow-visible"
                >
                  {hotspots.map((hs, idx) => {
                    const visible = idx < activeHotspotCount;
                    return (
                      <g
                        key={hs.label}
                        className="transition-opacity duration-500 ease-expo-out"
                        style={{ opacity: visible ? 1 : 0 }}
                      >
                        <line
                          x1={hs.xPercent}
                          y1={hs.yPercent}
                          x2={hs.anchorX}
                          y2={hs.anchorY}
                          stroke="var(--paper)"
                          strokeWidth="0.3"
                        />
                      </g>
                    );
                  })}
                </svg>

                {hotspots.map((hs, idx) => {
                  const visible = idx < activeHotspotCount;
                  return (
                    <React.Fragment key={hs.label}>
                      {/* Anchor ember dot on image */}
                      <span
                        aria-hidden="true"
                        className="absolute -ml-2 -mt-2 flex h-4 w-4 items-center justify-center rounded-full border border-ember bg-ember/20 transition-all duration-500 ease-expo-out"
                        style={{
                          left: `${hs.anchorX}%`,
                          top: `${hs.anchorY}%`,
                          opacity: visible ? 1 : 0,
                          transform: visible ? 'scale(1)' : 'scale(0)',
                        }}
                      >
                        <span className="h-2 w-2 rounded-full bg-ember block" />
                      </span>

                      {/* Paper pill label */}
                      <div
                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-paper px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ink shadow-pill whitespace-nowrap transition-all duration-500 ease-expo-out"
                        style={{
                          left: `${hs.xPercent}%`,
                          top: `${hs.yPercent}%`,
                          opacity: visible ? 1 : 0,
                          transform: `translate(-50%, ${visible ? '-50%' : '-30%'})`,
                        }}
                      >
                        {hs.label}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Mobile 3-item caption list under the image that highlights in order */}
            <ul className="relative z-10 mt-4 flex flex-col gap-2 lg:hidden">
              {hotspots.map((hs, idx) => {
                const active = idx < activeHotspotCount;
                return (
                  <li
                    key={hs.label}
                    className={`flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.14em] transition-all duration-500 ${
                      active
                        ? 'border-ember bg-paper text-ink'
                        : 'border-white/15 bg-ink-2/60 text-paper/45'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        active ? 'bg-ember' : 'bg-paper/30'
                      }`}
                    />
                    <span>{hs.label}</span>
                  </li>
                );
              })}
            </ul>

            {/* Bottom-left title and disclaimer */}
            <div className="relative z-10 mt-6 flex flex-col gap-2">
              <h3 className="font-sans text-h3 font-medium tracking-[-0.03em] text-paper">
                {CONTENT.hardware.showcase.title}
              </h3>
              <p className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-paper/65">
                {CONTENT.hardware.showcase.disclaimer}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Three detail squares + A3. Honest line */}
      <div
        style={{
          paddingTop: 'clamp(48px, 6vw, 96px)',
          paddingBottom: 'clamp(96px, 14vw, 220px)',
        }}
      >
        <div className="mx-auto w-full max-w-[1680px]">
          <div
            ref={detailsRowRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible"
            style={{
              paddingLeft: 'clamp(20px, 4vw, 72px)',
              paddingRight: 'clamp(20px, 4vw, 72px)',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {CONTENT.hardware.showcase.details.map((detail) => (
              <figure
                key={detail.mediaKey}
                className="glasses-detail-card w-[74vw] shrink-0 snap-start md:w-auto flex flex-col gap-3"
              >
                <div className="aspect-square w-full overflow-hidden rounded-card-sm md:rounded-card border border-line bg-paper-2">
                  <Media mediaKey={detail.mediaKey} fill />
                </div>
                <figcaption className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
                  {detail.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <Container>
          <Reveal delay={0.1} className="mt-16 md:mt-24">
            <p className="mx-auto max-w-[48ch] text-center text-lead text-ink">
              {CONTENT.hardware.honestLine}
            </p>
          </Reveal>
        </Container>
      </div>
    </section>
  );
};
