import React from 'react';
import { StockItem, EmployerItem } from '../types/market';

interface WorldStocksSectionProps {
  companies: StockItem[];
  employers: EmployerItem[];
  onSelectStock: (stock: StockItem) => void;
  flashingSymbols?: Record<string, 'up' | 'down'>;
}

export const WorldStocksSection: React.FC<WorldStocksSectionProps> = ({
  companies,
  employers,
  onSelectStock,
  flashingSymbols = {},
}) => {
  return (
    <section id="section-world-stocks" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <a
          href="#section-world-stocks"
          className="group flex items-center gap-1.5 text-[#131722] hover:text-[#2962ff] transition-colors"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">World Stocks</h2>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5 text-[#868993] group-hover:text-[#2962ff]">
            chevron_right
          </span>
        </a>

        <a
          href="#section-world-stocks"
          onClick={(e) => {
            e.preventDefault();
            onSelectStock(companies[0]);
          }}
          className="text-[13px] text-[#2962ff] font-semibold hover:underline flex items-center gap-1"
        >
          <span>World's largest companies ranking</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* World's Biggest Companies Table (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E0E3EB] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#f1f4fb] border-b border-[#E0E3EB] flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#131722]">World's Biggest Companies</h3>
            <span className="text-[12px] text-[#6A707C]">Ranked by Market Capitalization</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#6A707C] text-[12px] font-semibold bg-white border-b border-[#ebeef5]">
                  <th className="py-2.5 px-4 font-semibold">Rank & Company</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Price</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Chg %</th>
                  <th className="py-2.5 px-4 text-right font-semibold">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebeef5]">
                {companies.map((stock, index) => {
                  const isBullish = stock.changePercent >= 0;
                  const flash = flashingSymbols[stock.symbol];

                  return (
                    <tr
                      key={stock.symbol}
                      onClick={() => onSelectStock(stock)}
                      className={`hover:bg-[#F0F3FA] transition-colors cursor-pointer group ${
                        flash === 'up'
                          ? 'bg-[#E8F5F1]'
                          : flash === 'down'
                          ? 'bg-[#FDECEE]'
                          : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 flex items-center gap-3">
                        <span className="font-mono text-[12px] font-semibold text-[#868993] w-4 text-center shrink-0">
                          {index + 1}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#e5e8ef] flex items-center justify-center font-bold text-xs text-[#131722] font-mono shrink-0">
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
                      </td>

                      <td className="py-2.5 px-3 text-right text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                        ${stock.price.toFixed(2)}
                      </td>

                      <td
                        className={`py-2.5 px-3 text-right text-[13px] font-bold font-mono tabular-nums ${
                          isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isBullish
                          ? `+${stock.changePercent.toFixed(2)}%`
                          : `−${Math.abs(stock.changePercent).toFixed(2)}%`}
                      </td>

                      <td className="py-2.5 px-4 text-right text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                        {stock.marketCap}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* World Largest Employers Card (Span 1) */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E3EB] shadow-xs flex flex-col justify-between hover:border-[#2962ff]/30 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0F3FA]">
              <h3 className="text-[15px] text-[#131722] font-bold">Largest employers</h3>
              <span className="text-[12px] text-[#868993] font-medium">Workforce size</span>
            </div>

            <div className="space-y-3.5">
              {employers.map((emp) => (
                <div key={emp.symbol} className="flex items-center justify-between group hover:bg-[#F0F3FA] p-1 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-[#ebeef5] flex items-center justify-center font-bold text-xs text-[#131722] font-mono shrink-0">
                      {emp.symbol}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-[#6A707C]">
                        {emp.sector} • {emp.country}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                      {emp.employees}
                    </div>
                    <div className="text-[11px] text-[#868993]">Employees</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href="#section-world-stocks"
            onClick={(e) => {
              e.preventDefault();
              alert('Showing global workforce leaderboard: 1. Walmart (2.1M), 2. Amazon (1.6M), 3. Foxconn (826K), 4. BYD (869K), 5. Accenture (733K).');
            }}
            className="mt-4 pt-3 border-t border-[#ebeef5] flex items-center justify-between text-[#2962ff] text-[12px] font-semibold hover:underline"
          >
            <span>See all world biggest employers</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </a>
        </div>
      </div>
    </section>
  );
};
