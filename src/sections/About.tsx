import React, { useEffect, useRef } from 'react';
import { Container } from '../components/ui/Container';
import { Media } from '../components/ui/Media';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT, type LayerCardContent } from '../content/site';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

const EngineDiagram: React.FC = () => {
  const steps = CONTENT.about.diagramSteps;

  return (
    <div
      aria-label="Engine event record flow"
      className="flex h-full w-full flex-col items-center justify-center rounded-[24px] border border-white/[0.08] bg-ink-2/60 p-6 md:p-8"
    >
      <div className="flex w-full max-w-[360px] flex-col items-center">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const stepNumber = String(index + 1).padStart(2, '0');
          return (
            <React.Fragment key={step.label}>
              <div
                className={`relative flex w-full items-center justify-between gap-4 rounded-[16px] px-4 py-3.5 transition-colors ${
                  step.locked
                    ? 'border border-ember bg-ink text-paper'
                    : 'border border-paper/20 bg-ink/80 text-paper'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-paper/55 tabular-nums">
                    {stepNumber}
                  </span>
                  <span className="text-[16px] font-medium tracking-[-0.01em] text-paper">
                    {step.label}
                  </span>
                </div>

                {step.locked && (
                  <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ember shrink-0">
                    Enforced
                  </span>
                )}
              </div>

              {!isLast && (
                <div
                  aria-hidden="true"
                  className="relative flex h-7 w-4 items-center justify-center overflow-hidden"
                >
                  <span className="h-full w-[1px] bg-paper/25 block" />
                  <span
                    className="diagram-dot-travel absolute top-0 h-1.5 w-1.5 rounded-full bg-ember"
                    style={{ animationDelay: `${index * 0.9}s` }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const PlatformDevicesVisual: React.FC = () => {
  const devices = CONTENT.about.devices;

  const renderDeviceSvg = (name: string, solid: boolean) => {
    const strokeProps = solid
      ? { strokeDasharray: undefined }
      : { strokeDasharray: '4 3' };

    if (name === 'Browser') {
      return (
        <svg
          viewBox="0 0 64 48"
          fill="none"
          aria-hidden="true"
          className="h-12 w-16 text-ink"
        >
          <rect
            x="4"
            y="6"
            width="56"
            height="36"
            rx="6"
            fill={solid ? 'var(--paper)' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            {...strokeProps}
          />
          <line
            x1="4"
            y1="15"
            x2="60"
            y2="15"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="11" cy="10.5" r="1.3" fill="var(--ember)" />
          <circle cx="16" cy="10.5" r="1.3" fill="currentColor" />
        </svg>
      );
    }

    if (name === 'Phone') {
      return (
        <svg
          viewBox="0 0 48 64"
          fill="none"
          aria-hidden="true"
          className="h-14 w-11 text-ink"
        >
          <rect
            x="10"
            y="4"
            width="28"
            height="56"
            rx="7"
            fill={solid ? 'var(--paper)' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            {...strokeProps}
          />
          <line
            x1="20"
            y1="9"
            x2="28"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="53" r="1.8" fill="var(--ember)" />
        </svg>
      );
    }

    if (name === 'Headset') {
      return (
        <svg
          viewBox="0 0 64 48"
          fill="none"
          aria-hidden="true"
          className="h-12 w-16 text-ink"
        >
          <path
            d="M10 22C10 15.37 15.37 10 22 10H42C48.63 10 54 15.37 54 22V28C54 33.52 49.52 38 44 38H37L34 33H30L27 38H20C14.48 38 10 33.52 10 28V22Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            {...strokeProps}
          />
          <path
            d="M20 24H26M38 24H44"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 64 48"
        fill="none"
        aria-hidden="true"
        className="h-12 w-16 text-ink"
      >
        <rect
          x="6"
          y="16"
          width="21"
          height="16"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.6"
          {...strokeProps}
        />
        <rect
          x="37"
          y="16"
          width="21"
          height="16"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.6"
          {...strokeProps}
        />
        <path
          d="M27 22C29 20 35 20 37 22"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 rounded-[24px] border border-line bg-paper/75 p-6 md:p-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 my-auto">
        {devices.map((dev) => (
          <div
            key={dev.name}
            className={`flex flex-col items-center justify-between gap-4 rounded-[20px] p-4 text-center ${
              dev.solid
                ? 'border border-ink bg-paper shadow-soft'
                : 'border border-dashed border-ink/40 bg-transparent'
            }`}
          >
            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
              {dev.status}
            </span>

            <div className="my-2 flex h-16 items-center justify-center">
              {renderDeviceSvg(dev.name, dev.solid)}
            </div>

            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink font-medium">
              {dev.name}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
        <span>Solid: Active targets</span>
        <span>Dashed: Later</span>
      </div>
    </div>
  );
};

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const overlayRefs = useRef<Array<HTMLDivElement | null>>([]);
  const courtyardParallaxRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Pause diagram CSS loop when section is offscreen
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.remove('is-offscreen');
          } else {
            section.classList.add('is-offscreen');
          }
        });
      },
      { threshold: 0 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Stacking card scale + darken scrub & Card 01 image parallax (desktop only)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const cards = cardRefs.current.filter((c): c is HTMLElement => c !== null);

      cards.forEach((card, index) => {
        const nextCard = cards[index + 1];
        const overlay = overlayRefs.current[index];
        if (!nextCard) return;

        gsap.fromTo(
          card,
          { scale: 1 },
          {
            scale: 0.94,
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top bottom',
              end: 'top 140px',
              scrub: 0.8,
            },
          }
        );

        if (overlay) {
          gsap.fromTo(
            overlay,
            { opacity: 0 },
            {
              opacity: 0.06,
              ease: 'none',
              scrollTrigger: {
                trigger: nextCard,
                start: 'top bottom',
                end: 'top 140px',
                scrub: 0.8,
              },
            }
          );
        }
      });

      if (courtyardParallaxRef.current && cards[0]) {
        gsap.fromTo(
          courtyardParallaxRef.current,
          { yPercent: -6, scale: 1.14 },
          {
            yPercent: 6,
            scale: 1.14,
            ease: 'none',
            scrollTrigger: {
              trigger: cards[0],
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

  const renderStatusChip = (status: LayerCardContent['status']) => {
    if (status === 'Building now') {
      return (
        <span className="inline-flex items-center rounded-full bg-ember px-3.5 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink font-medium">
          {status}
        </span>
      );
    }
    if (status === 'Next') {
      return (
        <span className="inline-flex items-center rounded-full bg-violet-wash px-3.5 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-violet-deep font-medium">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full border border-line bg-[#FFFFFF] px-3.5 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink font-medium">
        {status}
      </span>
    );
  };

  const getCardSurfaceClass = (theme: LayerCardContent['theme']) => {
    if (theme === 'ink') {
      return 'bg-ink text-paper border border-white/[0.08]';
    }
    if (theme === 'mist') {
      return 'bg-mist text-ink border border-line';
    }
    return 'bg-[#FFFFFF] text-ink border border-line';
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.about}
      aria-label="Three layers of Arkvoid"
      className="relative w-full bg-paper-2 text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(96px, 14vw, 220px)',
        paddingBottom: 'clamp(96px, 14vw, 220px)',
      }}
    >
      <Container>
        {/* Heading and lead */}
        <div className="mb-14 md:mb-20 max-w-[920px]">
          <SplitHeading
            as="h2"
            text={CONTENT.about.heading}
            className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[54ch] text-lead text-ink-soft">
              {CONTENT.about.lead}
            </p>
          </Reveal>
        </div>

        {/* Stacking sticky cards */}
        <div className="relative flex flex-col gap-8 md:gap-12">
          {CONTENT.about.cards.map((card, index) => {
            const isInk = card.theme === 'ink';
            const stickyTop = 84 + index * 28;

            return (
              <article
                key={card.number}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                style={{ top: `${stickyTop}px` }}
                className={`relative lg:sticky overflow-hidden rounded-[32px] p-6 sm:p-10 lg:p-14 shadow-soft min-h-[440px] lg:h-[78svh] flex items-center origin-top ${getCardSurfaceClass(
                  card.theme
                )}`}
              >
                {/* Darkening overlay for stacking depth (uses opacity only, never CSS filter) */}
                <div
                  ref={(el) => {
                    overlayRefs.current[index] = el;
                  }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0"
                />

                <div className="relative z-10 grid h-full w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
                  {/* Left column (55% on desktop -> 7 of 12 cols) */}
                  <div className="flex flex-col justify-between gap-6 lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`font-mono text-[13px] uppercase tracking-[0.14em] tabular-nums ${
                          isInk ? 'text-paper/70' : 'text-ink-soft'
                        }`}
                      >
                        {card.number} — {card.layerLabel}
                      </span>
                      {renderStatusChip(card.status)}
                    </div>

                    <h3
                      className={`font-sans text-h3 font-medium tracking-[-0.03em] ${
                        isInk ? 'text-paper' : 'text-ink'
                      }`}
                    >
                      {card.title}
                    </h3>

                    <p
                      className={`max-w-[54ch] text-body ${
                        isInk ? 'text-paper/80' : 'text-ink-soft'
                      }`}
                    >
                      {card.body}
                    </p>

                    <ul className="mt-2 flex flex-col gap-3 border-t border-current/10 pt-5">
                      {card.lines.map((line) => (
                        <li
                          key={line}
                          className={`flex items-center gap-3.5 text-[16px] md:text-[17px] ${
                            isInk ? 'text-paper/90' : 'text-ink'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full bg-ember shrink-0"
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right column (45% on desktop -> 5 of 12 cols) */}
                  <div className="h-full w-full lg:col-span-5 flex items-center justify-center">
                    {index === 0 && (
                      <div className="relative h-[300px] sm:h-[360px] lg:h-full max-h-[520px] w-full max-w-[420px] overflow-hidden rounded-t-full border border-line bg-paper-2">
                        <div ref={courtyardParallaxRef} className="h-full w-full">
                          <Media mediaKey="world-courtyard" fill />
                        </div>
                      </div>
                    )}

                    {index === 1 && <EngineDiagram />}

                    {index === 2 && <PlatformDevicesVisual />}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
