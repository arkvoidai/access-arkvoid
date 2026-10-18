import React, { useEffect, useRef, useState } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT, type WhyNowTile } from '../content/site';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

interface StatTileProps {
  tile: WhyNowTile;
  reducedMotion: boolean;
}

const StatTile: React.FC<StatTileProps> = ({ tile, reducedMotion }) => {
  const tileRef = useRef<HTMLElement>(null);
  const slideTextRef = useRef<HTMLSpanElement>(null);
  const [formattedValue, setFormattedValue] = useState<string>(() => {
    if (reducedMotion || tile.numericValue === undefined) {
      return tile.displayValue;
    }
    return `${tile.prefix || ''}0.0${tile.suffix || ''}`;
  });

  useEffect(() => {
    const el = tileRef.current;
    if (!el || reducedMotion) {
      setFormattedValue(tile.displayValue);
      return undefined;
    }

    const ctx = gsap.context(() => {
      if (tile.numericValue !== undefined) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: tile.numericValue,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            const fixed = obj.val.toFixed(tile.decimals ?? 1);
            setFormattedValue(`${tile.prefix || ''}${fixed}${tile.suffix || ''}`);
          },
        });
      } else if (slideTextRef.current) {
        gsap.fromTo(
          slideTextRef.current,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [
    reducedMotion,
    tile.displayValue,
    tile.numericValue,
    tile.prefix,
    tile.suffix,
    tile.decimals,
  ]);

  const isInk = tile.theme === 'ink';

  return (
    <article
      ref={tileRef}
      className={`flex h-full flex-col justify-between gap-10 rounded-card p-7 sm:p-10 ${
        isInk
          ? 'border border-white/[0.08] bg-ink text-paper shadow-soft'
          : 'border border-line bg-[#FFFFFF] text-ink shadow-soft'
      }`}
    >
      <div>
        <div
          aria-label={tile.displayValue}
          className="overflow-hidden pb-1"
        >
          <span
            ref={slideTextRef}
            aria-hidden="true"
            className={`block font-sans font-medium tracking-[-0.045em] tabular-nums ${
              isInk ? 'text-paper' : 'text-ink'
            }`}
            style={{
              fontSize: 'clamp(3.6rem, 1.8rem + 5.2vw, 6.8rem)',
              lineHeight: 0.96,
            }}
          >
            {formattedValue}
          </span>
        </div>

        <p
          className={`mt-5 text-body ${
            isInk ? 'text-paper/80' : 'text-ink-soft'
          }`}
        >
          {tile.description}
        </p>
      </div>

      <div
        className={`border-t pt-4 font-mono text-[12px] uppercase tracking-[0.14em] ${
          isInk ? 'border-white/10 text-paper/65' : 'border-line text-ink-soft'
        }`}
      >
        <span className="block mb-1.5">
          {tile.sources.length > 1 ? 'Sources' : 'Source'}
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {tile.sources.map((src) => (
            <a
              key={src.url}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 underline underline-offset-4 transition-opacity hover:opacity-80 ${
                isInk ? 'text-paper' : 'text-violet-deep'
              }`}
            >
              <span>{src.label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
};

export const WhyNow: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id={SECTION_IDS.whyNow}
      aria-label="Why now"
      className="relative w-full bg-[#FFFFFF] text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(96px, 14vw, 220px)',
        paddingBottom: 'clamp(96px, 14vw, 220px)',
      }}
    >
      <Container>
        <div className="mb-14 md:mb-20 max-w-[880px]">
          <Eyebrow>{CONTENT.whyNow.eyebrow}</Eyebrow>
          <div className="mt-4">
            <SplitHeading
              as="h2"
              text={CONTENT.whyNow.heading}
              className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
            />
          </div>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[54ch] text-lead text-ink-soft">
              {CONTENT.whyNow.lead}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {CONTENT.whyNow.tiles.map((tile) => (
            <StatTile
              key={tile.id}
              tile={tile}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <p className="mt-8 text-[14px] md:text-[15px] text-ink-soft">
          {CONTENT.whyNow.footnote}
        </p>
      </Container>
    </section>
  );
};
