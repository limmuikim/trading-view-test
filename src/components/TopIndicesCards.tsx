import React from 'react';
import { MarketIndexItem } from '../types/market';

interface TopIndicesCardsProps {
  indices: MarketIndexItem[];
  onSelectIndex: (index: MarketIndexItem) => void;
  flashingSymbols?: Record<string, 'up' | 'down'>;
}

export const TopIndicesCards: React.FC<TopIndicesCardsProps> = ({
  indices,
  onSelectIndex,
  flashingSymbols = {},
}) => {
  const getBadgeConfig = (symbol: string) => {
    switch (symbol) {
      case 'SPX':
        return { text: '500', bg: 'bg-[#D32F2F]', sub: 'SPX • S&P' };
      case 'NDX':
        return { text: '100', bg: 'bg-[#00838F]', sub: 'NDX • NASDAQ' };
      case 'DJI':
        return { text: '30', bg: 'bg-[#0277BD]', sub: 'DJI • DJ' };
      case 'RUT':
      default:
        return { text: '2K', bg: 'bg-[#0049db]', sub: 'RUT • Russell' };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {indices.map((item) => {
        const isBullish = item.change >= 0;
        const badge = getBadgeConfig(item.symbol);
        const flash = flashingSymbols[item.symbol];

        return (
          <div
            key={item.symbol}
            onClick={() => onSelectIndex(item)}
            className={`bg-white rounded-xl p-4 border border-[#E0E3EB] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-[#2962ff]/30 ${
              flash === 'up'
                ? 'ring-2 ring-[#089981]/50 bg-[#E8F5F1]/30'
                : flash === 'down'
                ? 'ring-2 ring-[#F23645]/50 bg-[#FDECEE]/30'
                : ''
            }`}
          >
            {/* Top row: Badge, Name, and Percent Tag */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full ${badge.bg} text-white flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0`}
                >
                  {badge.text}
                </div>
                <div>
                  <div className="text-[13px] text-[#131722] font-bold group-hover:text-[#2962ff] transition-colors leading-tight">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#868993] font-medium">{badge.sub}</div>
                </div>
              </div>

              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[12px] font-semibold tabular-nums font-mono ${
                  isBullish
                    ? 'bg-[#E8F5F1] text-[#089981]'
                    : 'bg-[#FDECEE] text-[#F23645]'
                }`}
              >
                {isBullish ? `+${item.changePercent.toFixed(2)}%` : `−${Math.abs(item.changePercent).toFixed(2)}%`}
              </span>
            </div>

            {/* Bottom row: Value, delta, sparkline */}
            <div className="flex items-end justify-between mt-2">
              <div>
                <div className="text-[22px] sm:text-[24px] text-[#131722] font-bold tracking-tight tabular-nums">
                  {item.lastPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-[12px] font-semibold tabular-nums font-mono mt-0.5 ${
                    isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isBullish
                    ? `+${item.change.toFixed(2)} today`
                    : `−${Math.abs(item.change).toFixed(2)} today`}
                </div>
              </div>

              {/* Sparkline with filled gradient */}
              <div className="w-24 h-10 shrink-0">
                {isBullish ? (
                  <svg className="w-full h-full text-[#089981]" fill="none" viewBox="0 0 100 40">
                    <path
                      d="M0 32 L15 28 L30 35 L45 20 L60 22 L75 12 L100 4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M0 32 L15 28 L30 35 L45 20 L60 22 L75 12 L100 4 L100 40 L0 40 Z"
                      fill="currentColor"
                      fillOpacity="0.08"
                    />
                  </svg>
                ) : (
                  <svg className="w-full h-full text-[#F23645]" fill="none" viewBox="0 0 100 40">
                    <path
                      d="M0 8 L22 10 L44 22 L60 16 L78 30 L100 36"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M0 8 L22 10 L44 22 L60 16 L78 30 L100 36 L100 40 L0 40 Z"
                      fill="currentColor"
                      fillOpacity="0.08"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
