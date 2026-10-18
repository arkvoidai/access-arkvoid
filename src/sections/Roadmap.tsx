import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT, type RoadmapStageItem } from '../content/site';
import { gsap } from '../lib/gsap';
import { useMediaQuery, usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

export const Roadmap: React.FC = () => {
  const isPointerFine = useMediaQuery(
    '(min-width: 768px) and (hover: hover) and (pointer: fine)'
  );
  const reducedMotion = usePrefersReducedMotion();
  const useCustomDrag = isPointerFine && !reducedMotion;

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const nativeScrollerRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [canPrev, setCanPrev] = useState<boolean>(false);
  const [canNext, setCanNext] = useState<boolean>(true);

  const dragState = useRef({
    isDown: false,
    startX: 0,
    startTranslate: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    currentX: 0,
    maxNegativeX: 0,
  });

  // Pause pulse dot when offscreen
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

  const syncBoundsAndProgress = useCallback((xVal: number) => {
    const viewport = viewportRef.current;
    const rail = railRef.current;
    if (!viewport || !rail) return;

    const maxNeg = Math.min(0, viewport.clientWidth - rail.scrollWidth);
    dragState.current.maxNegativeX = maxNeg;

    const clamped = Math.max(maxNeg, Math.min(0, xVal));
    dragState.current.currentX = clamped;

    const progress = maxNeg < 0 ? Math.abs(clamped / maxNeg) : 0;
    if (progressFillRef.current) {
      gsap.set(progressFillRef.current, { scaleX: progress });
    }
    setCanPrev(clamped < -4);
    setCanNext(clamped > maxNeg + 4);
  }, []);

  // Entrance stagger fly-in from right
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>('.roadmap-stage-card')
    );

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { x: 120, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion, useCustomDrag]);

  useEffect(() => {
    if (!useCustomDrag) return undefined;
    syncBoundsAndProgress(dragState.current.currentX);

    const onResize = () => {
      syncBoundsAndProgress(dragState.current.currentX);
      if (railRef.current) {
        gsap.set(railRef.current, { x: dragState.current.currentX });
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [useCustomDrag, syncBoundsAndProgress]);

  const animateRailTo = (targetX: number, duration = 0.85) => {
    const rail = railRef.current;
    const viewport = viewportRef.current;
    if (!rail || !viewport) return;

    const maxNeg = Math.min(0, viewport.clientWidth - rail.scrollWidth);
    dragState.current.maxNegativeX = maxNeg;
    const clamped = Math.max(maxNeg, Math.min(0, targetX));

    gsap.to(rail, {
      x: clamped,
      duration,
      ease: 'power3.out',
      overwrite: 'auto',
      onUpdate: () => {
        const current = Number(gsap.getProperty(rail, 'x')) || 0;
        syncBoundsAndProgress(current);
      },
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!useCustomDrag || !railRef.current || !viewportRef.current) return;
    gsap.killTweensOf(railRef.current);

    const current = Number(gsap.getProperty(railRef.current, 'x')) || 0;
    const maxNeg = Math.min(
      0,
      viewportRef.current.clientWidth - railRef.current.scrollWidth
    );

    dragState.current = {
      isDown: true,
      startX: e.clientX,
      startTranslate: current,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
      currentX: current,
      maxNegativeX: maxNeg,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!useCustomDrag || !dragState.current.isDown || !railRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - dragState.current.lastTime);
    const dx = e.clientX - dragState.current.lastX;

    dragState.current.velocity = dx / dt; // px per ms
    dragState.current.lastX = e.clientX;
    dragState.current.lastTime = now;

    const rawNext =
      dragState.current.startTranslate + (e.clientX - dragState.current.startX);
    const clamped = Math.max(
      dragState.current.maxNegativeX,
      Math.min(0, rawNext)
    );

    gsap.set(railRef.current, { x: clamped });
    syncBoundsAndProgress(clamped);
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!useCustomDrag || !dragState.current.isDown) return;
    dragState.current.isDown = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if not captured
    }

    const throwDistance = dragState.current.velocity * 360;
    animateRailTo(dragState.current.currentX + throwDistance, 0.9);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!useCustomDrag) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      animateRailTo(dragState.current.currentX - e.deltaX * 1.4, 0.45);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 380;
    if (useCustomDrag) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        animateRailTo(dragState.current.currentX - step, 0.65);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        animateRailTo(dragState.current.currentX + step, 0.65);
      }
    } else if (nativeScrollerRef.current) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nativeScrollerRef.current.scrollBy({ left: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nativeScrollerRef.current.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }
  };

  const handleStepButton = (direction: -1 | 1) => {
    const step = 400;
    if (useCustomDrag) {
      animateRailTo(dragState.current.currentX - direction * step, 0.75);
    } else if (nativeScrollerRef.current) {
      nativeScrollerRef.current.scrollBy({
        left: direction * step,
        behavior: 'smooth',
      });
    }
  };

  const handleNativeScroll = () => {
    const scroller = nativeScrollerRef.current;
    if (!scroller) return;
    const maxScroll = Math.max(1, scroller.scrollWidth - scroller.clientWidth);
    const progress = scroller.scrollLeft / maxScroll;
    if (progressFillRef.current) {
      gsap.set(progressFillRef.current, { scaleX: progress });
    }
    setCanPrev(scroller.scrollLeft > 4);
    setCanNext(scroller.scrollLeft < maxScroll - 4);
  };

  const renderStageCard = (stage: RoadmapStageItem) => {
    const isNow = Boolean(stage.isNow);
    const isDashed = Boolean(stage.isDashed);

    return (
      <article
        key={stage.stageNumber}
        className={`roadmap-stage-card flex min-h-[420px] shrink-0 flex-col justify-between rounded-card p-7 sm:p-9 select-none ${
          isNow
            ? 'border border-white/[0.08] bg-ink text-paper shadow-soft'
            : isDashed
            ? 'border border-dashed border-ink/40 bg-[#FFFFFF] text-ink'
            : 'border border-line bg-[#FFFFFF] text-ink shadow-soft'
        }`}
        style={{ width: 'clamp(300px, 28vw, 460px)' }}
      >
        <div>
          <div className="flex items-center justify-between gap-3">
            <span
              className={`font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] tabular-nums ${
                isNow ? 'text-paper/70' : 'text-ink-soft'
              }`}
            >
              {stage.stageNumber}
            </span>

            <span
              className={`rounded-full px-3 py-1 font-mono text-[12px] uppercase tracking-[0.14em] ${
                isNow
                  ? 'border border-white/15 bg-ink-2 text-paper'
                  : isDashed
                  ? 'border border-dashed border-ink/40 bg-paper text-ink'
                  : 'border border-line bg-paper text-ink-soft'
              }`}
            >
              {stage.window}
            </span>
          </div>

          <h3
            className={`mt-6 font-sans text-h3 font-medium tracking-[-0.03em] ${
              isNow ? 'text-paper' : 'text-ink'
            }`}
          >
            {stage.title}
          </h3>

          <p
            className={`mt-4 text-body ${
              isNow ? 'text-paper/80' : 'text-ink-soft'
            }`}
          >
            {stage.body}
          </p>
        </div>

        <div
          className={`mt-8 flex items-center justify-between border-t pt-4 ${
            isNow ? 'border-white/10' : 'border-line'
          }`}
        >
          <span
            className={`font-mono text-[12px] uppercase tracking-[0.14em] ${
              isNow ? 'text-paper/65' : 'text-ink-soft'
            }`}
          >
            Status
          </span>

          {isNow ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-ember px-3.5 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink font-medium">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-ink ember-pulse block"
              />
              NOW
            </span>
          ) : (
            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink">
              {stage.status}
            </span>
          )}
        </div>
      </article>
    );
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.roadmap}
      aria-label="Roadmap"
      className="relative w-full bg-paper-2 text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(96px, 14vw, 220px)',
        paddingBottom: 'clamp(96px, 14vw, 220px)',
      }}
    >
      <Container>
        <div className="mb-12 md:mb-16 max-w-[880px]">
          <Eyebrow>{CONTENT.roadmap.eyebrow}</Eyebrow>
          <div className="mt-4">
            <SplitHeading
              as="h2"
              text={CONTENT.roadmap.heading}
              className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
            />
          </div>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[54ch] text-lead text-ink-soft">
              {CONTENT.roadmap.lead}
            </p>
          </Reveal>
        </div>
      </Container>

      {/* Timeline Rail */}
      {useCustomDrag ? (
        <div
          ref={viewportRef}
          tabIndex={0}
          role="region"
          aria-label="Draggable roadmap timeline"
          data-cursor="drag"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          className="w-full overflow-hidden cursor-grab active:cursor-grabbing py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-deep"
        >
          <div
            ref={railRef}
            className="flex w-max items-stretch gap-6"
            style={{
              paddingLeft: 'clamp(20px, 4vw, 72px)',
              paddingRight: 'clamp(20px, 4vw, 72px)',
            }}
          >
            {CONTENT.roadmap.stages.map((st) => renderStageCard(st))}
          </div>
        </div>
      ) : (
        <div
          ref={nativeScrollerRef}
          tabIndex={0}
          role="region"
          aria-label="Roadmap timeline"
          onScroll={handleNativeScroll}
          onKeyDown={handleKeyDown}
          className="no-scrollbar flex w-full snap-x snap-mandatory items-stretch gap-4 overflow-x-auto pb-4"
          style={{
            paddingLeft: 'clamp(20px, 4vw, 72px)',
            paddingRight: 'clamp(20px, 4vw, 72px)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {CONTENT.roadmap.stages.map((st) => (
            <div key={st.stageNumber} className="snap-start flex">
              {renderStageCard(st)}
            </div>
          ))}
        </div>
      )}

      {/* Controls, Progress Bar, and Footnote */}
      <Container className="mt-8">
        <div className="flex flex-col gap-5">
          <div className="relative h-[1.5px] w-full overflow-hidden bg-line">
            <div
              ref={progressFillRef}
              className="h-full w-full bg-ember origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
              {CONTENT.roadmap.footnote}
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleStepButton(-1)}
                disabled={!canPrev}
                aria-label="Previous roadmap stages"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-[#FFFFFF] text-ink transition-colors hover:border-ink disabled:opacity-35"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M12.5 8H3.5M3.5 8L7.5 4M3.5 8L7.5 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleStepButton(1)}
                disabled={!canNext}
                aria-label="Next roadmap stages"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-[#FFFFFF] text-ink transition-colors hover:border-ink disabled:opacity-35"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
