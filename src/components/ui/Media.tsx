import React, { useEffect, useState } from 'react';
import { MEDIA, type MediaKey } from '../../config/media';
import { ScrollTrigger } from '../../lib/gsap';

export interface MediaProps {
  mediaKey: MediaKey;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  fill?: boolean;
}

let refreshTimeout: number | undefined;
function scheduleScrollTriggerRefresh() {
  if (typeof window === 'undefined') return;
  window.clearTimeout(refreshTimeout);
  refreshTimeout = window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, 180);
}

export const Media: React.FC<MediaProps> = ({
  mediaKey,
  priority: priorityOverride,
  className = '',
  imgClassName = '',
  fill = false,
}) => {
  const entry = MEDIA[mediaKey];
  const isPriority = priorityOverride ?? entry.priority ?? false;
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    setStatus('loading');
  }, [entry.src]);

  const handleLoad = () => {
    setStatus('loaded');
    scheduleScrollTriggerRefresh();
  };

  const handleError = () => {
    setStatus('error');
    scheduleScrollTriggerRefresh();
  };

  const fileNameLabel = entry.src.replace(/^\/images\//, '');

  return (
    <div
      className={`relative overflow-hidden bg-paper-2 ${fill ? 'w-full h-full' : 'w-full'} ${className}`}
      style={fill ? undefined : { aspectRatio: entry.ratio }}
    >
      {/* Elegant architectural placeholder rendered while loading or when image file is not yet uploaded */}
      <div
        aria-hidden={status === 'loaded' ? 'true' : undefined}
        role={status === 'error' ? 'img' : undefined}
        aria-label={status === 'error' ? entry.alt : undefined}
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ease-expo-out ${
          status === 'loaded' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          background:
            'linear-gradient(155deg, var(--paper-2) 0%, var(--mist) 58%, var(--paper-2) 100%)',
        }}
      >
        {/* Subtle dusk atmospheric glow inside placeholder */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 55% at 50% 62%, rgba(255, 233, 222, 0.55) 0%, rgba(239, 231, 253, 0.32) 48%, rgba(243, 240, 235, 0) 100%)',
          }}
        />

        {/* Faint thin arch outlines (Arkvoid logo geometry at 6% opacity) */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className="relative z-10 w-[34%] max-w-[240px] min-w-[96px] h-auto text-ink opacity-[0.06]"
        >
          <path
            d="M10 56V30C10 17.85 19.85 8 32 8S54 17.85 54 30V56"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
          <path
            d="M20 56V34C20 27.37 25.37 22 32 22S44 27.37 44 34V56"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="41" r="3" fill="currentColor" />
        </svg>

        {import.meta.env.DEV && status === 'error' && (
          <span className="pointer-events-none absolute top-3 right-3 z-10 rounded-full bg-paper/70 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft/65 select-none">
            {fileNameLabel}
          </span>
        )}
      </div>

      {status !== 'error' && (
        <img
          src={entry.src}
          alt={entry.alt}
          loading={isPriority ? 'eager' : 'lazy'}
          fetchPriority={isPriority ? 'high' : 'auto'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{ objectPosition: entry.focal }}
          className={`relative z-10 h-full w-full object-cover transition-opacity duration-700 ease-expo-out ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};
