import React, { useState } from 'react';
import { AssetCategory } from '../types/market';

interface MarketNavTabsProps {
  activeTab: AssetCategory;
  onSelectTab: (tab: AssetCategory) => void;
  selectedMarketView: string;
  onSelectMarketView: (view: string) => void;
}

const tabs: AssetCategory[] = [
  'Indices',
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
];

const marketViews = [
  'Markets, everywhere',
  'Equities & Tech Stocks',
  'Foreign Exchange & Rates',
  'Cryptocurrencies & DeFi',
  'Futures & Raw Commodities',
];

export const MarketNavTabs: React.FC<MarketNavTabsProps> = ({
  activeTab,
  onSelectTab,
  selectedMarketView,
  onSelectMarketView,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-white border-b border-[#E0E3EB] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        {/* Title & View Selector Dropdown */}
        <div className="relative inline-block mb-4">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 cursor-pointer group text-left focus:outline-none"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131722] tracking-tight group-hover:text-[#2962ff] transition-colors">
              {selectedMarketView}
            </h1>
            <span
              className={`material-symbols-outlined text-[#6A707C] group-hover:text-[#2962ff] text-[24px] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E0E3EB] py-1.5 z-30">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#868993] uppercase tracking-wider">
                Select Market Scope
              </div>
              {marketViews.map((view) => (
                <button
                  key={view}
                  onClick={() => {
                    onSelectMarketView(view);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-[#F0F3FA] transition-colors ${
                    selectedMarketView === view ? 'font-bold text-[#2962ff] bg-[#F0F3FA]/60' : 'text-[#131722]'
                  }`}
                >
                  <span>{view}</span>
                  {selectedMarketView === view && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Category Pill Tabs */}
        <div className="overflow-x-auto no-scrollbar pb-1">
          <nav className="flex items-center gap-1.5 min-w-max p-1 bg-[#F0F3FA] rounded-full border border-[#E0E3EB]/70">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onSelectTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#131722] text-white shadow-sm'
                      : 'text-[#6A707C] hover:text-[#131722] hover:bg-white/60'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
