import React, { useState } from 'react';
import { MEDIA, type MediaKey } from '../../config/media';

export const IOS_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Geist Variable", Geist, system-ui, sans-serif';

export type PhoneTabId = 'home' | 'people' | 'journal' | 'map';

export interface ScreenBaseProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenBase: React.FC<ScreenBaseProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between bg-[#F4F3F6] pt-[54px] pb-[96px] text-[#14151A] ${className}`}
      style={{ fontFamily: IOS_FONT_STACK }}
    >
      {children}
    </div>
  );
};

export interface LargeTitleProps {
  children: React.ReactNode;
  eyebrow?: string;
  className?: string;
}

export const LargeTitle: React.FC<LargeTitleProps> = ({
  children,
  eyebrow,
  className = '',
}) => {
  return (
    <div className={`px-5 pt-2 pb-1 ${className}`}>
      {eyebrow && (
        <div className="mb-1 font-mono text-[13px] uppercase tracking-[0.12em] text-[#4B4F56]">
          {eyebrow}
        </div>
      )}
      <h4
        className="text-[34px] font-bold tracking-[-0.02em] leading-[1.08] text-[#14151A]"
        style={{ fontFamily: IOS_FONT_STACK }}
      >
        {children}
      </h4>
    </div>
  );
};

export interface AvatarProps {
  mediaKey?: MediaKey;
  name: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  mediaKey,
  name,
  size = 40,
  className = '',
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const entry = mediaKey ? MEDIA[mediaKey] : undefined;
  const initial = (name.trim()[0] || 'A').toUpperCase();
  const fontSize = Math.max(15, Math.round(size * 0.46));

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border border-[#14151A]/10 flex items-center justify-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(145deg, var(--paper) 0%, var(--mist) 100%)',
      }}
    >
      {!loaded && (
        <span
          className="font-serif italic font-normal text-[#14151A] select-none leading-none"
          style={{ fontSize: `${fontSize}px` }}
        >
          {initial}
        </span>
      )}

      {entry && (
        <img
          src={entry.src}
          alt={entry.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          style={{ objectPosition: '50% 24%' }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export interface NavBarProps {
  mediaKey?: MediaKey;
  name: string;
  subtitle: string;
}

export const NavBar: React.FC<NavBarProps> = ({ mediaKey, name, subtitle }) => {
  return (
    <div className="relative flex items-center justify-between border-b border-[#14151A]/[0.06] bg-[#FAF8F5]/90 px-4 py-2.5">
      {/* Left back chevron in ember accent */}
      <div className="flex w-10 items-center">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
          className="text-[#FB5607]"
        >
          <path
            d="M13.5 4.5L7 11L13.5 17.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Centred avatar + name + subtitle */}
      <div className="flex flex-col items-center text-center">
        <Avatar mediaKey={mediaKey} name={name} size={38} />
        <div className="mt-1 text-[15px] font-semibold tracking-[-0.015em] leading-[1.15] text-[#14151A]">
          {name}
        </div>
        <div className="text-[13px] leading-[1.15] text-[#4B4F56]">
          {subtitle}
        </div>
      </div>

      {/* Right subtle detail icon */}
      <div className="flex w-10 items-center justify-end">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#14151A]/[0.05] text-[#14151A]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="8"
              cy="8"
              r="6.25"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M8 7.2V11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <circle cx="8" cy="5" r="0.9" fill="currentColor" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export interface GroupedCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GroupedCard: React.FC<GroupedCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`overflow-hidden rounded-[24px] border border-[#14151A]/[0.06] bg-[#FFFFFF] ${className}`}
      style={{
        boxShadow: '0 2px 10px rgba(20, 21, 26, 0.03)',
      }}
    >
      {children}
    </div>
  );
};

export interface BubbleProps {
  direction: 'received' | 'sent';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Bubble: React.FC<BubbleProps> = ({
  direction,
  children,
  className = '',
  style,
}) => {
  const isSent = direction === 'sent';

  return (
    <div
      style={style}
      className={`relative max-w-[78%] rounded-[20px] px-4 py-2.5 text-[17px] leading-[1.3] tracking-[-0.01em] ${
        isSent
          ? 'self-end rounded-br-[6px] bg-[#14151A] text-[#FFFFFF]'
          : 'self-start rounded-bl-[6px] bg-[#E9E9EB] text-[#14151A]'
      } ${className}`}
    >
      {children}

      {/* iMessage-style subtle corner tail */}
      {isSent ? (
        <svg
          width="11"
          height="14"
          viewBox="0 0 11 14"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute -right-[5px] bottom-0 text-[#14151A]"
        >
          <path
            d="M0 14C4.5 14 8.5 11.5 11 7C7.5 7.5 5 5.2 5 0H0V14Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          width="11"
          height="14"
          viewBox="0 0 11 14"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute -left-[5px] bottom-0 text-[#E9E9EB]"
        >
          <path
            d="M11 14C6.5 14 2.5 11.5 0 7C3.5 7.5 6 5.2 6 0H11V14Z"
            fill="currentColor"
          />
        </svg>
      )}
    </div>
  );
};

export const TypingIndicator: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`relative self-start rounded-[20px] rounded-bl-[6px] bg-[#E9E9EB] px-4 py-3.5 ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#4B4F56]/55 block" />
        <span className="h-2 w-2 rounded-full bg-[#4B4F56]/75 block" />
        <span className="h-2 w-2 rounded-full bg-[#4B4F56]/40 block" />
      </div>
    </div>
  );
};

export interface SystemBannerProps {
  title: string;
  subtitle?: string;
  icon?: 'bookmark' | 'ledger' | 'spark';
  className?: string;
}

export const SystemBanner: React.FC<SystemBannerProps> = ({
  title,
  subtitle,
  icon = 'bookmark',
  className = '',
}) => {
  const renderIcon = () => {
    if (icon === 'ledger') {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect
            x="3"
            y="2.2"
            width="10"
            height="11.6"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M5.5 5.5H10.5M5.5 8H10.5M5.5 10.5H8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    if (icon === 'spark') {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2L9.6 6.4L14 8L9.6 9.6L8 14L6.4 9.6L2 8L6.4 6.4L8 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M4.2 2.5H11.8C12.24 2.5 12.6 2.86 12.6 3.3V13.5L8 10.6L3.4 13.5V3.3C3.4 2.86 3.76 2.5 4.2 2.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-[20px] border border-[#14151A]/[0.07] bg-[#FFFFFF] px-3.5 py-3 ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(20, 21, 26, 0.03)',
      }}
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE9DE] text-[#FB5607]">
        {renderIcon()}
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold tracking-[-0.01em] leading-[1.2] text-[#14151A]">
          {title}
        </div>
        {subtitle && (
          <div className="mt-0.5 text-[13px] leading-[1.2] text-[#4B4F56]">
            {subtitle}
          </div>
        )}
      </div>

      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFE9DE]/70 text-[#FB5607]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
};

export interface ChipRowProps {
  label?: string;
  chips: [string, string];
  className?: string;
}

export const ChipRow: React.FC<ChipRowProps> = ({
  label,
  chips,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[20px] border border-[#14151A]/[0.06] bg-[#FFFFFF] p-3.5 ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(20, 21, 26, 0.025)',
      }}
    >
      {label && (
        <div className="mb-2 font-mono text-[13px] uppercase tracking-[0.12em] text-[#4B4F56]">
          {label}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <div className="flex flex-1 items-center gap-2 rounded-[16px] border border-[#14151A]/[0.08] bg-[#FAF8F5] px-3 py-2 text-[14px] font-medium leading-[1.2] text-[#14151A]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-[#FB5607]"
          >
            <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M7 4.4V7L8.8 8.2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="truncate">{chips[0]}</span>
        </div>

        {/* Thin ember connector */}
        <span
          aria-hidden="true"
          className="h-[1.5px] w-3 shrink-0 bg-[#FB5607] block"
        />

        <div className="flex flex-1 items-center gap-2 rounded-[16px] border border-[#FB5607]/35 bg-[#FFE9DE]/45 px-3 py-2 text-[14px] font-medium leading-[1.2] text-[#14151A]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-[#FB5607]"
          >
            <path
              d="M3 7.2L5.6 9.8L11 4.2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="truncate">{chips[1]}</span>
        </div>
      </div>
    </div>
  );
};

export const Composer: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`mt-auto flex items-center gap-2.5 px-4 pt-2 pb-1 ${className}`}
    >
      {/* Round plus button */}
      <span className="inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-[#14151A]/[0.08] bg-[#E9E9EB] text-[#14151A]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 3.2V12.8M3.2 8H12.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {/* Rounded input with "Message" placeholder and mic icon */}
      <div className="flex h-[38px] flex-1 items-center justify-between rounded-full border border-[#14151A]/[0.12] bg-[#FFFFFF] pl-4 pr-3">
        <span className="text-[16px] text-[#4B4F56]/70">Message</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="text-[#4B4F56]"
        >
          <rect
            x="5.6"
            y="2"
            width="4.8"
            height="7.6"
            rx="2.4"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M3.5 7.4C3.5 9.89 5.51 11.9 8 11.9C10.49 11.9 12.5 9.89 12.5 7.4M8 11.9V14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export const TabBar: React.FC<{ activeTab?: PhoneTabId }> = ({
  activeTab = 'people',
}) => {
  const tabs: Array<{ id: PhoneTabId; label: 'Home' | 'People' | 'Journal' | 'Map' }> = [
    { id: 'home', label: 'Home' },
    { id: 'people', label: 'People' },
    { id: 'journal', label: 'Journal' },
    { id: 'map', label: 'Map' },
  ];

  const renderTabIcon = (id: PhoneTabId, selected: boolean) => {
    if (id === 'home') {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 10.5L12 4L20 10.5V19C20 19.55 19.55 20 19 20H5C4.45 20 4 19.55 4 19V10.5Z"
            fill={selected ? 'currentColor' : 'none'}
            fillOpacity={selected ? 0.14 : 0}
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 20V14H14.5V20"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (id === 'people') {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="12"
            cy="8"
            r="3.6"
            fill={selected ? 'currentColor' : 'none'}
            fillOpacity={selected ? 0.16 : 0}
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M5 19.5C5 16.19 8.13 13.5 12 13.5C15.87 13.5 19 16.19 19 19.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    if (id === 'journal') {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="5"
            y="3.5"
            width="14"
            height="17"
            rx="2.5"
            fill={selected ? 'currentColor' : 'none'}
            fillOpacity={selected ? 0.14 : 0}
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M8.5 8.5H15.5M8.5 12H15.5M8.5 15.5H12.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3.5 6L9 3.8L15 6L20.5 3.8V18L15 20.2L9 18L3.5 20.2V6Z"
          fill={selected ? 'currentColor' : 'none'}
          fillOpacity={selected ? 0.12 : 0}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 3.8V18M15 6V20.2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[12px] z-30 flex justify-center">
      <div
        className="flex h-[64px] w-[358px] items-center justify-between rounded-full border border-[#14151A]/[0.08] px-2"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          boxShadow: '0 8px 24px rgba(20, 21, 26, 0.08)',
        }}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <div
              key={tab.id}
              className="relative flex h-[50px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full"
              style={{
                backgroundColor: isSelected
                  ? 'rgba(20, 21, 26, 0.07)'
                  : 'transparent',
              }}
            >
              <span
                className={
                  isSelected ? 'text-[#14151A]' : 'text-[#4B4F56]'
                }
              >
                {renderTabIcon(tab.id, isSelected)}
              </span>
              <span
                className={`text-[11px] leading-none tracking-[-0.01em] ${
                  isSelected
                    ? 'font-semibold text-[#14151A]'
                    : 'font-medium text-[#4B4F56]'
                }`}
              >
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
