import React, { useState } from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  isLiveSimulating: boolean;
  onToggleLiveSimulation: () => void;
  onOpenAuth: () => void;
  onSelectNavTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  isLiveSimulating,
  onToggleLiveSimulation,
  onOpenAuth,
  onSelectNavTab,
}) => {
  const [activeNav, setActiveNav] = useState('Markets');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const navItems = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-[#E0E3EB] shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-colors">
      <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand logo & Quick Search */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 shrink-0 group focus:outline-none"
            title="TradingView Markets Overview"
          >
            <div className="w-9 h-9 rounded bg-[#131722] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <span className="text-white text-[15px] font-bold tracking-tight">TV</span>
            </div>
            <span className="hidden md:inline-block font-bold text-sm tracking-tight text-[#131722]">
              TradingView
            </span>
          </a>

          {/* Search Trigger Capsule (Ctrl+K) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 bg-[#F0F3FA] hover:bg-[#E8EDF7] rounded-full px-3.5 py-1.5 text-[#6A707C] w-full max-w-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#2962ff]/40 text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px] text-[#868993]">search</span>
            <span className="text-[13px] font-normal text-[#868993] flex-1 truncate">
              Search markets, tickers...
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-white text-[#868993] text-[11px] font-medium px-1.5 py-0.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[#E0E3EB]">
              Ctrl+K
            </kbd>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  if (onSelectNavTab) onSelectNavTab(item);
                }}
                className={`text-[13px] font-medium transition-colors ${
                  activeNav === item
                    ? 'text-[#2962ff] font-bold'
                    : 'text-[#434656] hover:text-[#131722]'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Live Data Feed Simulation Toggle */}
          <button
            type="button"
            onClick={onToggleLiveSimulation}
            title={isLiveSimulating ? 'Live Market Feeds Active' : 'Market Feeds Paused'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#E0E3EB] hover:bg-[#F0F3FA] transition-colors cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveSimulating ? 'bg-[#089981] animate-pulse' : 'bg-[#868993]'
              }`}
            />
            <span className="text-[#434656] text-[11px] font-semibold">
              {isLiveSimulating ? 'LIVE TICK' : 'PAUSED'}
            </span>
          </button>

          {/* Watchlist Quick Button */}
          <button
            type="button"
            onClick={onOpenWatchlist}
            className="relative flex items-center justify-center w-8 h-8 rounded-full text-[#434656] hover:bg-[#F0F3FA] hover:text-[#131722] transition-colors"
            title="Open Watchlist"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#2962ff] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="hidden sm:flex items-center gap-1 text-[#434656] hover:text-[#131722] px-2 py-1 rounded-full hover:bg-[#F0F3FA] transition-colors text-xs font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">language</span>
              <span>{currentLang}</span>
              <span className="material-symbols-outlined text-[15px]">expand_more</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-[#E0E3EB] py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                {['EN', 'ES', 'DE', 'FR', 'JA', 'ZH'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCurrentLang(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#F0F3FA] flex items-center justify-between ${
                      currentLang === lang ? 'font-bold text-[#2962ff]' : 'text-[#131722]'
                    }`}
                  >
                    <span>{lang}</span>
                    {currentLang === lang && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Sign-in Icon */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full bg-[#2962ff] hover:bg-[#0049db] flex items-center justify-center text-white shrink-0 transition-colors shadow-sm"
            title="Account profile"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>

          {/* Get Started CTA Button */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="bg-[#2962ff] hover:bg-[#0049db] text-white text-[13px] font-semibold px-4 py-1.5 rounded-full transition-all shadow-[0_2px_8px_rgba(41,98,255,0.22)] active:scale-95 cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
