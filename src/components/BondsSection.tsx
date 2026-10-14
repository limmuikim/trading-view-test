import React, { useState } from 'react';
import { BondItem, CorporateBondItem } from '../types/market';

interface BondsSectionProps {
  treasuryYields: BondItem[];
  corporateBonds: CorporateBondItem[];
  onSelectBond: (name: string, symbol: string, yieldPct: number) => void;
}

export const BondsSection: React.FC<BondsSectionProps> = ({
  treasuryYields,
  corporateBonds,
  onSelectBond,
}) => {
  const [showCurveChart, setShowCurveChart] = useState(false);

  return (
    <section id="section-bonds" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <a
          href="#section-bonds"
          className="group flex items-center gap-1.5 text-[#131722] hover:text-[#2962ff] transition-colors"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Government Bonds</h2>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5 text-[#868993] group-hover:text-[#2962ff]">
            chevron_right
          </span>
        </a>

        <button
          type="button"
          onClick={() => setShowCurveChart(!showCurveChart)}
          className="text-[13px] text-[#2962ff] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{showCurveChart ? 'Hide yield curve' : 'Customize yield curves'}</span>
          <span className="material-symbols-outlined text-[16px]">tune</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* US Yield Curve Table (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E0E3EB] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#f1f4fb] border-b border-[#E0E3EB] flex items-center justify-between">
            <span className="text-[15px] font-bold text-[#131722]">US Treasury Yield Curve</span>
            <span className="text-[12px] text-[#6A707C]">Constant Maturity Rates</span>
          </div>

          {/* Interactive Yield Curve Visualizer preview */}
          {showCurveChart && (
            <div className="p-4 bg-[#F8F9FD] border-b border-[#E0E3EB] animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#131722]">
                  US Yield Curve Slope (Normal Upward Curve)
                </span>
                <span className="text-xs text-[#2962ff] font-bold">10Y/2Y Spread: +0.422%</span>
              </div>
              <svg className="w-full h-24" viewBox="0 0 500 90">
                <defs>
                  <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2962ff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#E0E3EB" strokeDasharray="3 3" />
                <line x1="40" y1="50" x2="480" y2="50" stroke="#E0E3EB" strokeDasharray="3 3" />
                <line x1="40" y1="80" x2="480" y2="80" stroke="#E0E3EB" />
                {/* Fill area */}
                <path
                  d="M 60 70 L 150 55 L 260 40 L 370 28 L 460 12 L 460 80 L 60 80 Z"
                  fill="url(#curveGrad)"
                />
                {/* Curve line */}
                <path
                  d="M 60 70 L 150 55 L 260 40 L 370 28 L 460 12"
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="3"
                />
                {/* Dots with labels */}
                {[
                  { x: 60, y: 70, lbl: '1Y (4.48%)' },
                  { x: 150, y: 55, lbl: '2Y (4.79%)' },
                  { x: 260, y: 40, lbl: '5Y (5.01%)' },
                  { x: 370, y: 28, lbl: '10Y (5.22%)' },
                  { x: 460, y: 12, lbl: '30Y (5.56%)' },
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#2962ff" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#131722"
                    >
                      {pt.lbl}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#6A707C] text-[12px] font-semibold border-b border-[#ebeef5]">
                  <th className="py-2.5 px-4 font-semibold">Maturity</th>
                  <th className="py-2.5 px-3 font-semibold">Symbol</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Price</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Chg</th>
                  <th className="py-2.5 px-4 text-right font-semibold">Yield %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebeef5]">
                {treasuryYields.map((bond) => {
                  const is10Y = bond.symbol === 'US10Y';
                  const isBullish = bond.change > 0;
                  const isBearish = bond.change < 0;

                  return (
                    <tr
                      key={bond.symbol}
                      onClick={() => onSelectBond(`US Treasury ${bond.maturity}`, bond.symbol, bond.yieldPercent)}
                      className={`hover:bg-[#F0F3FA] transition-colors cursor-pointer group ${
                        is10Y ? 'bg-[#F0F3FA]/30' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 text-[13px] font-semibold text-[#131722] group-hover:text-[#2962ff] transition-colors">
                        {bond.maturity}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[12px] text-[#6A707C]">
                        {bond.symbol}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-[13px] text-[#131722] tabular-nums">
                        {bond.price.toFixed(3)}%
                      </td>

                      <td
                        className={`py-2.5 px-3 text-right font-mono text-[13px] font-medium tabular-nums ${
                          isBullish
                            ? 'text-[#089981]'
                            : isBearish
                            ? 'text-[#F23645]'
                            : 'text-[#6A707C]'
                        }`}
                      >
                        {isBullish ? `+${bond.change.toFixed(2)}%` : isBearish ? `−${Math.abs(bond.change).toFixed(2)}%` : '0.00%'}
                      </td>

                      <td
                        className={`py-2.5 px-4 text-right font-mono text-[13px] font-bold tabular-nums ${
                          is10Y ? 'text-[#0049db]' : 'text-[#131722]'
                        }`}
                      >
                        {bond.yieldPercent.toFixed(3)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Corporate Highlights Card (Span 1) */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E3EB] shadow-xs flex flex-col justify-between hover:border-[#2962ff]/30 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0F3FA]">
              <h3 className="text-[15px] text-[#131722] font-bold">Corporate Highlights</h3>
              <span className="text-[12px] text-[#868993] font-medium">Selected High Yield</span>
            </div>

            <div className="space-y-4">
              {corporateBonds.map((corp) => (
                <div
                  key={corp.isin}
                  onClick={() => onSelectBond(corp.issuer, corp.isin, corp.yieldPercent)}
                  className="group cursor-pointer hover:bg-[#F0F3FA] p-1.5 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors">
                      {corp.issuer}
                    </div>
                    <span className="font-mono text-[13px] font-bold text-[#089981] tabular-nums">
                      {corp.yieldPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6A707C] mt-0.5 font-mono">
                    <span>{corp.isin} • {corp.type}</span>
                    <span>{corp.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href="#section-bonds"
            onClick={(e) => {
              e.preventDefault();
              alert('Displaying 1,400+ investment-grade and high-yield corporate bond series across US, Europe, and Asia.');
            }}
            className="mt-4 pt-3 border-t border-[#ebeef5] flex items-center justify-between text-[#2962ff] text-[12px] font-semibold hover:underline"
          >
            <span>See all corporate bonds</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </a>
        </div>
      </div>
    </section>
  );
};
