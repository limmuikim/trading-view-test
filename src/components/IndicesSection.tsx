import React, { useState } from 'react';
import { MarketIndexItem } from '../types/market';

interface IndicesSectionProps {
  indices: MarketIndexItem[];
  onSelectIndex: (index: MarketIndexItem) => void;
  flashingSymbols?: Record<string, 'up' | 'down'>;
}

const additionalIndices: MarketIndexItem[] = [
  {
    symbol: 'AXJO',
    name: 'S&P/ASX 200 (Australia)',
    country: 'AU',
    lastPrice: 8252.80,
    change: 41.20,
    changePercent: 0.50,
    marketState: 'Closed',
    sparkline: [12, 14, 18, 15, 8],
  },
  {
    symbol: 'SMI',
    name: 'Swiss Market Index (Switzerland)',
    country: 'CH',
    lastPrice: 12185.30,
    change: -28.40,
    changePercent: -0.23,
    marketState: 'Open',
    sparkline: [8, 12, 16, 20, 24],
  },
  {
    symbol: 'KOSPI',
    name: 'KOSPI Index (South Korea)',
    country: 'KR',
    lastPrice: 2623.29,
    change: 18.75,
    changePercent: 0.72,
    marketState: 'Closed',
    sparkline: [22, 18, 14, 10, 6],
  },
];

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  indices,
  onSelectIndex,
  flashingSymbols = {},
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayedIndices = showAll ? [...indices, ...additionalIndices] : indices;

  return (
    <section id="section-indices" className="mb-10">
      <div className="flex items-center justify-between mb-3.5">
        <a
          href="#section-indices"
          className="group flex items-center gap-1.5 text-[#131722] hover:text-[#2962ff] transition-colors"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Indices</h2>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5 text-[#868993] group-hover:text-[#2962ff]">
            chevron_right
          </span>
        </a>

        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-[13px] text-[#2962ff] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{showAll ? 'Show fewer indices' : 'See all major indices'}</span>
          <span className="material-symbols-outlined text-[16px]">
            {showAll ? 'expand_less' : 'arrow_forward'}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E0E3EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f1f4fb] text-[#6A707C] text-[12px] font-semibold border-b border-[#E0E3EB]">
                <th className="py-2.5 px-4 font-semibold">Symbol & Index</th>
                <th className="py-2.5 px-3 text-right font-semibold">Last Price</th>
                <th className="py-2.5 px-3 text-right font-semibold">Chg</th>
                <th className="py-2.5 px-3 text-right font-semibold">Chg %</th>
                <th className="py-2.5 px-3 text-center font-semibold">Market State</th>
                <th className="py-2.5 px-4 text-right font-semibold">24h Spark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebeef5]">
              {displayedIndices.map((row) => {
                const isBullish = row.change >= 0;
                const flash = flashingSymbols[row.symbol];

                return (
                  <tr
                    key={row.symbol}
                    onClick={() => onSelectIndex(row)}
                    className={`hover:bg-[#F0F3FA] transition-colors cursor-pointer group ${
                      flash === 'up'
                        ? 'bg-[#E8F5F1]'
                        : flash === 'down'
                        ? 'bg-[#FDECEE]'
                        : ''
                    }`}
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#e5e8ef] flex items-center justify-center font-bold text-xs text-[#131722] font-mono shrink-0">
                          {row.country}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors">
                            {row.symbol}
                          </div>
                          <div className="text-[12px] text-[#6A707C]">{row.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-right text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                      {row.lastPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td
                      className={`py-2.5 px-3 text-right text-[13px] font-semibold font-mono tabular-nums ${
                        isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isBullish
                        ? `+${row.change.toFixed(2)}`
                        : `−${Math.abs(row.change).toFixed(2)}`}
                    </td>

                    <td
                      className={`py-2.5 px-3 text-right text-[13px] font-bold font-mono tabular-nums ${
                        isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isBullish
                        ? `+${row.changePercent.toFixed(2)}%`
                        : `−${Math.abs(row.changePercent).toFixed(2)}%`}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          row.marketState === 'Open'
                            ? 'bg-[#E8F5F1] text-[#089981]'
                            : 'bg-[#e5e8ef] text-[#5a5e6b]'
                        }`}
                      >
                        {row.marketState}
                      </span>
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      {isBullish ? (
                        <svg
                          className="w-20 h-6 inline-block text-[#089981]"
                          fill="none"
                          viewBox="0 0 80 24"
                        >
                          <path
                            d="M0 18 L20 14 L35 17 L55 8 L80 4"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="1.75"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-20 h-6 inline-block text-[#F23645]"
                          fill="none"
                          viewBox="0 0 80 24"
                        >
                          <path
                            d="M0 6 L25 8 L45 16 L65 14 L80 20"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="1.75"
                          />
                        </svg>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
