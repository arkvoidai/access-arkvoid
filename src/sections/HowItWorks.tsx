import React, { useEffect, useRef, useState } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Media } from '../components/ui/Media';
import { MEDIA } from '../config/media';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT, type HowIdeaContent } from '../content/site';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

const PhoneTabBar: React.FC<{ activeTab?: 'home' | 'people' | 'journal' | 'map' }> = ({
  activeTab = 'people',
}) => {
  const tabs: Array<{ id: 'home' | 'people' | 'journal' | 'map'; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'people', label: 'People' },
    { id: 'journal', label: 'Journal' },
    { id: 'map', label: 'Map' },
  ];

  const renderIcon = (id: 'home' | 'people' | 'journal' | 'map') => {
    if (id === 'home') {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2.5 7L8 2.5L13.5 7V13C13.5 13.28 13.28 13.5 13 13.5H3C2.72 13.5 2.5 13.28 2.5 13V7Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    if (id === 'people') {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M3.5 13.5C3.5 11.29 5.51 9.5 8 9.5C10.49 9.5 12.5 11.29 12.5 13.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    if (id === 'journal') {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect
            x="3.5"
            y="2.5"
            width="9"
            height="11"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M6 6H10M6 8.5H10M6 11H8.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M2.5 4L6 2.5L10 4L13.5 2.5V12L10 13.5L6 12L2.5 13.5V4Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div
      aria-hidden="true"
      className="mt-auto flex items-center justify-around rounded-full border border-line bg-paper px-3 py-2"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <span
            key={tab.id}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
              isActive ? 'bg-ink text-paper' : 'text-ink-soft'
            }`}
          >
            {renderIcon(tab.id)}
          </span>
        );
      })}
    </div>
  );
};

const PortraitAvatar: React.FC<{ initial: string }> = ({ initial }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const entry = MEDIA['character-01'];

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-line bg-paper-2 flex items-center justify-center">
      {!loaded && (
        <span className="font-mono text-[13px] font-medium uppercase text-ink select-none">
          {initial}
        </span>
      )}
      <img
        src={entry.src}
        alt={entry.alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        style={{ objectPosition: '50% 25%' }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

const PhoneShell: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style }) => {
  return (
    <div
      style={style}
      className={`relative mx-auto w-[78vw] max-w-[320px] lg:w-[340px] lg:max-w-[340px] rounded-[44px] border-[10px] border-ink bg-paper shadow-soft overflow-hidden ${className}`}
    >
      {/* Dynamic island pill */}
      <div className="pt-2.5 pb-2 flex justify-center bg-paper">
        <span
          aria-hidden="true"
          className="h-4 w-20 rounded-full bg-ink block"
        />
      </div>

      <div className="flex min-h-[450px] sm:min-h-[480px] flex-col justify-between p-4 bg-paper-2/60">
        {children}
      </div>
    </div>
  );
};

const IdeaIllustration: React.FC<{ type: HowIdeaContent['illustration'] }> = ({
  type,
}) => {
  if (type === 'ledger') {
    return (
      <svg
        width="64"
        height="48"
        viewBox="0 0 64 48"
        fill="none"
        aria-hidden="true"
        className="text-ink"
      >
        <line x1="6" y1="12" x2="46" y2="12" stroke="currentColor" strokeWidth="1.6" />
        <line x1="6" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="1.6" />
        <line x1="6" y1="36" x2="36" y2="36" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M44 35L48 39L57 30"
          stroke="var(--ember)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'gate') {
    return (
      <svg
        width="64"
        height="48"
        viewBox="0 0 64 48"
        fill="none"
        aria-hidden="true"
        className="text-ink"
      >
        <circle cx="12" cy="18" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M6 34C6 29.58 8.69 26 12 26C15.31 26 18 29.58 18 34"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M22 24H34M34 24L30 20M34 24L30 28"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 38V18C40 12.48 44.48 8 50 8C55.52 8 60 12.48 60 18V38"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M46 25L49 28L55 21"
          stroke="var(--ember)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="64"
      height="48"
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden="true"
      className="text-ink"
    >
      <circle
        cx="32"
        cy="24"
        r="20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="3 3"
      />
      <circle
        cx="32"
        cy="24"
        r="13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="3 3"
      />
      <circle cx="32" cy="24" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="32" cy="24" r="2.5" fill="var(--ember)" />
    </svg>
  );
};

export const HowItWorks: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();

  const pinStageRef = useRef<HTMLDivElement>(null);
  const phoneRotateRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const trioRef = useRef<HTMLDivElement>(null);

  const [activeScene, setActiveScene] = useState<number>(0);
  const activeSceneRef = useRef<number>(0);
  const [awayRowProgress, setAwayRowProgress] = useState<number>(3);

  const scenes = CONTENT.how.scenes;

  // B1: Pinned 3-scene story on both desktop (280vh) and mobile/tablet (200vh)
  useEffect(() => {
    if (reducedMotion) return undefined;
    const stage = pinStageRef.current;
    if (!stage) return undefined;

    const mm = gsap.matchMedia();

    const buildStoryPin = (scrollLength: string, withTilt: boolean) => {
      if (!withTilt && phoneRotateRef.current) {
        gsap.set(phoneRotateRef.current, { rotateY: 0 });
      }

      const st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: scrollLength,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const nextScene = Math.min(2, Math.max(0, Math.floor(self.progress * 3)));
          if (nextScene !== activeSceneRef.current) {
            activeSceneRef.current = nextScene;
            setActiveScene(nextScene);
          }

          if (nextScene === 1) {
            const localP = (self.progress - 0.333) / 0.333;
            const visibleRows = Math.min(3, Math.max(1, Math.ceil(localP * 3)));
            setAwayRowProgress(visibleRows);
          } else if (nextScene > 1) {
            setAwayRowProgress(3);
          }

          if (withTilt && phoneRotateRef.current) {
            const rotY = -6 + self.progress * 12;
            gsap.set(phoneRotateRef.current, {
              rotateY: rotY,
              transformPerspective: 1100,
            });
          }
        },
      });

      stRef.current = st;
    };

    mm.add('(min-width: 1024px)', () => {
      buildStoryPin('+=280%', true);
    });

    mm.add('(max-width: 1023px)', () => {
      buildStoryPin('+=200%', false);
    });

    return () => {
      stRef.current = null;
      mm.revert();
    };
  }, [reducedMotion]);

  // B3: Concept screens trio parallax on desktop
  useEffect(() => {
    if (reducedMotion || !trioRef.current) return undefined;
    const container = trioRef.current;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const outerLeft = container.querySelector('.trio-phone-0');
      const outerRight = container.querySelector('.trio-phone-2');

      if (outerLeft && outerRight) {
        gsap.fromTo(
          outerLeft,
          { yPercent: 4 },
          {
            yPercent: -4,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );

        gsap.fromTo(
          outerRight,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );
      }
    });

    return () => mm.revert();
  }, [reducedMotion]);

  const handleStepClick = (index: number) => {
    const st = stRef.current;
    if (!st) {
      setActiveScene(index);
      setAwayRowProgress(3);
      return;
    }
    const targetProgress = (index + 0.4) / 3;
    const targetY = st.start + (st.end - st.start) * targetProgress;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section
      id={SECTION_IDS.how}
      aria-label="How it works"
      className="relative w-full bg-[#FFFFFF] text-ink border-t border-line"
    >
      {/* Screen-reader ordered list exposing all 3 scenes */}
      <ol className="sr-only">
        {scenes.map((sc) => (
          <li key={sc.stepNumber}>
            {sc.dayLabel} — {sc.title}: {sc.body}
          </li>
        ))}
      </ol>

      {/* Header */}
      <div
        style={{
          paddingTop: 'clamp(96px, 14vw, 200px)',
          paddingBottom: '32px',
        }}
      >
        <Container>
          <div className="max-w-[860px]">
            <Eyebrow>{CONTENT.how.eyebrow}</Eyebrow>
            <div className="mt-4">
              <SplitHeading
                as="h2"
                text={CONTENT.how.heading}
                className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
              />
            </div>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-[52ch] text-lead text-ink-soft">
                {CONTENT.how.lead}
              </p>
            </Reveal>
          </div>
        </Container>
      </div>

      {/* B1. THE RETURN — Pinned Three-Scene Story */}
      <div
        ref={pinStageRef}
        className={`relative w-full ${
          reducedMotion
            ? 'py-12'
            : 'flex min-h-[100svh] flex-col justify-center overflow-hidden py-8 lg:py-12'
        }`}
      >
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left on desktop, second on mobile: Step progress + Scene Text */}
            <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col gap-8">
              {/* Step buttons with vertical ember progress bar */}
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="relative h-12 w-[2px] bg-line overflow-hidden"
                >
                  <div
                    className="h-full w-full bg-ember origin-top transition-transform duration-500 ease-expo-out"
                    style={{
                      transform: `scaleY(${(activeScene + 1) / 3})`,
                    }}
                  />
                </div>

                <div
                  role="group"
                  aria-label="Story scenes"
                  className="flex flex-wrap items-center gap-2"
                >
                  {scenes.map((sc, idx) => {
                    const isCurrent = idx === activeScene;
                    return (
                      <button
                        key={sc.stepNumber}
                        type="button"
                        onClick={() => handleStepClick(idx)}
                        aria-current={isCurrent ? 'step' : undefined}
                        className={`rounded-full px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors ${
                          isCurrent
                            ? 'bg-ink text-paper'
                            : 'border border-line bg-paper text-ink-soft hover:border-ink'
                        }`}
                      >
                        {sc.stepShort}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scene copy stack (all in DOM, switched via transform and opacity) */}
              <div className="relative min-h-[210px] sm:min-h-[230px]">
                {scenes.map((sc, idx) => {
                  const isCurrent = idx === activeScene;
                  return (
                    <div
                      key={sc.stepNumber}
                      aria-hidden={!isCurrent}
                      className="inset-0 flex flex-col gap-4 transition-all duration-500 ease-expo-out"
                      style={{
                        position: idx === 0 ? 'relative' : 'absolute',
                        opacity: isCurrent ? 1 : 0,
                        transform: `translateY(${isCurrent ? '0px' : '20px'})`,
                        pointerEvents: isCurrent ? 'auto' : 'none',
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ember-deep">
                          {sc.dayLabel}
                        </span>
                        {sc.subLabel && (
                          <span className="rounded-full border border-line bg-paper px-3 py-0.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                            {sc.subLabel}
                          </span>
                        )}
                      </div>

                      <h3 className="font-sans text-h3 font-medium tracking-[-0.03em] text-ink">
                        {sc.title}
                      </h3>

                      <p className="max-w-[48ch] text-body text-ink-soft">
                        {sc.body}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                {CONTENT.how.footnote}
              </p>
            </div>

            {/* Right on desktop, first on mobile: CSS Phone with 3-Scene Screen */}
            <div className="order-1 lg:order-2 lg:col-span-6 flex justify-center">
              <div ref={phoneRotateRef} className="w-full flex justify-center">
                <PhoneShell>
                  <div className="relative flex-1">
                    {/* PHONE SCENE 1 — Conversation & Promise Saved */}
                    <div
                      aria-hidden={activeScene !== 0}
                      className="inset-0 flex flex-col gap-3 transition-all duration-500 ease-expo-out"
                      style={{
                        position: 'relative',
                        opacity: activeScene === 0 ? 1 : 0,
                        transform: `translateY(${activeScene === 0 ? '0px' : '-16px'})`,
                        pointerEvents: activeScene === 0 ? 'auto' : 'none',
                      }}
                    >
                      <div className="rounded-[24px] border border-line bg-[#FFFFFF] p-4 shadow-soft">
                        <div className="flex items-center gap-3 border-b border-line pb-3">
                          <PortraitAvatar initial="S" />
                          <div>
                            <div className="text-[15px] font-medium text-ink">
                              {CONTENT.how.chatScene1.speakerName}
                            </div>
                            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                              {CONTENT.how.chatScene1.speakerRole}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3.5 flex flex-col gap-2.5">
                          <div className="rounded-[18px] rounded-tl-sm bg-paper-2 p-3 text-[15px] leading-[1.4] text-ink">
                            “{CONTENT.how.chatScene1.serenLine}”
                          </div>
                          <div className="self-end rounded-[18px] rounded-tr-sm bg-ink p-3 text-[15px] leading-[1.4] text-paper">
                            “{CONTENT.how.chatScene1.youLine}”
                          </div>
                        </div>

                        <div className="mt-3.5 flex items-center justify-between pt-2">
                          <span className="inline-flex items-center gap-2 rounded-full bg-ember-wash px-3 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink">
                            <span className="h-1.5 w-1.5 rounded-full bg-ember block" />
                            {CONTENT.how.chatScene1.chip}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PHONE SCENE 2 — While you were away Journal */}
                    <div
                      aria-hidden={activeScene !== 1}
                      className="absolute inset-0 flex flex-col gap-3 transition-all duration-500 ease-expo-out"
                      style={{
                        opacity: activeScene === 1 ? 1 : 0,
                        transform: `translateY(${activeScene === 1 ? '0px' : '16px'})`,
                        pointerEvents: activeScene === 1 ? 'auto' : 'none',
                      }}
                    >
                      <div className="rounded-[24px] border border-line bg-[#FFFFFF] p-4 shadow-soft">
                        <div className="mb-3 flex items-center justify-between border-b border-line pb-2.5">
                          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink font-medium">
                            {CONTENT.how.awayJournal.header}
                          </span>
                          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                            3 events
                          </span>
                        </div>

                        <div className="relative pl-4">
                          {/* Drawing vertical timeline connector */}
                          <div
                            aria-hidden="true"
                            className="absolute left-1 top-2 bottom-2 w-[1.5px] bg-ember origin-top transition-transform duration-500 ease-expo-out"
                            style={{
                              transform: `scaleY(${awayRowProgress / 3})`,
                            }}
                          />

                          <div className="flex flex-col gap-3.5">
                            {CONTENT.how.awayJournal.entries.map((entry, idx) => {
                              const visible = idx < awayRowProgress;
                              return (
                                <div
                                  key={entry.time}
                                  className="transition-all duration-500 ease-expo-out"
                                  style={{
                                    opacity: visible ? 1 : 0.15,
                                    transform: `translateY(${visible ? '0px' : '8px'})`,
                                  }}
                                >
                                  <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                                    {entry.time}
                                  </div>
                                  <div className="mt-0.5 text-[15px] leading-[1.38] text-ink">
                                    {entry.event}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PHONE SCENE 3 — Return & Traceable Source Chips */}
                    <div
                      aria-hidden={activeScene !== 2}
                      className="absolute inset-0 flex flex-col gap-3 transition-all duration-500 ease-expo-out"
                      style={{
                        opacity: activeScene === 2 ? 1 : 0,
                        transform: `translateY(${activeScene === 2 ? '0px' : '16px'})`,
                        pointerEvents: activeScene === 2 ? 'auto' : 'none',
                      }}
                    >
                      <div className="rounded-[24px] border border-line bg-[#FFFFFF] p-4 shadow-soft">
                        <div className="flex items-center gap-3 border-b border-line pb-3">
                          <PortraitAvatar initial="S" />
                          <div>
                            <div className="text-[15px] font-medium text-ink">
                              {CONTENT.how.chatScene3.speakerName}
                            </div>
                            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                              {CONTENT.how.chatScene3.speakerRole}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3.5 rounded-[18px] rounded-tl-sm bg-paper-2 p-3.5 text-[15px] leading-[1.42] text-ink">
                          “{CONTENT.how.chatScene3.serenLine}”
                        </div>

                        {/* Traceable Source connector */}
                        <div className="mt-3.5 border-t border-line pt-3">
                          <span className="block font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                            {CONTENT.how.chatScene3.sourceLabel}
                          </span>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-ink">
                              {CONTENT.how.chatScene3.sources[0]}
                            </span>
                            <span
                              aria-hidden="true"
                              className="h-[1px] w-3 bg-ember block"
                            />
                            <span className="rounded-full border border-ember bg-ember-wash/60 px-2.5 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-ink">
                              {CONTENT.how.chatScene3.sources[1]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <PhoneTabBar activeTab={activeScene === 1 ? 'journal' : 'people'} />
                </PhoneShell>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* B2. THREE IDEAS (Normal Flow) */}
      <div
        className="border-t border-line"
        style={{
          paddingTop: 'clamp(80px, 10vw, 160px)',
          paddingBottom: 'clamp(80px, 10vw, 160px)',
        }}
      >
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {CONTENT.how.ideas.map((idea, idx) => (
              <Reveal key={idea.number} delay={idx * 0.12}>
                <article className="flex h-full flex-col justify-between gap-8 rounded-card border border-line bg-[#FFFFFF] p-7 sm:p-9 shadow-soft">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink-soft tabular-nums">
                      {idea.number}
                    </span>
                    <IdeaIllustration type={idea.illustration} />
                  </div>

                  <div>
                    <h3 className="font-sans text-h3 font-medium tracking-[-0.03em] text-ink">
                      {idea.title}
                    </h3>
                    <p className="mt-4 text-body text-ink-soft">{idea.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>

      {/* B3. CONCEPT SCREENS TRIO */}
      <div
        ref={trioRef}
        className="border-t border-line bg-paper/50"
        style={{
          paddingTop: 'clamp(80px, 10vw, 160px)',
          paddingBottom: 'clamp(96px, 14vw, 200px)',
        }}
      >
        <div
          className="no-scrollbar mx-auto flex max-w-[1680px] snap-x snap-mandatory items-start gap-6 overflow-x-auto pb-8 lg:grid lg:grid-cols-3 lg:overflow-visible"
          style={{
            paddingLeft: 'clamp(20px, 4vw, 72px)',
            paddingRight: 'clamp(20px, 4vw, 72px)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {CONTENT.how.trio.screens.map((scr, idx) => (
            <div
              key={scr.id}
              className={`trio-phone-${idx} shrink-0 snap-center flex flex-col items-center ${
                idx === 1 ? 'lg:mt-12' : ''
              }`}
            >
              <span className="mb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                0{idx + 1} · {scr.label}
              </span>

              <PhoneShell>
                {scr.id === 'courtyard' && (
                  <div className="flex flex-col gap-3">
                    <div className="overflow-hidden rounded-[22px] border border-line bg-[#FFFFFF]">
                      <div className="h-36 w-full overflow-hidden">
                        <Media mediaKey="world-courtyard" fill />
                      </div>
                      <div className="p-3.5">
                        <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                          {scr.placeSubtitle}
                        </div>
                        <div className="mt-0.5 text-[17px] font-medium text-ink">
                          {scr.placeTitle}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-line bg-[#FFFFFF] p-3.5">
                      <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                        {scr.nearbyLabel}
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {scr.nearbyPeople.map((person) => (
                          <span
                            key={person}
                            className="rounded-full border border-line bg-paper px-3 py-1 text-[14px] text-ink"
                          >
                            {person}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {scr.id === 'conversation' && (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-[22px] border border-line bg-[#FFFFFF] p-4">
                      <div className="border-b border-line pb-2.5">
                        <div className="text-[16px] font-medium text-ink">
                          {scr.speaker}
                        </div>
                        <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                          {scr.role}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col gap-2">
                        <div className="rounded-[16px] bg-paper-2 p-3 text-[15px] text-ink">
                          “{scr.message}”
                        </div>
                        <div className="self-end rounded-[16px] bg-ink p-3 text-[15px] text-paper">
                          “{scr.reply}”
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                        {scr.memoryChips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full bg-ember-wash px-2.5 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-ink"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {scr.id === 'journal' && (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-[22px] border border-line bg-[#FFFFFF] p-4">
                      <div className="mb-3 border-b border-line pb-2 font-mono text-[12px] uppercase tracking-[0.14em] text-ink">
                        {scr.heading}
                      </div>
                      <div className="flex flex-col gap-3">
                        {scr.items.map((item) => (
                          <div key={item.time} className="border-b border-line/60 pb-2.5 last:border-b-0 last:pb-0">
                            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                              {item.time}
                            </div>
                            <div className="mt-0.5 text-[15px] text-ink">
                              {item.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <PhoneTabBar
                  activeTab={
                    scr.id === 'courtyard'
                      ? 'home'
                      : scr.id === 'conversation'
                      ? 'people'
                      : 'journal'
                  }
                />
              </PhoneShell>
            </div>
          ))}
        </div>

        <Container>
          <p className="mt-6 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
            {CONTENT.how.trio.caption}
          </p>
        </Container>
      </div>
    </section>
  );
};
