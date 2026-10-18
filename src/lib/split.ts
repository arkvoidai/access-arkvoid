import React, { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from './gsap';
import { usePrefersReducedMotion } from './hooks';

export interface SplitResult {
  words: HTMLElement[];
  lines: HTMLElement[];
  revert: () => void;
}

/**
 * Wraps every word of an element in <span class="w"><span class="wi">word</span></span>
 * while preserving accessibility on the container via aria-label and aria-hidden on pieces.
 */
export function splitWords(el: HTMLElement): SplitResult {
  const originalHtml = el.innerHTML;
  const originalAriaLabel = el.getAttribute('aria-label');
  const plainText = (el.textContent || '').trim().replace(/\s+/g, ' ');

  if (!originalAriaLabel && plainText) {
    el.setAttribute('aria-label', plainText);
  }

  const tokens = plainText.split(' ').filter(Boolean);
  el.innerHTML = '';

  const wordInners: HTMLElement[] = [];

  tokens.forEach((token, idx) => {
    const outer = document.createElement('span');
    outer.className = 'w';
    outer.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('span');
    inner.className = 'wi';

    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      inner.textContent = token.slice(1, -1);
      inner.classList.add('font-serif', 'italic', 'text-[1.05em]', 'font-normal');
    } else {
      inner.textContent = token;
    }

    outer.appendChild(inner);
    el.appendChild(outer);
    wordInners.push(inner);

    if (idx < tokens.length - 1) {
      const space = document.createTextNode(' ');
      el.appendChild(space);
    }
  });

  return {
    words: wordInners,
    lines: [],
    revert() {
      el.innerHTML = originalHtml;
      if (originalAriaLabel === null) {
        el.removeAttribute('aria-label');
      } else {
        el.setAttribute('aria-label', originalAriaLabel);
      }
    },
  };
}

/**
 * Groups rendered words into visual lines based on offsetTop and wraps each line's inner words.
 * Re-calculates on resize when needed.
 */
export function splitLines(el: HTMLElement): SplitResult {
  const wordSplit = splitWords(el);
  const outerSpans = Array.from(el.querySelectorAll<HTMLElement>(':scope > span.w'));

  if (outerSpans.length === 0) {
    return wordSplit;
  }

  const lineGroups: HTMLElement[][] = [];
  let currentTop: number | null = null;
  let currentGroup: HTMLElement[] = [];

  outerSpans.forEach((span) => {
    const top = Math.round(span.offsetTop);
    if (currentTop === null || Math.abs(top - currentTop) <= 4) {
      currentTop = top;
      currentGroup.push(span);
    } else {
      lineGroups.push(currentGroup);
      currentGroup = [span];
      currentTop = top;
    }
  });

  if (currentGroup.length > 0) {
    lineGroups.push(currentGroup);
  }

  el.innerHTML = '';
  const lineElements: HTMLElement[] = [];

  lineGroups.forEach((group) => {
    const lineMask = document.createElement('span');
    lineMask.className = 'split-line-mask';
    lineMask.setAttribute('aria-hidden', 'true');

    const lineInner = document.createElement('span');
    lineInner.className = 'split-line-inner wi';

    group.forEach((wordSpan, idx) => {
      const innerWord = wordSpan.querySelector('.wi');
      if (innerWord) {
        const clone = document.createElement('span');
        clone.className = innerWord.className.replace(/\bwi\b/g, '').trim();
        clone.textContent = innerWord.textContent;
        lineInner.appendChild(clone);
      }
      if (idx < group.length - 1) {
        lineInner.appendChild(document.createTextNode(' '));
      }
    });

    lineMask.appendChild(lineInner);
    el.appendChild(lineMask);
    lineElements.push(lineInner);
  });

  return {
    words: wordSplit.words,
    lines: lineElements,
    revert: wordSplit.revert,
  };
}

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({ children, className = '', delay = 0, y = 40 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y, reducedMotion]);

  return React.createElement('div', { ref, className }, children);
}

export interface SplitHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  delay?: number;
}

export function SplitHeading({
  text,
  as = 'h2',
  className = '',
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return undefined;

    let splitInstance = splitLines(el);
    let resizeTimer: number | undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        splitInstance.lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.12,
          delay,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }, el);

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        splitInstance.revert();
        splitInstance = splitLines(el);
        gsap.set(splitInstance.lines, { yPercent: 0 });
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(resizeTimer);
      ctx.revert();
      splitInstance.revert();
    };
  }, [text, delay, reducedMotion]);

  const cleanAria = text.replace(/\*/g, '');
  const parts = text.split(/(\*[^*]+\*)/g);

  const renderedChildren = parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return React.createElement(
        'em',
        {
          key: index,
          className: 'font-serif italic text-[1.05em] font-normal not-italic',
          style: { fontStyle: 'italic' },
        },
        part.slice(1, -1)
      );
    }
    return part;
  });

  return React.createElement(
    as,
    {
      ref,
      className,
      'aria-label': cleanAria,
    },
    ...renderedChildren
  );
}
