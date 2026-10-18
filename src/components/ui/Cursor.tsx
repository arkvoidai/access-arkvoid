import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { useMediaQuery, usePrefersReducedMotion } from '../../lib/hooks';

export const Cursor: React.FC = () => {
  const isPointerFine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = usePrefersReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>('');
  const [mode, setMode] = useState<'default' | 'interactive' | 'action' | 'hidden'>('default');

  useEffect(() => {
    if (!isPointerFine || reducedMotion) return undefined;
    const el = cursorRef.current;
    if (!el) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3.out' });

    let hasMoved = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        gsap.set(el, { x: e.clientX, y: e.clientY, opacity: 1 });
      } else {
        xTo(e.clientX);
        yTo(e.clientY);
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        setMode('hidden');
        setLabel('');
        return;
      }

      const cursorAttrEl = target.closest<HTMLElement>('[data-cursor]');
      if (cursorAttrEl) {
        const cursorType = cursorAttrEl.getAttribute('data-cursor') || '';
        if (cursorType === 'drag' || cursorType === 'view') {
          setMode('action');
          setLabel(cursorType.toUpperCase());
          return;
        }
      }

      if (target.closest('a, button, [role="button"]')) {
        setMode('interactive');
        setLabel('');
        return;
      }

      setMode('default');
      setLabel('');
    };

    const onMouseLeaveWindow = () => {
      setMode('hidden');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
    };
  }, [isPointerFine, reducedMotion]);

  if (!isPointerFine || reducedMotion) return null;

  const scaleValue =
    mode === 'hidden'
      ? 0
      : mode === 'action'
      ? 1
      : mode === 'interactive'
      ? 36 / 88
      : 10 / 88;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] -ml-[44px] -mt-[44px] flex h-[88px] w-[88px] items-center justify-center rounded-full opacity-0"
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-full bg-ink transition-transform duration-300 ease-expo-out"
        style={{
          transform: `scale(${scaleValue})`,
          opacity: mode === 'interactive' ? 0.16 : 1,
        }}
      >
        {mode === 'action' && (
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-paper select-none">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
