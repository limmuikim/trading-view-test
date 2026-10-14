import React from 'react';
import { CommodityItem, ForexItem } from '../types/market';

interface FuturesForexSectionProps {
  commodities: CommodityItem[];
  forex: ForexItem[];
  onSelectCommodity: (item: CommodityItem) => void;
  onSelectForex: (item: ForexItem) => void;
  flashingSymbols?: Record<string, 'up' | 'down'>;
}

export const FuturesForexSection: React.FC<FuturesForexSectionProps> = ({
  commodities,
  forex,
  onSelectCommodity,
  onSelectForex,
  flashingSymbols = {},
}) => {
  return (
    <section id="section-futures-forex" className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Futures & Commodities */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E3EB] shadow-xs flex flex-col justify-between hover:border-[#2962ff]/30 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0F3FA]">
              <a
                href="#section-futures-forex"
                className="group flex items-center gap-1.5 text-[#131722] hover:text-[#2962ff] transition-colors"
              >
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Futures & Commodities</h2>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5 text-[#868993] group-hover:text-[#2962ff]">
                  chevron_right
                </span>
              </a>
              <span className="text-[12px] text-[#6A707C] font-medium">NYMEX / COMEX</span>
            </div>

            <div className="divide-y divide-[#ebeef5]">
              {commodities.map((item) => {
                const isBullish = item.changePercent >= 0;
                const flash = flashingSymbols[item.code];

                return (
                  <div
                    key={item.code}
                    onClick={() => onSelectCommodity(item)}
                    className={`py-3 flex items-center justify-between hover:bg-[#F0F3FA] transition-colors px-1.5 rounded-lg cursor-pointer group ${
                      flash === 'up'
                        ? 'bg-[#E8F5F1]'
                        : flash === 'down'
                        ? 'bg-[#FDECEE]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full ${item.badgeBg} ${item.badgeText} flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-xs`}
                      >
                        {item.badge}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#6A707C] font-mono">
                          {item.code} • {item.exchange}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                        {item.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: item.price < 10 ? 3 : 2,
                        })}{' '}
                        {item.unit}
                      </div>
                      <div
                        className={`text-[12px] font-medium font-mono tabular-nums ${
                          isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isBullish
                          ? `+${item.changePercent.toFixed(2)}% (+${item.changeNominal.toFixed(2)})`
                          : `−${Math.abs(item.changePercent).toFixed(2)}% (−${Math.abs(
                              item.changeNominal
                            ).toFixed(2)})`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Forex Major Pairs */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E3EB] shadow-xs flex flex-col justify-between hover:border-[#2962ff]/30 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0F3FA]">
              <a
                href="#section-futures-forex"
                className="group flex items-center gap-1.5 text-[#131722] hover:text-[#2962ff] transition-colors"
              >
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Forex & Currencies</h2>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5 text-[#868993] group-hover:text-[#2962ff]">
                  chevron_right
                </span>
              </a>
              <span className="text-[12px] text-[#6A707C] font-medium">FX Rates Major</span>
            </div>

            <div className="divide-y divide-[#ebeef5]">
              {forex.map((item) => {
                const isBullish = item.changePercent >= 0;
                const flash = flashingSymbols[item.symbol];

                return (
                  <div
                    key={item.symbol}
                    onClick={() => onSelectForex(item)}
                    className={`py-3 flex items-center justify-between hover:bg-[#F0F3FA] transition-colors px-1.5 rounded-lg cursor-pointer group ${
                      flash === 'up'
                        ? 'bg-[#E8F5F1]'
                        : flash === 'down'
                        ? 'bg-[#FDECEE]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e5e8ef] text-[#131722] flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-xs">
                        {item.badge}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#6A707C] font-mono">
                          {item.symbol} • {item.exchange}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                        {item.rate.toFixed(item.rate > 100 ? 3 : 5)}
                      </div>
                      <div
                        className={`text-[12px] font-medium font-mono tabular-nums ${
                          isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isBullish ? `+${item.changePercent.toFixed(2)}%` : `−${Math.abs(item.changePercent).toFixed(2)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
