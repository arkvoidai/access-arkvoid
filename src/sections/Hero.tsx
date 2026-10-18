import React, { useEffect, useRef } from 'react';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT } from '../content/site';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { scrollToSection } from '../lib/smooth';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Media } from '../components/ui/Media';

export interface HeroProps {
  ready: boolean;
}

export const Hero: React.FC<HeroProps> = ({ ready }) => {
  const reducedMotion = usePrefersReducedMotion();

  const sceneARef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const underlinePathRef = useRef<SVGPathElement>(null);
  const subContentRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const portalStageRef = useRef<HTMLDivElement>(null);
  const portalClipRef = useRef<HTMLDivElement>(null);
  const portalImageScaleRef = useRef<HTMLDivElement>(null);
  const archFrameRef = useRef<SVGSVGElement>(null);
  const chip1Ref = useRef<HTMLDivElement>(null);
  const chip2Ref = useRef<HTMLDivElement>(null);
  const chip3Ref = useRef<HTMLDivElement>(null);
  const portalEndTextRef = useRef<HTMLDivElement>(null);

  // Offscreen observer to pause infinite CSS animations in Scene A
  useEffect(() => {
    const el = sceneARef.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove('is-offscreen');
          } else {
            el.classList.add('is-offscreen');
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scene A: Line-by-line headline reveal after preloader exit
  useEffect(() => {
    const sceneA = sceneARef.current;
    if (!sceneA || reducedMotion) return undefined;

    const lines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(
      (el): el is HTMLSpanElement => el !== null
    );

    const ctx = gsap.context(() => {
      if (!ready) {
        gsap.set(lines, { yPercent: 110 });
        if (underlinePathRef.current) {
          gsap.set(underlinePathRef.current, {
            strokeDasharray: 1,
            strokeDashoffset: 1,
          });
        }
        gsap.set(
          [subContentRef.current, factsRef.current, bottomBarRef.current],
          { opacity: 0, y: 32 }
        );
        return;
      }

      const tl = gsap.timeline();
      tl.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: 'expo.out',
        },
        0.05
      );

      if (underlinePathRef.current) {
        tl.fromTo(
          underlinePathRef.current,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.85,
            ease: 'expo.out',
          },
          0.68
        );
      }

      tl.fromTo(
        [subContentRef.current, factsRef.current, bottomBarRef.current],
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: 'expo.out',
        },
        0.42
      );
    }, sceneA);

    return () => ctx.revert();
  }, [ready, reducedMotion]);

  // Scene B: Pinned scrubbed arch portal with responsive matchMedia timelines
  useEffect(() => {
    const stage = portalStageRef.current;
    const clipLayer = portalClipRef.current;
    const scaleLayer = portalImageScaleRef.current;
    const archFrame = archFrameRef.current;
    const chip1 = chip1Ref.current;
    const chip2 = chip2Ref.current;
    const chip3 = chip3Ref.current;
    const endText = portalEndTextRef.current;

    if (
      !stage ||
      !clipLayer ||
      !scaleLayer ||
      !archFrame ||
      !chip1 ||
      !chip2 ||
      !chip3 ||
      !endText
    ) {
      return undefined;
    }

    if (reducedMotion) {
      gsap.set(clipLayer, { clipPath: 'inset(0svh 0vw 0svh 0vw round 0vw 0vw 0vw 0vw)' });
      gsap.set(scaleLayer, { scale: 1, yPercent: 0 });
      gsap.set(archFrame, { opacity: 0 });
      gsap.set([chip1, chip2, chip3], { opacity: 1, y: 0 });
      gsap.set(endText, { opacity: 1, y: 0 });
      return undefined;
    }

    const mm = gsap.matchMedia();

    const buildPortalTimeline = (isDesktop: boolean) => {
      const startClip = isDesktop
        ? 'inset(14svh 31vw 0svh 31vw round 50vw 50vw 0vw 0vw)'
        : 'inset(14svh 7vw 0svh 7vw round 50vw 50vw 0vw 0vw)';
      const endClip = 'inset(0svh 0vw 0svh 0vw round 0vw 0vw 0vw 0vw)';
      const scrollDistance = isDesktop ? '+=160%' : '+=80%';

      gsap.set(clipLayer, { clipPath: startClip, willChange: 'clip-path' });
      gsap.set(scaleLayer, { scale: 1.3, yPercent: 4, willChange: 'transform' });
      gsap.set(archFrame, { opacity: 1, scale: 1 });
      gsap.set([chip1, chip2, chip3], { opacity: 0, y: 24 });
      gsap.set(endText, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: scrollDistance,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onLeave: () => {
            gsap.set([clipLayer, scaleLayer], { willChange: 'auto' });
          },
          onEnterBack: () => {
            gsap.set(clipLayer, { willChange: 'clip-path' });
            gsap.set(scaleLayer, { willChange: 'transform' });
          },
        },
      });

      // Arch portal opens to full viewport while inner image scales 1.3 -> 1.0 and shifts upward
      tl.to(
        clipLayer,
        {
          clipPath: endClip,
          duration: 1,
          ease: 'none',
        },
        0
      )
        .to(
          scaleLayer,
          {
            scale: 1,
            yPercent: -3,
            duration: 1,
            ease: 'none',
          },
          0
        )
        .to(
          archFrame,
          {
            opacity: 0,
            scale: 1.18,
            duration: 0.45,
            ease: 'none',
          },
          0.02
        );

      // Staggered caption chips fade in around the arch and gently recede before final full-bleed text
      tl.to(
        chip1,
        { opacity: 1, y: 0, duration: 0.2, ease: 'none' },
        0.08
      )
        .to(
          chip2,
          { opacity: 1, y: 0, duration: 0.2, ease: 'none' },
          0.22
        )
        .to(
          chip3,
          { opacity: 1, y: 0, duration: 0.2, ease: 'none' },
          0.36
        )
        .to(
          [chip1, chip2, chip3],
          { opacity: 0, y: -16, duration: 0.2, ease: 'none' },
          0.72
        );

      // Final full-bleed headline & sub-line at bottom-left
      tl.to(
        endText,
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          ease: 'none',
        },
        0.74
      );
    };

    mm.add('(min-width: 1024px)', () => {
      buildPortalTimeline(true);
    });

    mm.add('(max-width: 1023px)', () => {
      buildPortalTimeline(false);
    });

    return () => mm.revert();
  }, [reducedMotion]);

  const handleScrollClick = (e: React.MouseEvent<HTMLElement>, target: string) => {
    e.preventDefault();
    scrollToSection(target, -80);
  };

  return (
    <section
      id={SECTION_IDS.hero}
      aria-label="Introduction"
      className="relative w-full bg-paper text-ink"
    >
      {/* SCENE A — First Viewport */}
      <div
        ref={sceneARef}
        className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-10 md:pt-36 md:pb-14"
      >
        {/* Soft dusk radial wash low-right */}
        <div
          aria-hidden="true"
          className="dusk-wash pointer-events-none absolute right-[-10%] bottom-[-15%] h-[75svh] w-[85vw] max-w-[1100px] rounded-full"
        />

        <Container className="relative z-10 my-auto flex flex-col gap-12 pt-4 pb-8">
          {/* Top-left Eyebrow */}
          <div>
            <Eyebrow withPulseDot>{CONTENT.hero.eyebrow}</Eyebrow>
          </div>

          {/* Main grid: Headline + Lead + CTAs on left, 3-row fact list on right on desktop */}
          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <h1
                aria-label="A world that remembers you."
                className="font-sans text-h1 font-medium tracking-[-0.045em] text-ink"
              >
                <span className="split-line-mask">
                  <span ref={line1Ref} className="split-line-inner">
                    A world that
                  </span>
                </span>

                <span className="split-line-mask">
                  <span
                    ref={line2Ref}
                    className="split-line-inner inline-flex flex-col items-start"
                  >
                    <span className="relative inline-block font-serif italic font-normal text-[1.05em] tracking-[-0.02em] text-ink pb-1">
                      remembers
                      <svg
                        viewBox="0 0 320 8"
                        fill="none"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="pointer-events-none absolute left-0 bottom-0 h-[5px] w-full overflow-visible"
                      >
                        <path
                          ref={underlinePathRef}
                          d="M0 4H320"
                          stroke="var(--ember)"
                          strokeWidth="3"
                          strokeLinecap="butt"
                          pathLength="1"
                        />
                      </svg>
                    </span>
                  </span>
                </span>

                <span className="split-line-mask">
                  <span ref={line3Ref} className="split-line-inner">
                    you.
                  </span>
                </span>
              </h1>

              <div ref={subContentRef} className="mt-8 md:mt-10 flex flex-col gap-8">
                <p className="max-w-[36ch] md:max-w-[52ch] text-lead text-ink-soft">
                  {CONTENT.hero.lead}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    icon="arrow"
                    onClick={(e) => handleScrollClick(e, SECTION_IDS.join)}
                  >
                    {CONTENT.hero.primaryCta}
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={(e) => handleScrollClick(e, SECTION_IDS.how)}
                  >
                    {CONTENT.hero.secondaryCta}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right column on desktop / below buttons on mobile: 3-row fact list with hairlines */}
            <div ref={factsRef} className="lg:col-span-4 lg:pb-2">
              <dl className="border-t border-line">
                {CONTENT.hero.facts.map((fact) => (
                  <div
                    key={fact.stage}
                    className="flex items-baseline justify-between gap-6 border-b border-line py-4"
                  >
                    <dt className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft shrink-0">
                      {fact.stage}
                    </dt>
                    <dd className="text-right text-[16px] md:text-[17px] text-ink font-normal">
                      {fact.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>

        {/* Bottom bar: status text on left, Scroll mono indicator with looping line on right */}
        <Container className="relative z-10">
          <div
            ref={bottomBarRef}
            className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-5"
          >
            <p className="text-[16px] md:text-[17px] text-ink-soft">
              {CONTENT.hero.statusLine}
            </p>

            <div className="inline-flex items-center gap-3 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft select-none">
              <span>{CONTENT.hero.scrollLabel}</span>
              <span
                aria-hidden="true"
                className="relative h-7 w-[1.5px] overflow-hidden bg-line block"
              >
                <span className="scroll-line-loop block h-full w-full bg-ink" />
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* SCENE B — The Portal (Pinned, Scrubbed) */}
      <div
        ref={portalStageRef}
        data-cursor="view"
        className="relative h-[100svh] w-full overflow-hidden bg-paper"
      >
        {/* Full-viewport clipped layer that starts as a centered semicircle-top arch window */}
        <div
          ref={portalClipRef}
          className="relative h-full w-full overflow-hidden"
          style={{
            clipPath: 'inset(14svh 31vw 0svh 31vw round 50vw 50vw 0vw 0vw)',
          }}
        >
          <div ref={portalImageScaleRef} className="h-full w-full">
            <Media mediaKey="world-hero" priority fill />
          </div>

          {/* Soft bottom ink scrim (bottom 45%, 55% opacity) so text is always legible */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[45%]"
            style={{
              background:
                'linear-gradient(to top, rgba(20, 21, 26, 0.55) 0%, rgba(20, 21, 26, 0.28) 55%, rgba(20, 21, 26, 0) 100%)',
            }}
          />
        </div>

        {/* Thin ink arch outline framing the window at the start */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center"
        >
          <svg
            ref={archFrameRef}
            viewBox="0 0 560 720"
            fill="none"
            preserveAspectRatio="none"
            className="h-[86svh] w-[86vw] lg:w-[38vw] max-w-[560px] text-ink"
          >
            <path
              d="M 1 720 L 1 280 A 279 279 0 0 1 559 280 L 559 720"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Three caption chips that fade and slide in around the arch */}
        <div
          aria-hidden={reducedMotion ? undefined : 'true'}
          className="pointer-events-none absolute inset-0 z-30 mx-auto max-w-[1280px] px-6"
        >
          <div
            ref={chip1Ref}
            className="absolute left-6 top-[22svh] md:left-[12%] md:top-[28svh] rounded-full border border-line bg-paper px-4 py-2 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink shadow-pill"
          >
            {CONTENT.hero.portalChips[0]}
          </div>

          <div
            ref={chip2Ref}
            className="absolute right-6 top-[38svh] md:right-[11%] md:top-[44svh] rounded-full border border-line bg-paper px-4 py-2 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink shadow-pill"
          >
            {CONTENT.hero.portalChips[1]}
          </div>

          <div
            ref={chip3Ref}
            className="absolute left-8 bottom-[22svh] md:left-[16%] md:bottom-[24svh] rounded-full border border-line bg-paper px-4 py-2 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink shadow-pill"
          >
            {CONTENT.hero.portalChips[2]}
          </div>
        </div>

        {/* Portal fully open bottom-left text */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 pb-12 md:pb-16">
          <Container>
            <div ref={portalEndTextRef} className="max-w-[640px]">
              <h2 className="font-sans text-h2 font-medium tracking-[-0.04em] text-paper">
                {CONTENT.hero.portalEndTitle}
              </h2>
              <p className="mt-4 text-lead text-paper/90">
                {CONTENT.hero.portalEndSubline}
              </p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};
