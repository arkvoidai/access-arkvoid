import React, { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useIsTouch, usePrefersReducedMotion } from '../../lib/hooks';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'lg' | 'md';
  icon?: 'arrow';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  icon,
  href,
  target,
  rel,
  children,
  className = '',
  onClick,
  ...rest
}) => {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isTouch || reducedMotion || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const moveX = Math.max(-10, Math.min(10, (relX / (rect.width / 2)) * 10));
    const moveY = Math.max(-10, Math.min(10, (relY / (rect.height / 2)) * 10));

    gsap.to(wrapperRef.current, {
      x: moveX,
      y: moveY,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handlePointerLeave = () => {
    if (isTouch || reducedMotion || !wrapperRef.current) return;
    gsap.to(wrapperRef.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  };

  const heightClass = size === 'lg' ? 'h-[60px]' : 'h-[52px]';

  const arrowSvg = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-500 ease-expo-out group-hover:translate-x-0.5"
    >
      <path
        d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  let variantClasses = '';
  let contentNodes: React.ReactNode = null;

  if (variant === 'primary') {
    const paddingClass = icon === 'arrow' ? 'pl-[28px] pr-[12px]' : 'px-[28px]';
    variantClasses = `group relative inline-flex items-center justify-between gap-4 rounded-full bg-ink text-paper overflow-hidden select-none whitespace-nowrap shrink-0 ${heightClass} ${paddingClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-violet-deep`;
    contentNodes = (
      <>
        {icon !== 'arrow' && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-ember origin-bottom scale-y-0 transition-transform duration-[600ms] ease-expo-out group-hover:scale-y-100"
          />
        )}
        <span className="relative z-10 text-[16px] font-medium tracking-[-0.01em] transition-colors duration-[600ms] ease-expo-out group-hover:text-ink">
          {children}
        </span>
        {icon === 'arrow' && (
          <span className="relative z-10 inline-flex h-[36px] w-[36px] items-center justify-center rounded-full text-ink shrink-0">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-ember transition-transform duration-[600ms] ease-expo-out group-hover:scale-[14]"
            />
            <span className="relative z-10 inline-flex items-center justify-center text-ink">
              {arrowSvg}
            </span>
          </span>
        )}
      </>
    );
  } else if (variant === 'secondary') {
    variantClasses = `group relative inline-flex items-center justify-center gap-3 rounded-full border border-ink bg-transparent px-[28px] text-ink overflow-hidden select-none whitespace-nowrap shrink-0 ${heightClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-violet-deep`;
    contentNodes = (
      <>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-ink origin-bottom scale-y-0 transition-transform duration-[600ms] ease-expo-out group-hover:scale-y-100"
        />
        <span className="relative z-10 text-[16px] font-medium tracking-[-0.01em] transition-colors duration-[600ms] ease-expo-out group-hover:text-paper">
          {children}
        </span>
        {icon === 'arrow' && (
          <span className="relative z-10 inline-flex items-center justify-center transition-colors duration-[600ms] ease-expo-out group-hover:text-paper">
            {arrowSvg}
          </span>
        )}
      </>
    );
  } else {
    variantClasses =
      'group relative inline-flex items-center gap-2 py-1 text-ink select-none whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-violet-deep';
    contentNodes = (
      <>
        <span className="relative text-[16px] font-medium tracking-[-0.01em]">
          {children}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 bottom-0 h-[1.5px] w-full bg-ink origin-left scale-x-0 transition-transform duration-500 ease-expo-out group-hover:scale-x-100"
          />
        </span>
        {icon === 'arrow' && <span className="inline-flex items-center">{arrowSvg}</span>}
      </>
    );
  }

  if (href) {
    return (
      <a
        ref={(node) => {
          wrapperRef.current = node;
        }}
        href={href}
        target={target}
        rel={rel}
        onClick={(e) => {
          if (onClick) {
            onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`${variantClasses} ${className}`}
      >
        {contentNodes}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        wrapperRef.current = node;
      }}
      type="button"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`${variantClasses} ${className}`}
      {...rest}
    >
      {contentNodes}
    </button>
  );
};
