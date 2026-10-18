import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Media } from '../components/ui/Media';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT } from '../content/site';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useMediaQuery, usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

export const World: React.FC = () => {
  const isDesktopPointer = useMediaQuery(
    '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
  );
  const reducedMotion = usePrefersReducedMotion();
  const usePinnedDesktop = isDesktopPointer && !reducedMotion;

  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs = useRef<Array<HTMLElement | null>>([]);
  const rafScrollRef = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hasSwiped, setHasSwiped] = useState<boolean>(false);

  const cards = CONTENT.world.cards;
  const totalCount = String(cards.length).padStart(2, '0');
  const currentCount = String(activeIndex + 1).padStart(2, '0');

  // Desktop pinned horizontal rail + ScrollTrigger counter-parallax
  useEffect(() => {
    if (!usePinnedDesktop) return undefined;
    const stage = pinStageRef.current;
    const track = desktopTrackRef.current;
    const progressFill = progressFillRef.current;
    if (!stage || !track || !progressFill) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (hover: hover) and (pointer: fine)', () => {
      const cardEls = Array.from(
        track.querySelectorAll<HTMLElement>('.world-desktop-card')
      );
      const imageScaleEls = Array.from(
        track.querySelectorAll<HTMLElement>('.world-card-parallax')
      );

      const getScrollAmount = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth + 96);
      };

      gsap.set(imageScaleEls, { scale: 1.12, xPercent: -8 });
      gsap.set(cardEls.slice(1), { scale: 0.94 });

      const mainTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              cards.length - 1,
              Math.max(0, Math.round(self.progress * (cards.length - 1)))
            );
            setActiveIndex(idx);
            gsap.set(progressFill, { scaleX: self.progress });
          },
        },
      });

      scrollTriggerRef.current = mainTween.scrollTrigger || null;

      gsap.to(imageScaleEls, {
        xPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      cardEls.forEach((cardEl, idx) => {
        if (idx === 0) return;
        gsap.fromTo(
          cardEl,
          { scale: 0.94 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: () =>
                `top+=${((idx - 0.8) / cards.length) * getScrollAmount()} top`,
              end: () =>
                `top+=${((idx + 0.1) / cards.length) * getScrollAmount()} top`,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    });

    return () => {
      scrollTriggerRef.current = null;
      mm.revert();
    };
  }, [usePinnedDesktop, cards.length]);

  // Touch / Tablet native horizontal swipe + ScrollTrigger vertical parallax
  useEffect(() => {
    if (usePinnedDesktop || reducedMotion) return undefined;
    const scroller = mobileScrollerRef.current;
    if (!scroller) return undefined;

    const ctx = gsap.context(() => {
      const parallaxEls = Array.from(
        scroller.querySelectorAll<HTMLElement>('.world-card-parallax')
      );

      gsap.fromTo(
        parallaxEls,
        { yPercent: -5, scale: 1.1 },
        {
          yPercent: 5,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: scroller,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      );
    }, scroller);

    return () => ctx.revert();
  }, [usePinnedDesktop, reducedMotion]);

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(rafScrollRef.current);
    };
  }, []);

  // Keep focused card in view when tabbing through pinned desktop rail
  const handleDesktopCardFocus = (index: number) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const progress = cards.length > 1 ? index / (cards.length - 1) : 0;
    const targetScroll = st.start + (st.end - st.start) * progress;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    setActiveIndex(index);
  };

  // Lightweight RAF-throttled scroll handler so native touch scroll is never blocked
  const handleMobileScroll = useCallback(() => {
    window.cancelAnimationFrame(rafScrollRef.current);
    rafScrollRef.current = window.requestAnimationFrame(() => {
      const scroller = mobileScrollerRef.current;
      if (!scroller) return;
      if (!hasSwiped && scroller.scrollLeft > 10) {
        setHasSwiped(true);
      }

      const maxScroll = Math.max(1, scroller.scrollWidth - scroller.clientWidth);
      const ratio = Math.min(1, Math.max(0, scroller.scrollLeft / maxScroll));
      const idx = Math.min(
        cards.length - 1,
        Math.max(0, Math.round(ratio * (cards.length - 1)))
      );
      setActiveIndex(idx);
    });
  }, [hasSwiped, cards.length]);

  const scrollToMobileCard = (index: number) => {
    const scroller = mobileScrollerRef.current;
    const targetCard = mobileCardRefs.current[index];
    if (!scroller || !targetCard) return;
    setHasSwiped(true);
    const leftPad = parseFloat(window.getComputedStyle(scroller).paddingLeft) || 20;
    scroller.scrollTo({
      left: Math.max(0, targetCard.offsetLeft - leftPad),
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToMobileCard(Math.min(cards.length - 1, activeIndex + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToMobileCard(Math.max(0, activeIndex - 1));
    }
  };

  const renderCardInner = (card: (typeof cards)[number]) => (
    <>
      <div className="world-card-parallax h-full w-full">
        <Media mediaKey={card.mediaKey} fill />
      </div>

      {/* Top-left place type paper pill */}
      <div className="pointer-events-none absolute top-5 left-5 z-20">
        <span className="inline-flex items-center rounded-full border border-line bg-paper px-3.5 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink">
          {card.pill}
        </span>
      </div>

      {/* Soft ink gradient at the bottom 40% (opacity 60%) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42%]"
        style={{
          background:
            'linear-gradient(to top, rgba(20, 21, 26, 0.65) 0%, rgba(20, 21, 26, 0.35) 55%, rgba(20, 21, 26, 0) 100%)',
        }}
      />

      {/* Bottom-left mono number, h3 title, and caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6 md:p-8">
        <span className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-paper/75 tabular-nums">
          {card.number}
        </span>
        <h3 className="mt-1 font-sans text-h3 font-medium tracking-[-0.03em] text-paper">
          {card.title}
        </h3>
        <p className="mt-2 max-w-[46ch] text-[16px] md:text-[17px] text-paper/80">
          {card.caption}
        </p>
      </div>
    </>
  );

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.world}
      aria-label="The World"
      className="relative w-full bg-paper text-ink"
    >
      {usePinnedDesktop ? (
        <div
          ref={pinStageRef}
          className="relative flex h-[100svh] w-full flex-col justify-between overflow-hidden py-10"
        >
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>{CONTENT.world.eyebrow}</Eyebrow>
                <div className="mt-4">
                  <SplitHeading
                    as="h2"
                    text={CONTENT.world.heading}
                    className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
                  />
                </div>
              </div>
              <p className="max-w-[44ch] text-body text-ink-soft pb-1">
                {CONTENT.world.lead}
              </p>
            </div>
          </Container>

          {/* Horizontal scrubbed rail */}
          <div className="relative my-auto w-full overflow-visible">
            <div
              ref={desktopTrackRef}
              className="flex items-center gap-6"
              style={{
                paddingLeft: 'clamp(20px, 4vw, 72px)',
                paddingRight: 'clamp(20px, 4vw, 72px)',
              }}
            >
              {cards.map((card, index) => (
                <article
                  key={card.mediaKey}
                  tabIndex={0}
                  data-cursor="view"
                  onFocus={() => handleDesktopCardFocus(index)}
                  aria-label={`${card.number} ${card.title}: ${card.caption}`}
                  className="world-desktop-card relative h-[64svh] max-h-[680px] shrink-0 overflow-hidden rounded-card border border-line bg-paper-2 shadow-soft"
                  style={{ width: 'clamp(380px, 38vw, 720px)' }}
                >
                  {renderCardInner(card)}
                </article>
              ))}
            </div>
          </div>

          {/* Bottom counter, footnote, and progress bar */}
          <Container>
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink tabular-nums">
                  {currentCount} / {totalCount}
                </span>
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                  {CONTENT.world.footnote}
                </span>
              </div>
              <div className="relative h-[1.5px] w-full overflow-hidden bg-line">
                <div
                  ref={progressFillRef}
                  className="h-full w-full bg-ember origin-left"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          </Container>
        </div>
      ) : (
        <div
          style={{
            paddingTop: 'clamp(96px, 14vw, 220px)',
            paddingBottom: 'clamp(96px, 14vw, 220px)',
          }}
        >
          <Container>
            <div className="mb-10 flex flex-col gap-4">
              <Eyebrow>{CONTENT.world.eyebrow}</Eyebrow>
              <SplitHeading
                as="h2"
                text={CONTENT.world.heading}
                className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
              />
              <Reveal delay={0.08}>
                <p className="max-w-[48ch] text-lead text-ink-soft">
                  {CONTENT.world.lead}
                </p>
              </Reveal>
            </div>

            {/* Touch-friendly header bar: counter, swipe hint, and prev/next buttons */}
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink tabular-nums">
                  {currentCount} / {totalCount}
                </span>
                <span
                  className={`font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft transition-opacity duration-500 ${
                    hasSwiped ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {CONTENT.world.swipeHint} →
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToMobileCard(Math.max(0, activeIndex - 1))}
                  disabled={activeIndex === 0}
                  aria-label="Previous place"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink disabled:opacity-35"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    scrollToMobileCard(Math.min(cards.length - 1, activeIndex + 1))
                  }
                  disabled={activeIndex === cards.length - 1}
                  aria-label="Next place"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink disabled:opacity-35"
                >
                  →
                </button>
              </div>
            </div>
          </Container>

          {/* Native horizontal snap scroller permitting both vertical and horizontal touch pan */}
          <div
            ref={mobileScrollerRef}
            role="region"
            aria-label="Concept art gallery"
            onScroll={handleMobileScroll}
            onKeyDown={handleMobileKeyDown}
            className="no-scrollbar flex w-full snap-x snap-mandatory gap-[14px] overflow-x-auto pb-4"
            style={{
              paddingLeft: 'clamp(20px, 4vw, 72px)',
              paddingRight: 'clamp(20px, 4vw, 72px)',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x pan-y',
            }}
          >
            {cards.map((card, index) => (
              <article
                key={card.mediaKey}
                ref={(el) => {
                  mobileCardRefs.current[index] = el;
                }}
                className="relative aspect-[4/5] sm:aspect-[16/11] w-[82vw] md:w-[56vw] max-w-[640px] shrink-0 snap-start overflow-hidden rounded-card-sm md:rounded-card border border-line bg-paper-2 shadow-soft"
              >
                {renderCardInner(card)}
              </article>
            ))}
          </div>

          <Container>
            {/* Interactive dot indicators and footnote */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div
                role="group"
                aria-label="Choose place card"
                className="flex items-center gap-1.5"
              >
                {cards.map((c, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <button
                      key={c.mediaKey}
                      type="button"
                      onClick={() => scrollToMobileCard(idx)}
                      aria-label={`View ${c.title}`}
                      aria-current={isCurrent ? 'true' : undefined}
                      className="inline-flex h-8 w-6 items-center justify-center"
                    >
                      <span
                        className={`h-2 w-2 rounded-full transition-transform duration-300 ${
                          isCurrent
                            ? 'bg-ember scale-125'
                            : 'bg-ink/25 scale-100'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                {CONTENT.world.footnote}
              </p>
            </div>
          </Container>
        </div>
      )}
    </section>
  );
};
