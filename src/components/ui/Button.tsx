import React, { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useIsTouch, usePrefersReducedMotion } from '../../lib/hooks';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'lg' | 'md';
  icon?: 'arrow' | 'external';
  hoverAnimation?: 'default' | 'violet-scale';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'lg',
    icon,
    hoverAnimation = 'default',
    href,
    target,
    rel,
    children,
    className = '',
    onClick,
    style,
    ...rest
  },
  forwardedRef
) {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();
  const isVioletHover = hoverAnimation === 'violet-scale' || icon === 'external';

  const handlePointerEnter = () => {
    if (reducedMotion || !wrapperRef.current) return;
    if (isVioletHover) {
      gsap.to(wrapperRef.current, {
        scale: 1.03,
        borderColor: 'var(--violet, #8338EC)',
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isTouch || reducedMotion || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const moveX = Math.max(-8, Math.min(8, (relX / (rect.width / 2)) * 8));
    const moveY = Math.max(-8, Math.min(8, (relY / (rect.height / 2)) * 8));

    gsap.to(wrapperRef.current, {
      x: moveX,
      y: moveY,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handlePointerLeave = () => {
    if (!wrapperRef.current) return;
    if (isVioletHover) {
      gsap.to(wrapperRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        borderColor: 'var(--ink, #14151A)',
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    } else {
      if (isTouch || reducedMotion) return;
      gsap.to(wrapperRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    }
  };

  const setNodeRef = (node: HTMLElement | null) => {
    wrapperRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
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

  const externalSvg = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
    >
      <path
        d="M4.5 11.5L11.5 4.5M11.5 4.5H6.5M11.5 4.5V9.5"
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
    variantClasses = `group relative inline-flex items-center justify-between gap-4 rounded-full border border-ink bg-ink text-paper overflow-hidden select-none whitespace-nowrap shrink-0 ${heightClass} ${paddingClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-violet-deep`;
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
    variantClasses = `group relative inline-flex items-center justify-center gap-2 rounded-full border border-ink bg-transparent px-[24px] text-ink overflow-hidden select-none whitespace-nowrap shrink-0 ${heightClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-violet-deep transition-colors duration-300`;
    contentNodes = (
      <>
        {!isVioletHover && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-ink origin-bottom scale-y-0 transition-transform duration-[600ms] ease-expo-out group-hover:scale-y-100"
          />
        )}
        <span
          className={`relative z-10 text-[16px] font-medium tracking-[-0.01em] inline-flex items-center gap-2 transition-colors duration-300 ${
            isVioletHover ? 'group-hover:text-violet' : 'group-hover:text-paper'
          }`}
        >
          <span>{children}</span>
          {icon === 'external' && externalSvg}
        </span>
        {icon === 'arrow' && !isVioletHover && (
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
        ref={setNodeRef}
        href={href}
        target={target}
        rel={rel}
        style={style}
        onClick={(e) => {
          if (onClick) {
            onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
          }
        }}
        onPointerEnter={handlePointerEnter}
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
      ref={setNodeRef}
      type="button"
      style={style}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`${variantClasses} ${className}`}
      {...rest}
    >
      {contentNodes}
    </button>
  );
});
