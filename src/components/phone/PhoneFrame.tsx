import React, { useEffect, useRef, useState } from 'react';

export type PhoneFinish = 'silver' | 'ink' | 'ember';

export interface PhoneFrameProps {
  finish?: PhoneFinish;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
  island?: 'idle' | 'active';
  islandContent?: React.ReactNode;
  sizeVariant?: 'story' | 'trio';
}

const DESIGN_WIDTH = 402;
const DESIGN_HEIGHT = 874;

const FINISH_STYLES: Record<
  PhoneFinish,
  {
    outerGradient: string;
    innerHighlight: string;
    buttonGradient: string;
  }
> = {
  silver: {
    outerGradient:
      'linear-gradient(135deg, #F6F4F0 0%, #D5D1C8 22%, #EFECE6 48%, #B8B3A8 76%, #F3F0EA 100%)',
    innerHighlight:
      'inset 0 0 0 1px rgba(255, 255, 255, 0.85), inset 0 0 0 2px rgba(20, 21, 26, 0.16)',
    buttonGradient:
      'linear-gradient(180deg, #F5F3EE 0%, #BEB9AE 52%, #EAE6DF 100%)',
  },
  ink: {
    outerGradient:
      'linear-gradient(135deg, #4B4E58 0%, #20222A 24%, #353844 50%, #15171D 78%, #41444E 100%)',
    innerHighlight:
      'inset 0 0 0 1px rgba(255, 255, 255, 0.24), inset 0 0 0 2px rgba(0, 0, 0, 0.65)',
    buttonGradient:
      'linear-gradient(180deg, #4A4D57 0%, #1B1D24 52%, #373A45 100%)',
  },
  ember: {
    outerGradient:
      'linear-gradient(135deg, #E27D4A 0%, #C4551E 25%, #D96B34 50%, #9E3E10 78%, #DC7440 100%)',
    innerHighlight:
      'inset 0 0 0 1px rgba(255, 236, 224, 0.48), inset 0 0 0 2px rgba(38, 14, 4, 0.35)',
    buttonGradient:
      'linear-gradient(180deg, #E07A47 0%, #A64212 52%, #D46630 100%)',
  },
};

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  finish = 'silver',
  children,
  className = '',
  ariaLabel,
  ariaHidden,
  island = 'idle',
  islandContent,
  sizeVariant = 'story',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.84);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;

    let rafId = 0;
    const updateScale = (width: number) => {
      if (width <= 0) return;
      const next = Number((width / DESIGN_WIDTH).toFixed(4));
      setScale((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
    };

    updateScale(el.getBoundingClientRect().width);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = entry.contentRect.width;
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        updateScale(w);
      });
    });

    ro.observe(el);

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const finishToken = FINISH_STYLES[finish];
  const isIslandActive = island === 'active';

  // Responsive wrapper sizing that preserves exact 402/874 aspect ratio and minimum 280px width
  const sizeClasses =
    sizeVariant === 'story'
      ? 'w-[min(78vw,340px)] min-w-[280px] lg:w-[min(calc(80svh*402/874),368px)] lg:max-h-[min(80svh,800px)]'
      : 'w-[min(78vw,340px)] min-w-[280px] lg:w-[min(calc(70svh*402/874),322px)] lg:max-h-[min(70svh,700px)]';

  const isDecorative = ariaHidden ?? !ariaLabel;

  return (
    <div
      ref={wrapperRef}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={isDecorative ? 'true' : undefined}
      className={`relative mx-auto select-none shrink-0 ${sizeClasses} ${className}`}
      style={
        {
          aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}`,
          '--phone-scale': scale,
        } as React.CSSProperties
      }
    >
      {/* Tight contact shadow ellipse beneath the device (no filter:blur) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 left-[12%] right-[12%] h-5 rounded-full"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(20, 21, 26, 0.22) 0%, rgba(20, 21, 26, 0.08) 55%, rgba(20, 21, 26, 0) 100%)',
        }}
      />

      {/* Fixed 402 x 874 logical coordinate device scaled uniformly */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: 'scale(var(--phone-scale, 0.84))',
        }}
      >
        {/* Left hardware buttons: Action button + Volume Up + Volume Down */}
        <span
          className="pointer-events-none absolute -left-[2.5px] top-[168px] h-[32px] w-[3px] rounded-l-[2px]"
          style={{ background: finishToken.buttonGradient }}
        />
        <span
          className="pointer-events-none absolute -left-[2.5px] top-[220px] h-[62px] w-[3px] rounded-l-[2px]"
          style={{ background: finishToken.buttonGradient }}
        />
        <span
          className="pointer-events-none absolute -left-[2.5px] top-[296px] h-[62px] w-[3px] rounded-l-[2px]"
          style={{ background: finishToken.buttonGradient }}
        />

        {/* Right hardware buttons: Side Power button + lower Camera Control button */}
        <span
          className="pointer-events-none absolute -right-[2.5px] top-[238px] h-[88px] w-[3px] rounded-r-[2px]"
          style={{ background: finishToken.buttonGradient }}
        />
        <span
          className="pointer-events-none absolute -right-[2px] top-[518px] h-[46px] w-[2.5px] rounded-r-[2px]"
          style={{ background: finishToken.buttonGradient }}
        />

        {/* Outer metallic chassis (radius 64px) with layered ground shadow */}
        <div
          className="relative h-full w-full rounded-[64px] p-[3px]"
          style={{
            background: finishToken.outerGradient,
            boxShadow: `${finishToken.innerHighlight}, 0 28px 56px -14px rgba(20, 21, 26, 0.16), 0 10px 22px -8px rgba(20, 21, 26, 0.10)`,
          }}
        >
          {/* Black 9px total screen bezel */}
          <div className="relative h-full w-full rounded-[61px] bg-[#0A0B0E] p-[6px]">
            {/* Inner Screen Aperture (radius 55px, squircle where supported) */}
            <div
              className="relative h-full w-full overflow-hidden rounded-[55px] bg-[#F4F3F6] text-[#14151A]"
              style={
                {
                  cornerShape: 'squircle',
                } as React.CSSProperties
              }
            >
              {/* Screen UI Content */}
              <div className="relative h-full w-full">{children}</div>

              {/* iOS Status Bar (height 54px) */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[54px] items-center justify-between px-8 pt-1 text-[#14151A]">
                <span
                  className="text-[17px] font-semibold tracking-[-0.02em] leading-none"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Geist Variable", Geist, system-ui, sans-serif',
                  }}
                >
                  9:41
                </span>

                {/* Right status icons: Cellular, Wi-Fi, Full Battery (ink coloured) */}
                <div className="flex items-center gap-[7px] text-[#14151A]">
                  {/* Cellular Bars */}
                  <svg
                    width="18"
                    height="12"
                    viewBox="0 0 18 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect x="0.5" y="7.5" width="3" height="4" rx="1" fill="currentColor" />
                    <rect x="5" y="5.5" width="3" height="6" rx="1" fill="currentColor" />
                    <rect x="9.5" y="3" width="3" height="8.5" rx="1" fill="currentColor" />
                    <rect x="14" y="0.5" width="3" height="11" rx="1" fill="currentColor" />
                  </svg>

                  {/* Wi-Fi */}
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 9.6C8.66 9.6 9.2 10.14 9.2 10.8C9.2 11.46 8.66 12 8 12C7.34 12 6.8 11.46 6.8 10.8C6.8 10.14 7.34 9.6 8 9.6Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4.6 7.5C5.53 6.57 6.72 6.05 8 6.05C9.28 6.05 10.47 6.57 11.4 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2.1 5C3.68 3.42 5.77 2.55 8 2.55C10.23 2.55 12.32 3.42 13.9 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Battery (ink coloured, full charge) */}
                  <svg
                    width="25"
                    height="12"
                    viewBox="0 0 25 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="0.75"
                      y="1"
                      width="21"
                      height="10"
                      rx="3.2"
                      stroke="currentColor"
                      strokeOpacity="0.4"
                      strokeWidth="1.2"
                    />
                    <rect
                      x="2.5"
                      y="2.75"
                      width="17.5"
                      height="6.5"
                      rx="1.8"
                      fill="currentColor"
                    />
                    <path
                      d="M23 4.2V7.8C23.8 7.45 24.25 6.78 24.25 6C24.25 5.22 23.8 4.55 23 4.2Z"
                      fill="currentColor"
                      fillOpacity="0.45"
                    />
                  </svg>
                </div>
              </div>

              {/* Dynamic Island: 126 x 37 px idle pill, 11px from top, expands via transform/opacity only */}
              <div className="pointer-events-none absolute inset-x-0 top-[11px] z-40 flex justify-center">
                <div className="relative flex h-[37px] w-[204px] items-center justify-center">
                  {/* Pill background scaled via transform only */}
                  <div
                    className="absolute inset-0 rounded-full bg-[#0A0B0E] transition-transform duration-500 ease-expo-out"
                    style={{
                      transform: isIslandActive ? 'scaleX(1)' : 'scaleX(0.6176)',
                    }}
                  />

                  {/* Idle state lens glint dot at right side of the 126px island */}
                  <div
                    className="relative flex h-[37px] w-[126px] items-center justify-end pr-3.5 transition-opacity duration-300"
                    style={{ opacity: isIslandActive ? 0 : 1 }}
                  >
                    <span className="relative flex h-[11px] w-[11px] items-center justify-center rounded-full bg-[#15171F]">
                      <span className="h-[3px] w-[3px] translate-x-[1px] -translate-y-[1px] rounded-full bg-white/25 block" />
                    </span>
                  </div>

                  {/* Active island content */}
                  <div
                    className="absolute inset-0 flex items-center justify-center gap-2 px-4 transition-all duration-300 ease-expo-out"
                    style={{
                      opacity: isIslandActive ? 1 : 0,
                      transform: isIslandActive ? 'scale(1)' : 'scale(0.92)',
                    }}
                  >
                    {islandContent}
                  </div>
                </div>
              </div>

              {/* Subtle diagonal glass reflection over screen (6% opacity, pointer-events none) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30"
                style={{
                  background:
                    'linear-gradient(125deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.025) 38%, rgba(255, 255, 255, 0) 64%)',
                }}
              />

              {/* Home indicator: 134 x 5 px rounded bar, 8px from bottom, ink at 90% opacity */}
              <div className="pointer-events-none absolute inset-x-0 bottom-[8px] z-40 flex justify-center">
                <span className="block h-[5px] w-[134px] rounded-full bg-[#14151A]/90" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
