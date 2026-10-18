import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { MEDIA } from '../config/media';
import { SECTION_IDS, SITE } from '../config/site.config';
import { CONTENT } from '../content/site';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';

export const Founder: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const portraitParallaxRef = useRef<HTMLDivElement>(null);
  const nameLineRef = useRef<HTMLSpanElement>(null);
  const quoteLinesWrapRef = useRef<HTMLQuoteElement>(null);

  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading'
  );
  const founderEntry = MEDIA.founder;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const quoteLines = quoteLinesWrapRef.current
      ? Array.from(
          quoteLinesWrapRef.current.querySelectorAll<HTMLElement>(
            '.founder-quote-line-inner'
          )
        )
      : [];

    const ctx = gsap.context(() => {
      if (portraitParallaxRef.current) {
        gsap.fromTo(
          portraitParallaxRef.current,
          { yPercent: -5, scale: 1.08 },
          {
            yPercent: 5,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );
      }

      if (nameLineRef.current) {
        gsap.fromTo(
          nameLineRef.current,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      if (quoteLines.length > 0) {
        gsap.fromTo(
          quoteLines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            stagger: 0.14,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: quoteLinesWrapRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.founder}
      aria-label="The Founder"
      className="relative w-full bg-paper text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(96px, 14vw, 220px)',
        paddingBottom: 'clamp(96px, 14vw, 220px)',
      }}
    >
      <Container>
        <div className="mb-10">
          <Eyebrow>{CONTENT.founder.eyebrow}</Eyebrow>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left 40% (5 of 12 cols): Arch-shaped portrait frame with MT monogram fallback */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-t-full bg-paper-2">
              <div
                ref={portraitParallaxRef}
                className="relative h-full w-full flex items-center justify-center"
              >
                {/* Monogram MT in Instrument Serif italic shown when founder.webp is not yet uploaded */}
                <div
                  aria-hidden={imgStatus === 'loaded' ? 'true' : undefined}
                  role={imgStatus === 'error' ? 'img' : undefined}
                  aria-label={
                    imgStatus === 'error' ? founderEntry.alt : undefined
                  }
                  className={`absolute inset-0 flex flex-col items-center justify-center bg-paper-2 transition-opacity duration-500 ${
                    imgStatus === 'loaded'
                      ? 'opacity-0 pointer-events-none'
                      : 'opacity-100'
                  }`}
                >
                  <span
                    className="font-serif italic text-ink select-none"
                    style={{ fontSize: 'clamp(4.5rem, 8vw, 7rem)', lineHeight: 1 }}
                  >
                    {CONTENT.founder.monogram}
                  </span>
                </div>

                {imgStatus !== 'error' && (
                  <img
                    src={founderEntry.src}
                    alt={founderEntry.alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImgStatus('loaded')}
                    onError={() => setImgStatus('error')}
                    style={{ objectPosition: founderEntry.focal }}
                    className={`relative z-10 h-full w-full object-cover transition-opacity duration-500 ${
                      imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </div>

              {/* Thin ink arch outline */}
              <svg
                viewBox="0 0 400 500"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 h-full w-full text-ink"
              >
                <path
                  d="M 1 499 L 1 200 A 199 199 0 0 1 399 200 L 399 499 Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>

          {/* Right 60% (7 of 12 cols): Name, Role, Quote Note, and Links */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <h2 className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink">
                <span className="split-line-mask">
                  <span ref={nameLineRef} className="split-line-inner">
                    {CONTENT.founder.name}
                  </span>
                </span>
              </h2>
              <p className="mt-3 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
                {CONTENT.founder.role}
              </p>
            </div>

            <blockquote
              ref={quoteLinesWrapRef}
              className="mt-2 flex flex-col gap-3 text-lead text-ink"
            >
              {CONTENT.founder.noteLines.map((line) => (
                <span key={line} className="split-line-mask">
                  <span className="founder-quote-line-inner split-line-inner block">
                    {line}
                  </span>
                </span>
              ))}
            </blockquote>

            {import.meta.env.DEV && (
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft/70">
                {CONTENT.founder.devNotice}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-line pt-6">
              <Button
                variant="link"
                icon="arrow"
                href={SITE.x.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTENT.founder.xLabel}
              </Button>

              <Button
                variant="link"
                icon="arrow"
                href={`mailto:${SITE.email}`}
              >
                {CONTENT.founder.emailLabel}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
