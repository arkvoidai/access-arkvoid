import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SECTION_IDS, SHOW_ROUND_SIZE } from '../config/site.config';
import { CONTENT, type InvestorBarItem } from '../content/site';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Reveal, SplitHeading } from '../lib/split';

interface AllocationRowProps {
  item: InvestorBarItem;
  index: number;
  reducedMotion: boolean;
}

const AllocationRow: React.FC<AllocationRowProps> = ({
  item,
  index,
  reducedMotion,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState<number>(reducedMotion ? item.percent : 0);

  useEffect(() => {
    if (reducedMotion) {
      setVal(item.percent);
      return undefined;
    }

    const row = rowRef.current;
    if (!row) return undefined;

    const counter = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: item.percent,
        duration: 1.2,
        delay: index * 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 90%',
          once: true,
        },
        onUpdate: () => {
          setVal(Math.round(counter.n));
        },
      });

      if (barRef.current) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          {
            scaleX: item.percent / 100,
            duration: 1.2,
            delay: index * 0.08,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }
    }, row);

    return () => ctx.revert();
  }, [reducedMotion, item.percent, index]);

  return (
    <div ref={rowRef} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[16px] md:text-[17px] text-ink">{item.label}</span>
        <span
          aria-label={`${item.percent}%`}
          className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink tabular-nums shrink-0"
        >
          {val}%
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-paper-2">
        <div
          ref={barRef}
          className="h-full w-full bg-ember origin-left"
          style={{
            transform: `scaleX(${reducedMotion ? item.percent / 100 : 0})`,
          }}
        />
      </div>
    </div>
  );
};

export const Investors: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const gatesWrapRef = useRef<HTMLDivElement>(null);
  const connectorLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = gatesWrapRef.current;
    const line = connectorLineRef.current;
    if (!wrap || !line || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id={SECTION_IDS.investors}
      aria-label="Investors"
      className="relative w-full bg-paper-2 text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(96px, 14vw, 220px)',
        paddingBottom: 'clamp(96px, 14vw, 220px)',
      }}
    >
      <Container>
        {/* Header */}
        <div className="mb-14 md:mb-20 max-w-[880px]">
          <Eyebrow>{CONTENT.investors.eyebrow}</Eyebrow>
          <div className="mt-4">
            <SplitHeading
              as="h2"
              text={CONTENT.investors.heading}
              className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
            />
          </div>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[54ch] text-lead text-ink-soft">
              {CONTENT.investors.lead}
            </p>
          </Reveal>
        </div>

        {/* D1. Three gates connected by a thin drawing line */}
        <div ref={gatesWrapRef} className="relative">
          <div
            ref={connectorLineRef}
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute left-[12%] right-[12%] top-1/2 -mt-[0.5px] h-[1.5px] bg-ember origin-left z-0"
          />

          <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {CONTENT.investors.gates.map((gate, idx) => (
              <Reveal key={gate.number} delay={idx * 0.1}>
                <article className="flex h-full flex-col justify-between gap-6 rounded-card border border-line bg-[#FFFFFF] p-7 sm:p-9 shadow-soft">
                  <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-ember-deep tabular-nums">
                    {gate.number}
                  </span>
                  <div>
                    <h3 className="font-sans text-h3 font-medium tracking-[-0.03em] text-ink">
                      {gate.title}
                    </h3>
                    <p className="mt-3 text-body text-ink-soft">{gate.test}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* D2. What the first round pays for */}
        <div className="mt-10 md:mt-14 rounded-card border border-line bg-[#FFFFFF] p-7 sm:p-10 lg:p-14 shadow-soft">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div>
                <h3 className="font-sans text-h3 font-medium tracking-[-0.03em] text-ink">
                  {CONTENT.investors.roundPanel.heading}
                </h3>
                <p className="mt-4 text-body text-ink-soft">
                  {CONTENT.investors.roundPanel.leftBody}
                </p>
              </div>

              <p className="border-t border-line pt-4 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
                {SHOW_ROUND_SIZE
                  ? CONTENT.investors.roundPanel.leftMono
                  : CONTENT.investors.roundPanel.leftMono}
              </p>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
              {CONTENT.investors.roundPanel.bars.map((bar, idx) => (
                <AllocationRow
                  key={bar.label}
                  item={bar}
                  index={idx}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>
        </div>

        {/* D3. What could go wrong, in plain words */}
        <Reveal delay={0.08} className="mt-10 md:mt-14">
          <div className="rounded-card border border-line bg-[#FFFFFF] p-7 sm:p-10 lg:p-12 shadow-soft">
            <h3 className="font-sans text-h3 font-medium tracking-[-0.03em] text-ink">
              {CONTENT.investors.risks.title}
            </h3>

            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {CONTENT.investors.risks.items.map((risk) => (
                <li
                  key={risk}
                  className="flex items-start gap-3.5 text-[16px] md:text-[17px] text-ink-soft"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2 w-2 rounded-full bg-violet-deep shrink-0"
                  />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 border-t border-line pt-5 text-[16px] md:text-[17px] font-medium text-ink">
              {CONTENT.investors.risks.closing}
            </p>
          </div>
        </Reveal>

        {/* D4. Actions */}
        <Reveal delay={0.1} className="mt-12 md:mt-16">
          <div className="flex flex-col items-start gap-5">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                icon="arrow"
                href={CONTENT.investors.actions.primaryHref}
              >
                {CONTENT.investors.actions.primaryLabel}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                href={CONTENT.investors.actions.secondaryHref}
              >
                {CONTENT.investors.actions.secondaryLabel}
              </Button>
            </div>

            <p className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
              {CONTENT.investors.actions.caption}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
