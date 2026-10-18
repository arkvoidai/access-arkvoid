import React, { useEffect, useRef } from 'react';
import { SECTION_IDS, SITE } from '../../config/site.config';
import { CONTENT } from '../../content/site';
import { gsap } from '../../lib/gsap';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { getLenis, scrollToSection } from '../../lib/smooth';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    if (isOpen) {
      document.body.classList.add('scroll-locked');
      getLenis()?.stop();
      window.setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      if (!reducedMotion) {
        const items = overlay.querySelectorAll('.mobile-nav-item-inner');
        gsap.fromTo(
          overlay,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'expo.out' }
        );
        gsap.fromTo(
          items,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.06,
            ease: 'expo.out',
            delay: 0.08,
          }
        );
      }
    } else {
      document.body.classList.remove('scroll-locked');
      getLenis()?.start();
    }

    return () => {
      document.body.classList.remove('scroll-locked');
      getLenis()?.start();
    };
  }, [isOpen, reducedMotion]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = Array.from(
          overlayRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    window.setTimeout(() => {
      scrollToSection(href, -80);
    }, 80);
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[80] flex flex-col justify-between bg-paper text-ink px-6 py-6 overflow-y-auto"
      style={{
        paddingTop: 'max(24px, env(safe-area-inset-top))',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Top bar with logo and accessible close button */}
      <div className="flex items-center justify-between border-b border-line pb-5">
        <a
          href={`#${SECTION_IDS.hero}`}
          onClick={(e) => handleNavClick(e, `#${SECTION_IDS.hero}`)}
          className="inline-flex items-center text-ink"
        >
          <Logo variant="lockup" size={26} />
        </a>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="inline-flex h-12 min-w-[48px] items-center justify-center rounded-full border border-line px-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
        >
          Close
        </button>
      </div>

      {/* Masked numbered navigation links 01 to 07 */}
      <nav aria-label="Mobile primary" className="my-auto py-8">
        <ul className="flex flex-col gap-3">
          {CONTENT.nav.links.map((item, idx) => {
            const numberLabel = String(idx + 1).padStart(2, '0');
            return (
              <li key={item.id} className="overflow-hidden">
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="mobile-nav-item-inner group flex items-baseline gap-4 py-1 text-ink transition-colors hover:text-ember-deep"
                >
                  <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft tabular-nums">
                    {numberLabel}
                  </span>
                  <span
                    className="font-sans font-medium tracking-[-0.04em]"
                    style={{ fontSize: 'clamp(2.4rem, 7vw, 3.5rem)', lineHeight: 1.05 }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom actions: waitlist button, X link, and email */}
      <div className="flex flex-col gap-6 border-t border-line pt-6">
        <Button
          variant="primary"
          size="lg"
          icon="arrow"
          href={`#${SECTION_IDS.join}`}
          onClick={(e) => {
            e.preventDefault();
            onClose();
            window.setTimeout(() => {
              scrollToSection(`#${SECTION_IDS.join}`, -80);
            }, 80);
          }}
          className="w-full"
        >
          {CONTENT.nav.cta}
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
          <a
            href={SITE.x.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] inline-flex items-center text-violet-deep hover:underline"
          >
            X ({SITE.x.handle})
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="min-h-[48px] inline-flex items-center text-violet-deep hover:underline"
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </div>
  );
};
