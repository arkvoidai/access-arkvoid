import React from 'react';

export interface LogoProps {
  variant?: 'mark' | 'wordmark' | 'lockup';
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'lockup',
  size = 28,
  className = '',
}) => {
  const fontSize = Math.round(size * 0.56);

  const markElement = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="butt"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M10 56V30C10 17.85 19.85 8 32 8S54 17.85 54 30V56"
        pathLength="1"
      />
      <path
        d="M20 56V34C20 27.37 25.37 22 32 22S44 27.37 44 34V56"
        pathLength="1"
      />
      <circle cx="32" cy="41" r="4.5" fill="var(--ember)" stroke="none" />
    </svg>
  );

  const wordmarkElement = (
    <span
      aria-hidden="true"
      className="inline-flex items-center font-sans font-medium uppercase select-none whitespace-nowrap"
      style={{
        fontSize: `${Math.max(13, fontSize)}px`,
        letterSpacing: '0.28em',
        lineHeight: 1,
      }}
    >
      <span>ARKV</span>
      <span
        className="relative inline-flex items-center justify-center rounded-full border-current shrink-0"
        style={{
          width: '0.74em',
          height: '0.74em',
          borderWidth: '0.11em',
          borderStyle: 'solid',
          marginRight: '0.28em',
        }}
      >
        <span
          className="rounded-full bg-ember block"
          style={{
            width: '0.2em',
            height: '0.2em',
          }}
        />
      </span>
      <span>ID</span>
    </span>
  );

  if (variant === 'mark') {
    return (
      <span
        aria-label="Arkvoid"
        className={`inline-flex items-center justify-center ${className}`}
      >
        {markElement}
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        aria-label="Arkvoid"
        className={`inline-flex items-center ${className}`}
      >
        {wordmarkElement}
      </span>
    );
  }

  return (
    <span
      aria-label="Arkvoid"
      className={`inline-flex items-center whitespace-nowrap shrink-0 ${className}`}
      style={{ gap: `${Math.round(size * 0.38)}px` }}
    >
      {markElement}
      {wordmarkElement}
    </span>
  );
};
