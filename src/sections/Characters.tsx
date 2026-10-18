import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Media } from '../components/ui/Media';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT } from '../content/site';
import { gsap } from '../lib/gsap';
import { useIsTouch, usePrefersReducedMotion } from '../lib/hooks';
import { scrollToSection } from '../lib/smooth';
import { Reveal, SplitHeading } from '../lib/split';

export const Characters: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const rafScrollRef = useRef<number>(0);

  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouch();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hasSwiped, setHasSwiped] = useState<boolean>(false);

  const cards = CONTENT.characters.cards;
  const totalCount = String(cards.length).padStart(2, '0');
  const currentCount = String(activeIndex + 1).padStart(2, '0');

  // ScrollTrigger staggered card entrance + alternating vertical parallax
  useEffect(() => {
    const section = sectionRef.current;
    const grid = scrollerRef.current;
    if (!section || !grid || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const cardEls = Array.from(
        grid.querySelectorAll<HTMLElement>('.character-card')
      );
      const parallaxImages = Array.from(
        grid.querySelectorAll<HTMLElement>('.character-image-parallax')
      );

      if (topLineRef.current) {
        gsap.fromTo(
          topLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 86%',
              once: true,
            },
          }
        );
      }

      gsap.fromTo(
        cardEls,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true,
          },
        }
      );

      parallaxImages.forEach((imgWrapper, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        gsap.fromTo(
          imgWrapper,
          { yPercent: 6 * dir, scale: 1.14 },
          {
            yPercent: -6 * dir,
            scale: 1.14,
            ease: 'none',
            scrollTrigger: {
              trigger: grid,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(rafScrollRef.current);
    };
  }, []);

  // Lightweight RAF-throttled scroll handler so native touch scroll is never blocked
  const handleTouchScroll = useCallback(() => {
    window.cancelAnimationFrame(rafScrollRef.current);
    rafScrollRef.current = window.requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
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

  const scrollToCharacterCard = (index: number) => {
    const scroller = scrollerRef.current;
    const targetCard = cardRefs.current[index];
    if (!scroller || !targetCard) return;
    setHasSwiped(true);
    const leftPad = parseFloat(window.getComputedStyle(scroller).paddingLeft) || 20;
    scroller.scrollTo({
      left: Math.max(0, targetCard.offsetLeft - leftPad),
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const handleScrollerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToCharacterCard(Math.min(cards.length - 1, activeIndex + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToCharacterCard(Math.max(0, activeIndex - 1));
    }
  };

  const handleHowClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    scrollToSection(SECTION_IDS.how, -80);
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.characters}
      aria-label="The People of Arkvoid"
      className="relative w-full bg-paper-2 text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(96px, 14vw, 220px)',
        paddingBottom: 'clamp(96px, 14vw, 220px)',
      }}
    >
      <Container>
        {/* Header */}
        <div className="mb-10 md:mb-16 max-w-[860px]">
          <Eyebrow>{CONTENT.characters.eyebrow}</Eyebrow>
          <div className="mt-4">
            <SplitHeading
              as="h2"
              text={CONTENT.characters.heading}
              className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[54ch] text-lead text-ink-soft">
              {CONTENT.characters.lead}
            </p>
          </Reveal>
        </div>

        {/* Mobile touch swipe controls bar */}
        <div className="mb-5 flex md:hidden items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink tabular-nums">
              {currentCount} / {totalCount}
            </span>
            <span
              className={`font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft transition-opacity duration-500 ${
                hasSwiped ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Swipe →
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToCharacterCard(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous character"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink disabled:opacity-35"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() =>
                scrollToCharacterCard(Math.min(cards.length - 1, activeIndex + 1))
              }
              disabled={activeIndex === cards.length - 1}
              aria-label="Next character"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink disabled:opacity-35"
            >
              →
            </button>
          </div>
        </div>

        {/* Faint ember hairline connecting card tops on desktop */}
        <div className="hidden lg:block mb-5">
          <div
            ref={topLineRef}
            aria-hidden="true"
            className="h-[1px] w-full bg-ember/45 origin-left"
          />
        </div>
      </Container>

      {/* Cards container: allows both vertical page scrolling and horizontal swipe on phone */}
      <div className="mx-auto w-full max-w-[1680px]">
        <div
          ref={scrollerRef}
          role="region"
          aria-label="Inhabitants of the first world"
          onScroll={handleTouchScroll}
          onKeyDown={handleScrollerKeyDown}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible lg:grid-cols-4"
          style={{
            paddingLeft: 'clamp(20px, 4vw, 72px)',
            paddingRight: 'clamp(20px, 4vw, 72px)',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x pan-y',
          }}
        >
          {cards.map((char, index) => (
            <article
              key={char.mediaKey}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              tabIndex={isTouch ? undefined : 0}
              data-cursor="view"
              className="character-card group relative min-h-[460px] aspect-[3/4] sm:aspect-[4/5] w-[80vw] max-w-[360px] shrink-0 snap-start overflow-hidden rounded-card-sm md:w-auto md:max-w-none md:rounded-card border border-line bg-paper shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-violet-deep"
            >
              {/* Portrait image with ScrollTrigger vertical parallax & hover scale */}
              <div className="h-full w-full overflow-hidden">
                <div className="character-image-parallax h-full w-full">
                  <div className="h-full w-full transition-transform duration-500 ease-expo-out group-hover:scale-[1.06] group-focus-within:scale-[1.06]">
                    <Media mediaKey={char.mediaKey} fill />
                  </div>
                </div>
              </div>

              {/* White inset memory panel (radius 22px, inset 12px) */}
              <div className="absolute bottom-3 left-3 right-3 z-20 rounded-[22px] border border-line bg-[#FFFFFF]/95 p-4 sm:p-5 text-ink shadow-soft">
                <span className="block font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                  {char.role}
                </span>
                <h3 className="mt-1 font-sans text-[21px] xl:text-[25px] font-medium leading-[1.15] tracking-[-0.025em] text-ink">
                  {char.name}
                </h3>

                {/* Expandable memory & wants details: always visible on touch, reveals on hover/focus on desktop */}
                <div
                  className={
                    isTouch
                      ? 'mt-2.5 border-t border-line pt-2.5'
                      : 'grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-expo-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]'
                  }
                >
                  <div className="overflow-hidden">
                    <dl
                      className={`${
                        isTouch ? '' : 'mt-3.5 border-t border-line pt-3.5'
                      } flex flex-col gap-2 text-[14px] sm:text-[15px] leading-[1.38]`}
                    >
                      <div>
                        <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-ember-deep">
                          {CONTENT.characters.remembersLabel}
                        </dt>
                        <dd className="mt-0.5 text-ink-soft">
                          {char.remembers}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-violet-deep">
                          {CONTENT.characters.wantsLabel}
                        </dt>
                        <dd className="mt-0.5 text-ink-soft">{char.wants}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Container>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {/* Interactive dot indicators on mobile */}
          <div
            role="group"
            aria-label="Choose character card"
            className="flex md:hidden items-center gap-1.5"
          >
            {cards.map((c, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={c.mediaKey}
                  type="button"
                  onClick={() => scrollToCharacterCard(idx)}
                  aria-label={`View ${c.name}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  className="inline-flex h-8 w-6 items-center justify-center"
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-transform duration-300 ${
                      isCurrent ? 'bg-ember scale-125' : 'bg-ink/25 scale-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
            {CONTENT.characters.footnote}
          </p>
        </div>

        {/* Bottom centred statement + link button */}
        <Reveal delay={0.1} className="mt-16 md:mt-24">
          <div className="mx-auto flex max-w-[780px] flex-col items-center justify-center gap-4 text-center sm:flex-row sm:flex-wrap sm:gap-6">
            <p className="text-lead text-ink">
              {CONTENT.characters.bottomStatement}
            </p>
            <Button
              variant="link"
              icon="arrow"
              onClick={handleHowClick}
            >
              {CONTENT.characters.bottomLinkLabel}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
