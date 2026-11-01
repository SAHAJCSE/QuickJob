import React from 'react';
import { soundEngine } from '../utils/sound';

interface OnboardingViewProps {
  onStart: () => void;
  onOpenAuth?: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onStart, onOpenAuth }) => {
  const handleStart = () => {
    soundEngine.playSuccess();
    onStart();
  };
  return (
    <div className="relative w-full h-full bg-white flex flex-col justify-between overflow-hidden">
      {/* Top Bar */}
      <header className="relative z-20 pt-10 px-7 flex items-center justify-between shrink-0">
        <div aria-label="Page indicator" className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 opacity-60"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 opacity-40"></span>
        </div>
        <button
          onClick={handleStart}
          className="text-xs font-semibold text-slate-700 tracking-wide hover:opacity-75 transition-opacity"
          type="button"
        >
          Skip
        </button>
      </header>

      {/* Hero Visual Area */}
      <section className="relative w-full flex-1 flex items-end justify-center overflow-hidden -mt-4">
        {/* Soft Lavender Curved Wave Backdrop */}
        <div
          className="absolute inset-x-0 top-0 h-[82%] z-0"
          style={{
            background: 'linear-gradient(180deg, #B9B4FB 0%, #CAC6FC 100%)',
            clipPath: 'ellipse(85% 65% at 50% 35%)',
          }}
        ></div>

        {/* Hero Character Image */}
        <div className="relative z-10 w-full flex items-end justify-center pointer-events-none h-full">
          <img
            alt="3D professional man holding smartphone"
            className="h-full max-w-full object-cover object-center drop-shadow-xl"
            src="/assets/aistudio/Paste_November_01__2026_-_11_05AM_8d9e1451"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCCU8hzCL5hIcl39sPV3LSlx0q_EDBq1oygF8_kwnXH2jPkue_OTm4_tmHEfCuDghp6xAvQYaBiF3CcuAxFgtRVKnkHTjUYvubXeSIA93WiKEFcsf6zn25RC5V0yPgCSRnR_LrHZwRBzH130jv_ZadOex9Sx14UaiKtopLiAoD5WAsxlYqOKsLOuaAV98YBBlShZ68AFeMkPy60zhHZVkIAvRPy752owBE8rPlWJpog7Uu368tu-X7_';
            }}
            style={{
              width: '100%',
              maxWidth: '320px',
              height: '100%',
              objectPosition: 'center 8%',
              maskImage: 'linear-gradient(black 0%, black 72%, rgba(0, 0, 0, 0.6) 88%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(black 0%, black 72%, rgba(0, 0, 0, 0.6) 88%, transparent 100%)',
            }}
          />
        </div>
      </section>

      {/* Content and Action Footer */}
      <footer className="relative z-20 px-8 pb-8 pt-2 flex flex-col items-center text-center bg-white shrink-0">
        <div className="mb-5">
          <h1
            className="text-[31px] leading-[1.2] font-extrabold text-[#141416] tracking-[-0.035em]"
          >
            The bettar way to<br />
            find your fancy<br />
            job here
          </h1>
        </div>

        {/* Split Pill CTA Button */}
        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            onClick={handleStart}
            className="bg-[#CEF237] p-1 rounded-full flex items-center w-full max-w-[290px] h-[58px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 shadow-[0_12px_28px_-6px_rgba(180,225,45,0.45)] text-left"
          >
            {/* Black Pill: Get Started */}
            <div className="bg-[#141414] text-white font-bold text-[14px] px-6 h-full flex items-center justify-center rounded-full shrink-0 tracking-tight shadow-sm">
              Get Started
            </div>

            {/* Neon Green Chevron Indicators */}
            <div
              aria-hidden="true"
              className="flex-1 flex items-center justify-center space-x-[-1px] text-[#A6C81F] pr-3 select-none"
            >
              <svg className="w-4 h-4 text-[#A6C81F]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <svg className="w-4 h-4 text-[#98BA1C]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <svg className="w-4 h-4 text-[#89A819]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <svg className="w-4 h-4 text-[#7C9814]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>

        {/* Optional Sign In Link */}
        {onOpenAuth && (
          <button
            type="button"
            onClick={onOpenAuth}
            className="mt-3 text-xs font-bold text-slate-600 hover:text-slate-900 underline"
          >
            Already have an account? Sign In
          </button>
        )}

        {/* iOS Home Indicator */}
        <div className="w-32 h-1 bg-neutral-300 rounded-full mt-4"></div>
      </footer>
    </div>
  );
};
