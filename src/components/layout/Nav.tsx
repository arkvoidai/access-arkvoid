import React, { useEffect, useRef, useState } from 'react';
import { SECTION_IDS, type SectionId } from '../../config/site.config';
import { CONTENT } from '../../content/site';
import { scrollToSection } from '../../lib/smooth';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { MobileMenu } from './MobileMenu';

export const Nav: React.FC = () => {
  const [hidden, setHidden] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<SectionId>(SECTION_IDS.hero);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY < 80) {
        setHidden(false);
      } else if (delta > 8) {
        setHidden(true);
      } else if (delta < -8) {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observedIds = CONTENT.nav.links.map((l) => l.id);
    const elements = observedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0 }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    scrollToSection(href, -80);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[70] flex justify-center px-4 pt-4 pointer-events-none transition-transform duration-500 ease-expo-out ${
          hidden ? '-translate-y-[120%]' : 'translate-y-0'
        }`}
        style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
      >
        <div
          className="pointer-events-auto flex w-full max-w-[1180px] items-center justify-between gap-6 rounded-full border border-line bg-paper/80 px-4 py-2.5 shadow-pill"
          style={{
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          {/* Left: Lockup Logo */}
          <a
            href={`#${SECTION_IDS.hero}`}
            onClick={(e) => handleAnchor(e, `#${SECTION_IDS.hero}`)}
            className="inline-flex min-h-[44px] items-center pl-2 text-ink shrink-0"
          >
            <Logo variant="lockup" size={26} />
          </a>

          {/* Middle: Desktop links */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-6 xl:gap-7"
          >
            {CONTENT.nav.links.map((link) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleAnchor(e, link.href)}
                  className="relative inline-flex min-h-[40px] items-center text-[15px] font-normal text-ink-soft transition-colors duration-300 hover:text-ink whitespace-nowrap shrink-0"
                >
                  <span className={isActive ? 'text-ink font-medium' : ''}>
                    {link.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -bottom-0.5 left-1/2 -ml-[2.5px] h-[5px] w-[5px] rounded-full bg-ember transition-transform duration-300 ease-expo-out ${
                      isActive ? 'scale-100' : 'scale-0'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Right: Desktop primary button / Mobile menu button */}
          <div className="flex items-center shrink-0">
            <div className="hidden lg:block">
              <Button
                variant="primary"
                size="md"
                icon="arrow"
                href={`#${SECTION_IDS.join}`}
                onClick={(e) => handleAnchor(e, `#${SECTION_IDS.join}`)}
              >
                {CONTENT.nav.cta}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="lg:hidden inline-flex h-[48px] w-[48px] flex-col items-center justify-center gap-[6px] rounded-full border border-line text-ink transition-colors hover:border-ink"
            >
              <span aria-hidden="true" className="block h-[1.5px] w-5 bg-ink" />
              <span aria-hidden="true" className="block h-[1.5px] w-5 bg-ink" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};
