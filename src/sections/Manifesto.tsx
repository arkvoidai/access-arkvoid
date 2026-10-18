import React, { useEffect, useMemo, useRef } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT } from '../content/site';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';

interface ParsedToken {
  text: string;
  italic: boolean;
}

export const Manifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const tokens = useMemo<ParsedToken[]>(() => {
    return CONTENT.manifesto.paragraph
      .trim()
      .split(/\s+/)
      .map((raw) => {
        if (raw.startsWith('*') && raw.includes('*')) {
          const clean = raw.replace(/\*/g, '');
          return { text: clean, italic: true };
        }
        return { text: raw, italic: false };
      });
  }, []);

  const plainAriaText = useMemo(
    () => CONTENT.manifesto.paragraph.replace(/\*/g, ''),
    []
  );

  useEffect(() => {
    const section = sectionRef.current;
    const paragraph = paragraphRef.current;
    const emberLine = lineRef.current;
    if (!section || !paragraph || !emberLine) return undefined;

    const wordEls = Array.from(
      paragraph.querySelectorAll<HTMLElement>('.manifesto-word')
    );

    if (reducedMotion) {
      gsap.set(wordEls, { opacity: 1 });
      gsap.set(emberLine, { scaleX: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(wordEls, { opacity: 0.18 });
      gsap.set(emberLine, { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: paragraph,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: 0.6,
        },
      });

      tl.to(
        wordEls,
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'none',
        },
        0
      );

      tl.to(
        emberLine,
        {
          scaleX: 1,
          duration: 0.6,
          ease: 'none',
        },
        '>-0.1'
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.manifesto}
      aria-label="Why Arkvoid"
      className="relative w-full bg-paper text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(96px, 14vw, 220px)',
        paddingBottom: 'clamp(96px, 14vw, 220px)',
      }}
    >
      <Container>
        <div className="flex flex-col gap-10 md:gap-14">
          <div>
            <Eyebrow>{CONTENT.manifesto.eyebrow}</Eyebrow>
          </div>

          <p
            ref={paragraphRef}
            aria-label={plainAriaText}
            className="max-w-[20ch] font-sans font-medium text-ink text-left"
            style={{
              fontSize: 'clamp(2rem, 1rem + 4.2vw, 5rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
            }}
          >
            {tokens.map((token, idx) => (
              <React.Fragment key={idx}>
                <span
                  aria-hidden="true"
                  className={`manifesto-word inline-block transition-none ${
                    token.italic
                      ? 'font-serif italic font-normal text-[1.05em] tracking-[-0.015em]'
                      : ''
                  }`}
                >
                  {token.text}
                </span>
                {idx < tokens.length - 1 ? ' ' : ''}
              </React.Fragment>
            ))}
          </p>

          <div className="pt-4 md:pt-8">
            <div
              ref={lineRef}
              aria-hidden="true"
              className="h-[1.5px] w-full bg-ember origin-left"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
