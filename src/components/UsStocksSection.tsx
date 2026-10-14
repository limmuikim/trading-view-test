import React, { useState } from 'react';
import { StockItem } from '../types/market';

interface UsStocksSectionProps {
  highestVolume: StockItem[];
  topGainers: StockItem[];
  topLosers: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  flashingSymbols?: Record<string, 'up' | 'down'>;
}

export const UsStocksSection: React.FC<UsStocksSectionProps> = ({
  highestVolume,
  topGainers,
  topLosers,
  onSelectStock,
  flashingSymbols = {},
}) => {
  const [tradingSession, setTradingSession] = useState<'regular' | 'premarket'>('regular');

  // Compute session-adjusted values if pre-market is active
  const adjustForSession = (stock: StockItem) => {
    if (tradingSession === 'regular') return stock;
    const factor = (stock.symbol.charCodeAt(0) % 5 - 2) * 0.4;
    const newPrice = Number((stock.price * (1 + factor / 100)).toFixed(2));
    const newChangePercent = Number((stock.changePercent + factor).toFixed(2));
    const newChange = Number((stock.change + (stock.price * factor) / 100).toFixed(2));
    return {
      ...stock,
      price: newPrice,
      changePercent: newChangePercent,
      change: newChange,
    };
  };

  return (
    <section id="section-us-stocks" className="mb-10">
      {/* Header with Title and Session Switcher */}
      <div className="flex items-center justify-between mb-4">
        <a
          href="#section-us-stocks"
          className="group flex items-center gap-1.5 text-[#131722] hover:text-[#2962ff] transition-colors"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">US Stocks</h2>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5 text-[#868993] group-hover:text-[#2962ff]">
            chevron_right
          </span>
        </a>

        {/* Regular hours / Pre-market pill switcher */}
        <div className="flex items-center gap-1 bg-[#F0F3FA] p-0.5 rounded-full border border-[#E0E3EB]">
          <button
            type="button"
            onClick={() => setTradingSession('regular')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              tradingSession === 'regular'
                ? 'bg-[#131722] text-white shadow-xs'
                : 'text-[#6A707C] hover:text-[#131722]'
            }`}
          >
            Regular hours
          </button>
          <button
            type="button"
            onClick={() => setTradingSession('premarket')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              tradingSession === 'premarket'
                ? 'bg-[#131722] text-white shadow-xs'
                : 'text-[#6A707C] hover:text-[#131722]'
            }`}
          >
            Pre-market
          </button>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Highest volume */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E3EB] shadow-xs flex flex-col justify-between hover:border-[#2962ff]/30 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0F3FA]">
              <h3 className="text-[16px] text-[#131722] font-bold">Highest volume</h3>
              <span className="text-[12px] text-[#868993] font-medium">Vol / Share</span>
            </div>

            <div className="space-y-3.5">
              {highestVolume.map((rawStock) => {
                const stock = adjustForSession(rawStock);
                const isBullish = stock.changePercent >= 0;
                const flash = flashingSymbols[stock.symbol];

                return (
                  <div
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`flex items-center justify-between group cursor-pointer hover:bg-[#F0F3FA] p-1.5 rounded-lg transition-colors ${
                      flash === 'up'
                        ? 'bg-[#E8F5F1]'
                        : flash === 'down'
                        ? 'bg-[#FDECEE]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e5e8ef] flex items-center justify-center font-bold text-[#131722] text-xs font-mono shrink-0">
                        {stock.badge || stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                          {stock.name}
                        </div>
                        <div className="text-[11px] text-[#6A707C] font-mono">
                          {stock.symbol} • {stock.exchange}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-[12px] font-semibold font-mono tabular-nums ${
                          isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isBullish
                          ? `+${stock.changePercent.toFixed(2)}%`
                          : `−${Math.abs(stock.changePercent).toFixed(2)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectStock(highestVolume[0])}
            className="mt-4 pt-3 border-t border-[#ebeef5] flex items-center justify-between text-[#2962ff] text-[12px] font-semibold hover:underline w-full cursor-pointer"
          >
            <span>See all most actively traded stocks</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Column 2: Top gainers */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E3EB] shadow-xs flex flex-col justify-between hover:border-[#2962ff]/30 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0F3FA]">
              <h3 className="text-[16px] text-[#131722] font-bold">Top gainers</h3>
              <span className="text-[12px] text-[#089981] font-semibold">Today's surge</span>
            </div>

            <div className="space-y-3.5">
              {topGainers.map((rawStock) => {
                const stock = adjustForSession(rawStock);
                const flash = flashingSymbols[stock.symbol];

                return (
                  <div
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`flex items-center justify-between group cursor-pointer hover:bg-[#F0F3FA] p-1.5 rounded-lg transition-colors ${
                      flash === 'up' ? 'bg-[#E8F5F1]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#E8F5F1] text-[#089981] flex items-center justify-center font-bold text-xs font-mono shrink-0">
                        {stock.badge || stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                          {stock.name}
                        </div>
                        <div className="text-[11px] text-[#6A707C] font-mono">
                          {stock.symbol} • {stock.exchange}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div className="text-[12px] font-bold text-[#089981] font-mono tabular-nums">
                        +{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectStock(topGainers[0])}
            className="mt-4 pt-3 border-t border-[#ebeef5] flex items-center justify-between text-[#2962ff] text-[12px] font-semibold hover:underline w-full cursor-pointer"
          >
            <span>See all stocks with largest growth</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Column 3: Top losers */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E3EB] shadow-xs flex flex-col justify-between hover:border-[#2962ff]/30 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0F3FA]">
              <h3 className="text-[16px] text-[#131722] font-bold">Top losers</h3>
              <span className="text-[12px] text-[#F23645] font-semibold">Today's drop</span>
            </div>

            <div className="space-y-3.5">
              {topLosers.map((rawStock) => {
                const stock = adjustForSession(rawStock);
                const flash = flashingSymbols[stock.symbol];

                return (
                  <div
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`flex items-center justify-between group cursor-pointer hover:bg-[#F0F3FA] p-1.5 rounded-lg transition-colors ${
                      flash === 'down' ? 'bg-[#FDECEE]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FDECEE] text-[#F23645] flex items-center justify-center font-bold text-xs font-mono shrink-0">
                        {stock.badge || stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                          {stock.name}
                        </div>
                        <div className="text-[11px] text-[#6A707C] font-mono">
                          {stock.symbol} • {stock.exchange}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div className="text-[12px] font-bold text-[#F23645] font-mono tabular-nums">
                        −{Math.abs(stock.changePercent).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectStock(topLosers[0])}
            className="mt-4 pt-3 border-t border-[#ebeef5] flex items-center justify-between text-[#2962ff] text-[12px] font-semibold hover:underline w-full cursor-pointer"
          >
            <span>See all stocks with largest drop</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};
