import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { MEDIA, type MediaKey } from '../config/media';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT } from '../content/site';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useMediaQuery, usePrefersReducedMotion } from '../lib/hooks';
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
  const isDesktopPin = useMediaQuery(
    '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
  );
  const usePinnedDesktop = isDesktopPin && !reducedMotion;

  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  // Refs for direct, zero-re-render GSAP updates during desktop pin scroll
  const spineProgressRef = useRef<HTMLDivElement>(null);
  const ringCircleRefs = useRef<Array<SVGCircleElement | null>>([]);
  const discWrapperRef = useRef<HTMLDivElement>(null);
  const counterStripRef = useRef<HTMLSpanElement>(null);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const descRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const spineTextRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Mobile interactive / scroll-tracked state
  const mobileRowRefs = useRef<Array<HTMLDivElement | null>>([]);
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

  // Desktop pinned ScrollTrigger
  useEffect(() => {
    if (!usePinnedDesktop) return undefined;
    const stage = pinStageRef.current;
    if (!stage) return undefined;

    applyVisualStep(activeStepRef.current, true);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (hover: hover) and (pointer: fine)', () => {
      const st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: '+=720%',
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
    });

    return () => {
      stRef.current = null;
      mm.revert();
    };
  }, [usePinnedDesktop, applyVisualStep]);

  // Mobile/Touch: observe realm rows as user scrolls naturally so nothing locks touch scrolling
  useEffect(() => {
    if (usePinnedDesktop || reducedMotion) return undefined;
    const rows = mobileRowRefs.current.filter((r): r is HTMLDivElement => r !== null);
    if (rows.length === 0) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-realm-index') || '0');
            activeStepRef.current = idx;
            setActiveStep(idx);
          }
        });
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 }
    );

    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [usePinnedDesktop, reducedMotion]);

  const scrollToRealmIndex = (index: number) => {
    const st = stRef.current;
    if (usePinnedDesktop && st) {
      const targetProgress = ((index + 0.45) / 9) * 0.91;
      const targetY = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      return;
    }

    activeStepRef.current = index;
    setActiveStep(index);
    const rowEl = mobileRowRefs.current[index];
    if (rowEl) {
      const y = rowEl.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const activeRealmIndex = Math.min(8, activeStep);
  const isFinalBeat = activeStep === 9;
  const currentRealm = items[activeRealmIndex];
  const isEmptyCenter = activeRealmIndex === 8 && !isFinalBeat;
  const mobileDiscScale = (38 + (activeRealmIndex / 8) * 40) / 78;

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
          paddingBottom: usePinnedDesktop ? '32px' : '48px',
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

      {!usePinnedDesktop ? (
        /* Mobile, Tablet & Reduced Motion: Smooth natural scroll with interactive ring stage + numbered dot strip */
        <div className="pb-24">
          <Container>
            {/* Interactive Concentric Ring Stage */}
            <div className="mx-auto mb-8 relative aspect-square w-[74vw] max-w-[320px] flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full text-ink"
              >
                {RING_RADII.map((r, idx) => {
                  const ringNum = idx + 1;
                  const isSolid = ringNum <= 6;
                  const visible = reducedMotion ? true : ringNum <= activeRealmIndex + 1;
                  return (
                    <circle
                      key={r}
                      cx="200"
                      cy="200"
                      r={r}
                      stroke="currentColor"
                      strokeWidth="1.15"
                      strokeDasharray={isSolid ? undefined : '5 5'}
                      className="transition-opacity duration-500"
                      style={{
                        opacity: visible ? (isSolid ? 0.22 : 0.28) : 0.05,
                      }}
                    />
                  );
                })}
              </svg>

              <div
                className="relative z-10 h-[78%] w-[78%] rounded-full overflow-hidden transition-transform duration-500 ease-expo-out"
                style={{
                  transform: `scale(${reducedMotion ? 0.65 : mobileDiscScale})`,
                }}
              >
                {activeRealmIndex === 8 ? (
                  <div className="flex h-full w-full items-center justify-center rounded-full border border-ink/25 bg-paper">
                    <div className="h-6 w-6 rounded-full border border-ink/30 bg-paper" />
                  </div>
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-ink">
                    <span className="h-3.5 w-3.5 rounded-full bg-ember block" />
                  </div>
                )}
              </div>

              <div className="absolute right-0 bottom-0 z-20 rounded-full border border-line bg-paper/90 px-3 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink tabular-nums">
                {items[activeRealmIndex].number} / 09
              </div>
            </div>

            {/* Interactive 01-09 dot strip */}
            <div
              role="group"
              aria-label="Select realm"
              className="mb-10 flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap"
            >
              {items.map((item, idx) => {
                const isActive = idx === activeRealmIndex;
                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => scrollToRealmIndex(idx)}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`Realm ${item.number}: ${item.name}`}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-[12px] tabular-nums transition-transform ${
                      isActive
                        ? 'border-2 border-ember bg-paper text-ink font-medium scale-110'
                        : 'border border-line bg-paper-2 text-ink-soft'
                    }`}
                  >
                    {item.number}
                  </button>
                );
              })}
            </div>

            {/* Naturally scrolling realm rows */}
            <div className="border-t border-line">
              {items.map((item, idx) => {
                const isRowActive = idx === activeRealmIndex;
                return (
                  <div
                    key={item.number}
                    ref={(el) => {
                      mobileRowRefs.current[idx] = el;
                    }}
                    data-realm-index={idx}
                    className={`grid grid-cols-1 gap-2.5 border-b border-line py-6 transition-opacity duration-300 md:grid-cols-12 md:items-baseline md:gap-8 ${
                      isRowActive ? 'opacity-100' : 'opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 md:col-span-5">
                      <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink-soft tabular-nums">
                        {item.number}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          isRowActive ? 'bg-ember' : 'bg-ink/25'
                        }`}
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
                );
              })}

              {/* Final beat row */}
              <div className="mt-6 flex items-center justify-between rounded-[22px] border border-line bg-paper-2 px-6 py-5">
                <span className="font-sans text-[22px] font-medium tracking-[-0.02em] text-ink">
                  {CONTENT.realms.finalBeatTitle}
                </span>
                <span className="font-mono text-[20px] tracking-[0.2em] text-violet-deep">
                  {CONTENT.realms.finalBeatMarks}
                </span>
              </div>
            </div>

            <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
              {CONTENT.realms.footnote}
            </p>
          </Container>
        </div>
      ) : (
        /* Desktop Pinned Interactive Stage */
        <div
          ref={pinStageRef}
          className="relative flex h-[100svh] w-full flex-col justify-center overflow-hidden py-6 lg:py-10"
        >
          <Container className="h-full flex flex-col justify-between">
            <div className="my-auto grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
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
                      style={{ transform: 'scaleY(0)' }}
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
                            opacity: idx === 0 ? 1 : 0.38,
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
                <div className="w-full text-center lg:text-left min-h-[108px] sm:min-h-[124px] flex flex-col justify-end">
                  <div className="relative h-[48px] sm:h-[64px] overflow-hidden">
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
                          fontSize: 'clamp(2.2rem, 1rem + 3vw, 4.2rem)',
                          lineHeight: 1.04,
                          opacity: idx === 0 ? 1 : 0,
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
                        fontSize: 'clamp(2.2rem, 1rem + 3vw, 4.2rem)',
                        lineHeight: 1.04,
                        opacity: 0,
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
                        className="inset-x-0 top-0 text-body text-ink-soft"
                        style={{
                          position: idx === 0 ? 'relative' : 'absolute',
                          opacity: idx === 0 ? 1 : 0,
                          pointerEvents: activeStep === idx ? 'auto' : 'none',
                        }}
                      >
                        {item.description}
                      </p>
                    ))}

                    <p
                      ref={(el) => {
                        descRefs.current[9] = el;
                      }}
                      aria-hidden={!isFinalBeat}
                      className="absolute inset-x-0 top-0 font-mono text-[20px] sm:text-[24px] tracking-[0.25em] text-violet-deep"
                      style={{ opacity: 0 }}
                    >
                      {CONTENT.realms.finalBeatMarks}
                    </p>
                  </div>
                </div>

                {/* Square Stage with concentric SVG rings, growing circular mask, and mechanical counter */}
                <div className="relative mx-auto aspect-square w-[74vw] max-w-[340px] sm:max-w-[420px] lg:max-w-[500px] xl:max-w-[540px] flex items-center justify-center">
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
                          style={{ opacity: idx === 0 ? 0.22 : 0.04 }}
                        />
                      );
                    })}
                  </svg>

                  <div
                    ref={discWrapperRef}
                    className="relative z-10 h-[78%] w-[78%] rounded-full overflow-hidden"
                    style={{ transform: 'scale(0.487)' }}
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
                        style={{ transform: 'translateY(0px)' }}
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
              </div>
            </div>
          </Container>
        </div>
      )}
    </section>
  );
};
