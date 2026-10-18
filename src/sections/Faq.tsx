import React, { useMemo, useState } from 'react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SECTION_IDS } from '../config/site.config';
import { CONTENT } from '../content/site';
import { SplitHeading } from '../lib/split';

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = CONTENT.faq.items;

  // Dynamic FAQPage JSON-LD generated from the same content array
  const faqJsonLd = useMemo(() => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }, [items]);

  const toggleIndex = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id={SECTION_IDS.faq}
      aria-label="Frequently Asked Questions"
      className="relative w-full bg-[#FFFFFF] text-ink border-t border-line"
      style={{
        paddingTop: 'clamp(96px, 14vw, 220px)',
        paddingBottom: 'clamp(96px, 14vw, 220px)',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />

      <Container>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left column: Sticky heading */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <Eyebrow>{CONTENT.faq.eyebrow}</Eyebrow>
            <div className="mt-4">
              <SplitHeading
                as="h2"
                text={CONTENT.faq.heading}
                className="font-sans text-h2 font-medium tracking-[-0.04em] text-ink"
              />
            </div>
          </div>

          {/* Right column: Accessible single-open accordion */}
          <div className="lg:col-span-8 border-t border-line">
            {items.map((item, idx) => {
              const isOpen = openIndex === idx;
              const panelId = `faq-panel-${idx}`;
              const buttonId = `faq-button-${idx}`;

              return (
                <div key={item.question} className="border-b border-line">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleIndex(idx)}
                      className="group flex min-h-[68px] w-full items-center justify-between gap-6 py-5 text-left text-ink transition-colors hover:text-ember-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-deep"
                    >
                      <span
                        className="font-sans font-medium tracking-[-0.025em]"
                        style={{
                          fontSize: 'clamp(1.25rem, 1rem + 1vw, 1.9rem)',
                          lineHeight: 1.2,
                        }}
                      >
                        {item.question}
                      </span>

                      {/* Plus icon that rotates to a minus */}
                      <span
                        aria-hidden="true"
                        className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors group-hover:border-ink"
                      >
                        <span className="block h-[1.5px] w-3.5 bg-current" />
                        <span
                          className={`absolute block h-3.5 w-[1.5px] bg-current transition-transform duration-300 ease-expo-out ${
                            isOpen ? 'rotate-90 scale-y-0' : 'rotate-0 scale-y-100'
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-expo-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-8 text-body text-ink-soft max-w-[62ch]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
