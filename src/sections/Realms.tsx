import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { MEDIA, type MediaKey } from '../config/media';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT } from '../content/site';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

const RING_RADII = [44, 62, 80, 98, 116, 134, 152, 170, 188] as const;

const KNOWN_REALM_KEYS: MediaKey[] = [
  'realm-01',
  'realm-02',
  'realm-03',
  'realm-04',
  'realm-05',
  'realm-06',
];

export const Realms: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  // Refs for direct GSAP updates during pinned scroll
  const spineProgressRef = useRef<HTMLDivElement>(null);
  const ringCircleRefs = useRef<Array<SVGCircleElement | null>>([]);
  const discWrapperRef = useRef<HTMLDivElement>(null);
  const counterStripRef = useRef<HTMLSpanElement>(null);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const descRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const spineTextRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState<number>(0);
  const activeStepRef = useRef<number>(0);

  const items = CONTENT.realms.items;

  // Apply visual updates directly to cached DOM/SVG refs via GSAP for 60fps performance
  const applyVisualStep = useCallback((step: number, immediate = false) => {
    const isFinalBeat = step === 9;
    const realmIndex = Math.min(8, step);
    const realmNumber = realmIndex + 1;
    const duration = immediate ? 0 : 0.55;

    if (spineProgressRef.current) {
      gsap.to(spineProgressRef.current, {
        scaleY: Math.min(1, realmIndex / 8),
        duration,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }

    spineTextRefs.current.forEach((span, idx) => {
      if (!span) return;
      const isRowActive = idx === realmIndex && !isFinalBeat;
      gsap.to(span, {
        opacity: isRowActive ? 1 : 0.38,
        scale: isRowActive ? 1.04 : 1,
        duration,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    });

    ringCircleRefs.current.forEach((circle, idx) => {
      if (!circle) return;
      const ringNum = idx + 1;
      const isSolid = ringNum <= 6;
      const visible = isFinalBeat ? ringNum === 5 : ringNum <= realmNumber;
      const targetOpacity = visible
        ? isFinalBeat
          ? 0.45
          : isSolid
          ? 0.22
          : 0.28
        : 0.04;
      const targetScale = visible ? 1 : 0.96;

      gsap.to(circle, {
        opacity: targetOpacity,
        scale: targetScale,
        svgOrigin: '200 200',
        duration,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    });

    if (discWrapperRef.current) {
      const discScale = isFinalBeat
        ? 0.24
        : (38 + (realmIndex / 8) * 40) / 78;
      gsap.to(discWrapperRef.current, {
        scale: discScale,
        duration: immediate ? 0 : 0.65,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }

    if (counterStripRef.current) {
      gsap.to(counterStripRef.current, {
        y: -realmIndex * 18,
        duration: immediate ? 0 : 0.45,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }

    titleRefs.current.forEach((titleEl, idx) => {
      if (!titleEl) return;
      const isCurrent = idx === step;
      const isBefore = idx < step;
      const yPercent = isCurrent ? 0 : isBefore ? -110 : 110;

      gsap.to(titleEl, {
        yPercent,
        opacity: isCurrent ? 1 : 0,
        duration: immediate ? 0 : 0.65,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    });

    descRefs.current.forEach((descEl, idx) => {
      if (!descEl) return;
      const isCurrent = idx === step;
      gsap.to(descEl, {
        opacity: isCurrent ? 1 : 0,
        y: isCurrent ? 0 : 6,
        duration: immediate ? 0 : 0.45,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    });
  }, []);

  // Pinned ScrollTrigger on both Desktop (450vh) and Mobile/Tablet (280vh)
  useEffect(() => {
    if (reducedMotion) return undefined;
    const stage = pinStageRef.current;
    if (!stage) return undefined;

    applyVisualStep(activeStepRef.current, true);

    const mm = gsap.matchMedia();

    const createRealmPin = (scrollLength: string) => {
      const st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: scrollLength,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        fastScrollEnd: true,
        onUpdate: (self) => {
          const p = self.progress;
          const nextStep =
            p >= 0.91 ? 9 : Math.min(8, Math.max(0, Math.floor((p / 0.91) * 9)));

          if (nextStep !== activeStepRef.current) {
            activeStepRef.current = nextStep;
            applyVisualStep(nextStep, false);
            setActiveStep(nextStep);
          }
        },
      });

      stRef.current = st;
    };

    mm.add('(min-width: 1024px)', () => {
      createRealmPin('+=450%');
    });

    mm.add('(max-width: 1023px)', () => {
      createRealmPin('+=260%');
    });

    return () => {
      stRef.current = null;
      mm.revert();
    };
  }, [reducedMotion, applyVisualStep]);

  const scrollToRealmIndex = (index: number) => {
    const st = stRef.current;
    if (!reducedMotion && st) {
      const targetProgress = ((index + 0.45) / 9) * 0.91;
      const targetY = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      return;
    }

    activeStepRef.current = index;
    applyVisualStep(index, false);
    setActiveStep(index);
  };

  const activeRealmIndex = Math.min(8, activeStep);
  const isFinalBeat = activeStep === 9;
  const currentRealm = items[activeRealmIndex];
  const isEmptyCenter = activeRealmIndex === 8 && !isFinalBeat;

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.realms}
      aria-label="The Nine Realms"
      className="relative w-full bg-paper text-ink border-t border-line"
    >
      {/* Accessible ordered list in DOM for screen readers */}
      <ol className="sr-only">
        {items.map((realm) => (
          <li key={realm.number}>
            {realm.number} {realm.name}: {realm.description}
          </li>
        ))}
        <li>
          {CONTENT.realms.finalBeatTitle}: {CONTENT.realms.finalBeatMarks}
        </li>
      </ol>

      {/* Section Intro */}
      <div
        style={{
          paddingTop: 'clamp(96px, 12vw, 180px)',
          paddingBottom: '32px',
        }}
      >
        <Container>
          <div className="max-w-[880px]">
            <Eyebrow>{CONTENT.realms.eyebrow}</Eyebrow>
            <div className="mt-4">
              <SplitHeading
                as="h2"
                text={CONTENT.realms.heading}
                className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
              />
            </div>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-[54ch] text-lead text-ink-soft">
                {CONTENT.realms.lead}
              </p>
            </Reveal>
          </div>
        </Container>
      </div>

      {reducedMotion ? (
        /* Reduced Motion static list */
        <div className="pb-24">
          <Container>
            <div className="border-t border-line">
              {items.map((item) => (
                <div
                  key={item.number}
                  className="grid grid-cols-1 gap-2.5 border-b border-line py-6 md:grid-cols-12 md:items-baseline md:gap-8"
                >
                  <div className="flex items-center gap-3.5 md:col-span-5">
                    <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink-soft tabular-nums">
                      {item.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-ember shrink-0"
                    />
                    <h3
                      className={`font-sans font-medium uppercase tracking-[0.14em] ${
                        item.known ? 'text-ink' : 'unknown-realm-text'
                      }`}
                      style={{ fontSize: 'clamp(1.25rem, 0.95rem + 1vw, 1.65rem)' }}
                    >
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-body text-ink-soft md:col-span-7">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      ) : (
        /* Pinned Interactive Stage (Desktop 2-column spine + Mobile/Tablet 1-column stage) */
        <div
          ref={pinStageRef}
          className="relative flex h-[100svh] w-full flex-col justify-center overflow-hidden py-4 lg:py-10"
        >
          <Container className="h-full flex flex-col justify-between">
            <div className="my-auto grid grid-cols-1 items-center gap-5 lg:grid-cols-12 lg:gap-12">
              {/* LEFT COLUMN (Desktop Spine — col-span-5) */}
              <div className="hidden lg:flex lg:col-span-5 flex-col">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[38px] top-5 bottom-5 w-[1.5px] bg-line"
                  >
                    <div
                      ref={spineProgressRef}
                      className="h-full w-full bg-ember origin-top"
                    />
                  </div>

                  {items.map((item, idx) => {
                    const isPassed = idx < activeRealmIndex || isFinalBeat;
                    const isActive = idx === activeRealmIndex && !isFinalBeat;
                    const isUnknown = !item.known;

                    return (
                      <button
                        key={item.number}
                        type="button"
                        onClick={() => scrollToRealmIndex(idx)}
                        aria-current={isActive ? 'step' : undefined}
                        className="group relative flex w-full items-center gap-5 border-b border-line py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-violet-deep"
                      >
                        <span className="w-6 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft tabular-nums shrink-0">
                          {item.number}
                        </span>

                        <span className="relative z-10 flex h-5 w-5 items-center justify-center shrink-0">
                          {isActive ? (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-ink bg-paper">
                              <span className="h-2 w-2 rounded-full bg-ember block" />
                            </span>
                          ) : isPassed ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-ink block" />
                          ) : (
                            <span className="h-2 w-2 rotate-45 border border-ink/40 bg-paper block" />
                          )}
                        </span>

                        <span
                          ref={(el) => {
                            spineTextRefs.current[idx] = el;
                          }}
                          className={`font-sans font-medium uppercase tracking-[0.16em] origin-left ${
                            isUnknown ? 'unknown-realm-text' : 'text-ink'
                          } ${isUnknown && isActive ? 'blur-[1.2px]' : ''}`}
                          style={{
                            fontSize: 'clamp(1.05rem, 0.85rem + 0.55vw, 1.5rem)',
                          }}
                        >
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                  {CONTENT.realms.footnote}
                </p>
              </div>

              {/* RIGHT COLUMN (Stage + Sliding Title + Mechanical Counter — col-span-7) */}
              <div className="lg:col-span-7 flex flex-col items-center lg:items-stretch justify-between gap-4 lg:gap-6">
                {/* Square Stage with concentric SVG rings, growing circular mask, and mechanical counter */}
                <div className="order-1 lg:order-2 relative mx-auto aspect-square w-[64vw] max-w-[300px] sm:max-w-[380px] lg:max-w-[480px] xl:max-w-[520px] flex items-center justify-center">
                  <svg
                    viewBox="0 0 400 400"
                    fill="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full text-ink"
                  >
                    {RING_RADII.map((r, idx) => {
                      const ringNum = idx + 1;
                      const isSolid = ringNum <= 6;
                      return (
                        <circle
                          key={ringNum}
                          ref={(el) => {
                            ringCircleRefs.current[idx] = el;
                          }}
                          cx="200"
                          cy="200"
                          r={r}
                          stroke="currentColor"
                          strokeWidth="1.15"
                          strokeDasharray={isSolid ? undefined : '5 5'}
                        />
                      );
                    })}
                  </svg>

                  <div
                    ref={discWrapperRef}
                    className="relative z-10 h-[78%] w-[78%] rounded-full overflow-hidden"
                  >
                    {isFinalBeat ? (
                      <div className="flex h-full w-full items-center justify-center rounded-full border border-violet-deep/40 bg-paper">
                        <span className="font-mono text-[18px] tracking-[0.18em] text-violet-deep">
                          {CONTENT.realms.finalBeatMarks}
                        </span>
                      </div>
                    ) : isEmptyCenter ? (
                      <div className="flex h-full w-full items-center justify-center rounded-full border border-ink/25 bg-paper">
                        <div className="h-6 w-6 rounded-full border border-ink/30 bg-paper" />
                      </div>
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-ink">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center bg-ink"
                        >
                          <span className="h-3.5 w-3.5 rounded-full bg-ember block" />
                        </div>

                        {KNOWN_REALM_KEYS.map((mKey) => {
                          const entry = MEDIA[mKey];
                          const isCurrentImg = currentRealm.mediaKey === mKey;
                          const isLoaded = Boolean(loadedMap[mKey]);

                          return (
                            <img
                              key={mKey}
                              src={entry.src}
                              alt={entry.alt}
                              loading="lazy"
                              decoding="async"
                              onLoad={() =>
                                setLoadedMap((prev) => ({ ...prev, [mKey]: true }))
                              }
                              onError={() =>
                                setLoadedMap((prev) => ({ ...prev, [mKey]: false }))
                              }
                              style={{ objectPosition: entry.focal }}
                              className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${
                                isCurrentImg && isLoaded ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bottom-right mechanical rolling digit counter */}
                  <div
                    aria-label={`Realm ${activeRealmIndex + 1} of 9`}
                    className="absolute right-0 bottom-0 z-20 flex items-center gap-1.5 rounded-full border border-line bg-paper/90 px-3.5 py-1.5 font-mono text-[13px] uppercase tracking-[0.14em] text-ink tabular-nums"
                  >
                    <span className="relative h-[18px] w-[22px] overflow-hidden inline-block">
                      <span
                        ref={counterStripRef}
                        className="flex flex-col"
                      >
                        {items.map((it) => (
                          <span
                            key={it.number}
                            className="h-[18px] leading-[18px] block text-center"
                          >
                            {it.number}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="text-ink-soft">/ 09</span>
                  </div>
                </div>

                {/* Title & Description block */}
                <div className="order-2 lg:order-1 w-full text-center lg:text-left min-h-[104px] sm:min-h-[120px] flex flex-col justify-end">
                  <div className="relative h-[44px] sm:h-[60px] overflow-hidden">
                    {items.map((item, idx) => (
                      <h3
                        key={item.number}
                        ref={(el) => {
                          titleRefs.current[idx] = el;
                        }}
                        aria-hidden={activeStep !== idx}
                        className={`absolute inset-x-0 bottom-0 font-sans font-medium tracking-[-0.035em] ${
                          item.known ? 'text-ink' : 'text-taupe-deep'
                        } ${!item.known && activeStep === idx ? 'blur-[1px]' : ''}`}
                        style={{
                          fontSize: 'clamp(1.75rem, 1rem + 2.8vw, 4rem)',
                          lineHeight: 1.06,
                        }}
                      >
                        {item.name}
                      </h3>
                    ))}

                    <h3
                      ref={(el) => {
                        titleRefs.current[9] = el;
                      }}
                      aria-hidden={!isFinalBeat}
                      className="absolute inset-x-0 bottom-0 font-sans font-medium tracking-[-0.035em] text-ink"
                      style={{
                        fontSize: 'clamp(1.75rem, 1rem + 2.8vw, 4rem)',
                        lineHeight: 1.06,
                      }}
                    >
                      {CONTENT.realms.finalBeatTitle}
                    </h3>
                  </div>

                  <div className="relative mt-2 min-h-[48px]">
                    {items.map((item, idx) => (
                      <p
                        key={item.number}
                        ref={(el) => {
                          descRefs.current[idx] = el;
                        }}
                        aria-hidden={activeStep !== idx}
                        className={`inset-x-0 top-0 text-body text-ink-soft ${
                          idx === 0 ? 'relative' : 'absolute'
                        } ${
                          activeStep === idx
                            ? 'pointer-events-auto'
                            : 'pointer-events-none'
                        }`}
                      >
                        {item.description}
                      </p>
                    ))}

                    <p
                      ref={(el) => {
                        descRefs.current[9] = el;
                      }}
                      aria-hidden={!isFinalBeat}
                      className="pointer-events-none absolute inset-x-0 top-0 font-mono text-[20px] sm:text-[24px] tracking-[0.25em] text-violet-deep"
                    >
                      {CONTENT.realms.finalBeatMarks}
                    </p>
                  </div>
                </div>

                {/* Mobile/Tablet 9-dot progress strip */}
                <div
                  role="group"
                  aria-label="Select realm"
                  className="order-3 flex lg:hidden items-center justify-center gap-2 pt-2"
                >
                  {items.map((item, idx) => {
                    const isDotActive = idx === activeRealmIndex && !isFinalBeat;
                    const isDotPassed = idx < activeRealmIndex || isFinalBeat;
                    return (
                      <button
                        key={item.number}
                        type="button"
                        onClick={() => scrollToRealmIndex(idx)}
                        aria-label={`Realm ${item.number}: ${item.name}`}
                        aria-current={isDotActive ? 'step' : undefined}
                        className="inline-flex h-7 w-6 items-center justify-center"
                      >
                        <span
                          className={`rounded-full transition-all duration-300 ${
                            isDotActive
                              ? 'h-2.5 w-2.5 bg-ember scale-125'
                              : isDotPassed
                              ? 'h-2 w-2 bg-ink'
                              : 'h-2 w-2 bg-ink/25'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </section>
  );
};
