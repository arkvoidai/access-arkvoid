import React, { useEffect, useRef, useState } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT, type ResearchTrackContent } from '../content/site';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

interface TrackCardProps {
  track: ResearchTrackContent;
  reducedMotion: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, reducedMotion }) => {
  const cardRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [displayNum, setDisplayNum] = useState<number>(
    reducedMotion ? track.targetValue : 0
  );

  useEffect(() => {
    if (reducedMotion) {
      setDisplayNum(track.targetValue);
      return undefined;
    }

    const card = cardRef.current;
    if (!card) return undefined;

    const counterObj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counterObj, {
        val: track.targetValue,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 84%',
          once: true,
        },
        onUpdate: () => {
          setDisplayNum(Math.round(counterObj.val));
        },
      });

      if (barRef.current) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          {
            scaleX: track.progressRatio,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 84%',
              once: true,
            },
          }
        );
      }
    }, card);

    return () => ctx.revert();
  }, [reducedMotion, track.targetValue, track.progressRatio]);

  return (
    <article
      ref={cardRef}
      className="flex h-full flex-col justify-between gap-8 rounded-card border border-line bg-[#FFFFFF] p-7 sm:p-10 shadow-soft"
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
            {track.number}
          </span>
          <span className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink">
            {CONTENT.research.targetTag}
          </span>
        </div>

        <h3 className="mt-4 font-sans text-h3 font-medium tracking-[-0.03em] text-ink">
          {track.title}
        </h3>

        <p className="mt-3 max-w-[52ch] text-body text-ink-soft">
          {track.paragraph}
        </p>
      </div>

      {/* Big target metric + progress indicator */}
      <div>
        <div
          aria-label={`Target: ${track.targetValue} ${track.targetUnit}`}
          className="flex items-baseline gap-2"
        >
          <span
            aria-hidden="true"
            className="font-sans font-medium tracking-[-0.045em] text-ink tabular-nums"
            style={{
              fontSize: 'clamp(4rem, 2rem + 7vw, 8.2rem)',
              lineHeight: 0.95,
            }}
          >
            {displayNum}
          </span>
          <span
            aria-hidden="true"
            className="font-sans text-[28px] sm:text-[36px] font-medium tracking-[-0.03em] text-ember-deep"
          >
            {track.targetUnit}
          </span>
        </div>

        <p className="mt-3 text-[16px] md:text-[17px] text-ink">
          {track.targetCaption}
        </p>

        {/* Progress Bar or 4-segment indicator for Track 04 */}
        <div className="mt-5">
          {track.segmentedDevices ? (
            <div className="grid grid-cols-4 gap-2">
              {track.segmentedDevices.map((dev, idx) => {
                const isFilled = idx < 2;
                return (
                  <div key={dev} className="flex flex-col gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-full rounded-full block ${
                        isFilled
                          ? 'bg-ember'
                          : 'border border-ink/30 bg-transparent'
                      }`}
                    />
                    <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                      {dev}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
              <div
                ref={barRef}
                className="h-full w-full bg-ember origin-left"
                style={{
                  transform: `scaleX(${reducedMotion ? track.progressRatio : 0})`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer line: How we will test it */}
      <div className="border-t border-line pt-4">
        <span className="block font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
          {CONTENT.research.testPrefix}
        </span>
        <p className="mt-1 text-[16px] text-ink">{track.test}</p>
      </div>
    </article>
  );
};

export const Research: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const inkPanelRef = useRef<HTMLDivElement>(null);
  const topEmberLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = inkPanelRef.current;
    if (!panel || reducedMotion) return undefined;

    const cols = Array.from(
      panel.querySelectorAll<HTMLElement>('.research-panel-col')
    );

    const ctx = gsap.context(() => {
      if (topEmberLineRef.current) {
        gsap.fromTo(
          topEmberLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      gsap.fromTo(
        cols,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, panel);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id={SECTION_IDS.research}
      aria-label="Research and goals"
      className="relative w-full bg-paper-2 text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(96px, 14vw, 220px)',
        paddingBottom: 'clamp(96px, 14vw, 220px)',
      }}
    >
      <Container>
        {/* Header */}
        <div className="mb-14 md:mb-20 max-w-[880px]">
          <Eyebrow>{CONTENT.research.eyebrow}</Eyebrow>
          <div className="mt-4">
            <SplitHeading
              as="h2"
              text={CONTENT.research.heading}
              className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[54ch] text-lead text-ink-soft">
              {CONTENT.research.lead}
            </p>
          </Reveal>
        </div>

        {/* C1. Four research tracks (2x2 on desktop, stacked on mobile) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {CONTENT.research.tracks.map((track) => (
            <TrackCard
              key={track.number}
              track={track}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* C2. Three tests of success (full-width ink panel) */}
        <div
          ref={inkPanelRef}
          className="relative mt-12 md:mt-16 overflow-hidden rounded-[32px] border border-white/[0.08] bg-ink p-7 sm:p-12 lg:p-16 text-paper"
        >
          {/* Thin ember line drawing across the top of the panel */}
          <div
            ref={topEmberLineRef}
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-[2px] bg-ember origin-left"
          />

          <h3 className="font-sans text-h3 font-medium tracking-[-0.03em] text-paper">
            {CONTENT.research.panelHeading}
          </h3>

          <div className="mt-10 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-white/10">
            {CONTENT.research.panelColumns.map((col, idx) => (
              <div
                key={col.number}
                className={`research-panel-col flex flex-col gap-3 ${
                  idx > 0 ? 'lg:pl-10' : ''
                } ${idx < 2 ? 'lg:pr-10' : ''}`}
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ember tabular-nums">
                  {col.number}
                </span>
                <h4 className="font-sans text-[22px] sm:text-[26px] font-medium tracking-[-0.025em] text-paper">
                  {col.title}
                </h4>
                <p className="text-body text-paper/75">{col.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* C3. Plain statement */}
        <Reveal delay={0.1} className="mt-16 md:mt-24">
          <p className="mx-auto max-w-[46ch] text-center text-lead text-ink">
            {CONTENT.research.plainStatement}
          </p>
        </Reveal>
      </Container>
    </section>
  );
};
