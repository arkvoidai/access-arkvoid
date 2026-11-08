import React, { useEffect, useState } from 'react';
import { MEDIA, type MediaKey } from '../../config/media';

export interface MediaProps {
  mediaKey: MediaKey;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  fill?: boolean;
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

  useEffect(() => setStatus('loading'), [entry.src]);

  return (
    <div
      className={`relative overflow-hidden bg-paper-2 ${fill ? 'h-full w-full' : 'w-full'} ${className}`}
      style={fill ? undefined : { aspectRatio: entry.ratio }}
    >
      <div
        aria-hidden={status === 'loaded' ? 'true' : undefined}
        role={status === 'error' ? 'img' : undefined}
        aria-label={status === 'error' ? entry.alt : undefined}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${status === 'loaded' ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        style={{ background: 'linear-gradient(155deg, var(--paper-2), var(--mist) 58%, var(--paper-2))' }}
      >
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="relative z-10 h-auto w-[34%] min-w-[72px] max-w-[180px] text-ink opacity-[0.06]">
          <path d="M10 56V30C10 17.85 19.85 8 32 8S54 17.85 54 30V56M20 56V34C20 27.37 25.37 22 32 22S44 27.37 44 34V56" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="32" cy="41" r="3" fill="currentColor" />
        </svg>
      </div>

      {status !== 'error' && (
        <img
          src={entry.src}
          alt={entry.alt}
          loading={isPriority ? 'eager' : 'lazy'}
          fetchPriority={isPriority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          style={{ objectPosition: entry.focal }}
          className={`relative z-10 h-full w-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  );
};
