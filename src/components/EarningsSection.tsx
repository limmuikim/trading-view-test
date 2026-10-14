import React from 'react';
import { EarningsEvent } from '../types/market';

interface EarningsSectionProps {
  events: EarningsEvent[];
  onSelectTicker: (ticker: string) => void;
}

export const EarningsSection: React.FC<EarningsSectionProps> = ({
  events,
  onSelectTicker,
}) => {
  return (
    <section id="section-earnings" className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <a
          href="#section-earnings"
          className="group flex items-center gap-1.5 text-[#131722] hover:text-[#2962ff] transition-colors"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Earnings Calendar</h2>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5 text-[#868993] group-hover:text-[#2962ff]">
            chevron_right
          </span>
        </a>

        <a
          href="#section-earnings"
          onClick={(e) => {
            e.preventDefault();
            alert('Opening Economic & Corporate Earnings Calendar filter modal.');
          }}
          className="text-[13px] text-[#2962ff] font-semibold hover:underline flex items-center gap-1"
        >
          <span>Full economic & earnings calendar</span>
          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
        </a>
      </div>

      <div className="bg-white rounded-xl p-5 border border-[#E0E3EB] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {events.map((event) => {
            const isReported = event.status === 'Reported';

            return (
              <div
                key={event.ticker}
                onClick={() => onSelectTicker(event.ticker)}
                className="bg-[#f1f4fb] rounded-lg p-3.5 hover:bg-[#e5e8ef]/60 transition-all cursor-pointer group border border-transparent hover:border-[#2962ff]/30 shadow-xs"
              >
                <div className="flex items-center justify-between text-[12px] text-[#6A707C] mb-1.5">
                  <span className="font-semibold text-[#131722]">{event.dateStr}</span>
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      isReported
                        ? 'bg-[#E8F5F1] text-[#089981]'
                        : 'bg-[#e5e8ef] text-[#5a5e6b]'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                  {event.company} ({event.ticker})
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[12px] text-[#6A707C]">
                  {isReported ? (
                    <>
                      <span>
                        EPS Act: <strong className="text-[#131722] font-mono">{event.epsAct?.toFixed(2)}</strong>
                      </span>
                      <span>
                        Est: <span className="font-mono">{event.epsEst.toFixed(2)}</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        EPS Est: <strong className="text-[#131722] font-mono">{event.epsEst.toFixed(2)}</strong>
                      </span>
                      <span className="font-semibold">USD</span>
                    </>
                  )}
                </div>

                <div className="mt-1.5 text-[11px] font-semibold">
                  {isReported && event.beatPercent ? (
                    <span className="text-[#089981]">+{event.beatPercent}% Beat</span>
                  ) : (
                    <span className="text-[#868993] font-medium">{event.timing}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
