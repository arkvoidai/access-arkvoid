import React, { useEffect, useRef, useState } from 'react';
import { SITE, type SectionId } from '../../config/site.config';
import { CONTENT } from '../../content/site';
import { gsap } from '../../lib/gsap';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { getLenis, scrollToSection, scrollToTop } from '../../lib/smooth';
import { Container } from '../ui/Container';
import { Logo } from '../ui/Logo';

type LegalKey = 'privacy' | 'terms' | 'notices';

export const Footer: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const wordmarkWrapRef = useRef<HTMLDivElement>(null);
  const emberCoreRef = useRef<HTMLSpanElement>(null);

  const [activeLegalKey, setActiveLegalKey] = useState<LegalKey | null>(null);
  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Giant wordmark scroll reveal + slow parallax
  useEffect(() => {
    const wrap = wordmarkWrapRef.current;
    if (!wrap || reducedMotion) return undefined;

    const letters = Array.from(
      wrap.querySelectorAll<HTMLElement>('.footer-wordmark-letter')
    );

    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 90%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        wrap,
        { yPercent: 6 },
        {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        }
      );

      if (emberCoreRef.current) {
        gsap.fromTo(
          emberCoreRef.current,
          { scale: 0.5 },
          {
            scale: 1.4,
            duration: 0.55,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, wrap);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Modal focus trap, scroll lock, Escape close, and focus restoration
  useEffect(() => {
    if (!activeLegalKey) return undefined;

    document.body.classList.add('scroll-locked');
    getLenis()?.stop();

    const timer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveLegalKey(null);
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('scroll-locked');
      getLenis()?.start();
      triggerBtnRef.current?.focus();
    };
  }, [activeLegalKey]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTop();
  };

  const handleExploreClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: SectionId
  ) => {
    e.preventDefault();
    scrollToSection(sectionId, -80);
  };

  const handleBackToTop = () => {
    scrollToTop();
  };

  const activeLegalDoc = CONTENT.footer.legalLinks.find(
    (item) => item.key === activeLegalKey
  );

  const wordmarkTokens = ['A', 'R', 'K', 'V', 'O', 'I', 'D'];

  return (
    <footer className="relative w-full overflow-hidden border-t border-line bg-paper-2 text-ink pt-16 pb-12 md:pt-24 md:pb-16">
      <Container>
        {/* Top Row: Lockup logo & short line */}
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-12 md:flex-row md:items-center">
          <a
            href="/"
            onClick={handleLogoClick}
            className="inline-flex items-center text-ink"
          >
            <Logo variant="lockup" size={28} />
          </a>

          <p className="text-[17px] text-ink-soft">{CONTENT.footer.tagline}</p>
        </div>

        {/* Columns: Explore, Connect, Legal */}
        <div className="grid grid-cols-1 gap-10 border-b border-line py-12 sm:grid-cols-3">
          {/* Explore */}
          <div>
            <h3 className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
              {CONTENT.footer.exploreHeading}
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-1">
              {CONTENT.footer.exploreLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href="/"
                    onClick={(e) => handleExploreClick(e, link.id)}
                    className="inline-flex py-0.5 text-[16px] text-ink transition-colors hover:text-ember-deep"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
              {CONTENT.footer.connectHeading}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={SITE.x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex py-0.5 text-[16px] text-violet-deep hover:underline"
                >
                  X {SITE.x.handle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex py-0.5 text-[16px] text-violet-deep hover:underline"
                >
                  Email {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft">
              {CONTENT.footer.legalHeading}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {CONTENT.footer.legalLinks.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={(e) => {
                      triggerBtnRef.current = e.currentTarget;
                      setActiveLegalKey(item.key);
                    }}
                    className="inline-flex py-0.5 text-[16px] text-ink transition-colors hover:text-ember-deep"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Giant Full-Width Wordmark Row: ARKVOID with Ring O */}
        <div
          ref={wordmarkWrapRef}
          aria-label="Arkvoid"
          className="my-10 md:my-14 w-full overflow-hidden select-none"
        >
          <div
            aria-hidden="true"
            className="flex w-full items-center justify-between font-sans font-medium uppercase text-ink"
            style={{
              fontSize: 'clamp(3.2rem, 15.5vw, 17.5rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
            }}
          >
            {wordmarkTokens.map((char, idx) => {
              if (char === 'O') {
                return (
                  <span
                    key={idx}
                    className="inline-flex overflow-hidden py-2 items-center justify-center"
                  >
                    <span className="footer-wordmark-letter inline-flex items-center justify-center">
                      <span
                        className="relative inline-flex items-center justify-center rounded-full border-current"
                        style={{
                          width: '0.74em',
                          height: '0.74em',
                          borderWidth: '0.11em',
                          borderStyle: 'solid',
                        }}
                      >
                        <span
                          ref={emberCoreRef}
                          className="rounded-full bg-ember block"
                          style={{ width: '0.2em', height: '0.2em' }}
                        />
                      </span>
                    </span>
                  </span>
                );
              }

              return (
                <span key={idx} className="inline-block overflow-hidden py-2">
                  <span className="footer-wordmark-letter inline-block">
                    {char}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: Copyright, Back to Top, and Disclaimer */}
        <div className="flex flex-col gap-6 border-t border-line pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-[16px] text-ink">
              {CONTENT.footer.copyright}
            </span>

            <button
              type="button"
              onClick={handleBackToTop}
              className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-line bg-paper px-4 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
            >
              <span>{CONTENT.footer.backToTop}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              >
                <path
                  d="M7 11.5V2.5M7 2.5L3.5 6M7 2.5L10.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <p className="text-[13px] leading-[1.5] text-ink-soft max-w-[88ch]">
            {CONTENT.footer.disclaimer}
          </p>
        </div>
      </Container>

      {/* Accessible Legal Modal Dialog */}
      {activeLegalDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-dialog-title"
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/55 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveLegalKey(null);
            }
          }}
        >
          <div
            ref={dialogRef}
            className="w-full max-w-[560px] rounded-card border border-line bg-paper p-7 sm:p-10 text-ink shadow-soft"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
              <h2
                id="legal-dialog-title"
                className="font-sans text-[24px] font-medium tracking-[-0.025em] text-ink"
              >
                {activeLegalDoc.title}
              </h2>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setActiveLegalKey(null)}
                aria-label="Close dialog"
                className="inline-flex h-11 min-w-[44px] items-center justify-center rounded-full border border-line bg-[#FFFFFF] px-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
              >
                Close
              </button>
            </div>

            <p className="mt-5 text-body text-ink-soft">{activeLegalDoc.body}</p>

            {import.meta.env.DEV && (
              <p className="mt-6 border-t border-line pt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft/75">
                {CONTENT.footer.devLegalNote}
              </p>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
