import React from 'react';
import { LogoType } from '../types';

interface CompanyLogoProps {
  type: LogoType;
  className?: string;
  iconClassName?: string;
  variant?: 'circle' | 'square' | 'rounded-2xl';
  bgOverride?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  type,
  className = 'w-11 h-11',
  iconClassName = 'w-5 h-5',
  variant = 'rounded-2xl',
  bgOverride,
}) => {
  const getLogoContent = () => {
    switch (type) {
      case 'apple':
        return (
          <svg className={`${iconClassName} fill-current`} viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.33-7.51-11.41-13.43-24.58-17.76-39.5-4.33-14.92-6.5-28.79-6.5-41.61 0-16.73 4.13-30.73 12.39-42 8.26-11.27 18.86-17.06 31.8-17.38 5.43 0 11.22 1.34 17.38 4.02 6.16 2.68 10.37 4.07 12.63 4.18 1.96 0 6.34-1.46 13.15-4.38 6.81-2.92 12.83-4.22 18.06-3.9 14.12.87 25.43 6.03 33.93 15.48-12.38 7.5-18.42 17.81-18.12 30.93.33 10.66 4.41 19.67 12.24 27.02 7.83 7.35 17.08 11.63 27.75 12.83-2.39 7.4-5.32 14.9-8.79 22.52zM119.22 31.84c0-7.72 2.76-15.02 8.28-21.9 5.53-6.88 12.44-11.23 20.74-13.06.33 1.2.5 2.37.5 3.51 0 7.6-2.9 14.88-8.71 21.84-5.8 6.96-12.89 11.19-21.26 12.69-.33-1.07-.49-2.09-.49-3.08z" />
          </svg>
        );

      case 'github':
        return (
          <svg className={`${iconClassName} fill-current`} viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        );

      case 'spotify':
        return (
          <svg className={`${iconClassName} fill-current`} viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10 5.524 0 10-4.476 10-10 0-5.523-4.476-10-10-10zm4.587 14.425c-.18.295-.563.387-.857.207-2.35-1.436-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.469-.077-.334.132-.67.467-.746 3.809-.87 7.076-.496 9.722 1.115.294.18.386.563.207.856zm1.224-2.723c-.226.368-.71.482-1.078.256-2.69-1.653-6.79-2.133-9.97-1.167-.413.125-.85-.11-1.025-.522-.125-.413.11-.85.522-1.025 3.633-1.103 8.147-.568 11.295 1.38.368.226.482.71.256 1.078zm.106-2.835C14.692 8.94 9.38 8.765 6.297 9.7c-.495.15-1.02-.132-1.17-.627-.15-.495.132-1.02.627-1.17 3.542-1.075 9.404-.871 13.155 1.356.444.264.59.84.327 1.284-.264.444-.84.59-1.284.327z" />
          </svg>
        );

      case 'figma':
        return (
          <svg className={`${iconClassName} fill-current`} viewBox="0 0 24 24">
            <path d="M8 2h4v4H8V2zm4 0h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-4V2zm-4 4h4v4H8V6zm0 4h4v4H8v-4zm-4 4a4 4 0 0 1 4-4v4H4zm4 0h4v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
          </svg>
        );

      case 'airbnb':
        return (
          <svg className={`${iconClassName} fill-current`} viewBox="0 0 24 24">
            <path d="M12 2C8.6 2 6 4.7 6 8.5c0 4.3 4.2 9.2 5.5 10.7.3.3.7.3 1 0 1.3-1.5 5.5-6.4 5.5-10.7C18 4.7 15.4 2 12 2zm0 8.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getBgClasses = () => {
    if (bgOverride) return bgOverride;
    switch (type) {
      case 'apple':
        return 'bg-white text-black shadow-xs';
      case 'github':
        return 'bg-[#181A20] text-white shadow-xs';
      case 'spotify':
        return 'bg-white text-[#1DB954] shadow-xs';
      case 'figma':
        return 'bg-purple-100 text-purple-900 shadow-xs';
      case 'airbnb':
        return 'bg-rose-100 text-rose-600 shadow-xs';
      default:
        return 'bg-slate-900 text-white';
    }
  };

  const radiusClass =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'square'
      ? 'rounded-lg'
      : 'rounded-2xl';

  return (
    <div
      className={`${className} ${radiusClass} ${getBgClasses()} flex items-center justify-center shrink-0`}
    >
      {getLogoContent()}
    </div>
  );
};
