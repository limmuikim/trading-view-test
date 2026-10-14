import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#E0E3EB] shadow-[0_-1px_6px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-10 border-b border-[#ebeef5]">
          {/* Column 1: Products */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase tracking-wider text-[#6A707C] font-bold">
              Products
            </span>
            <nav className="flex flex-col gap-2">
              {['Supercharts', 'Screeners', 'Heatmaps', 'Economic Calendar', 'More products'].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-[13px] text-[#434656] hover:text-[#131722] transition-colors"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>
          </div>

          {/* Column 2: Community */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase tracking-wider text-[#6A707C] font-bold">
              Community
            </span>
            <nav className="flex flex-col gap-2">
              {['Ideas', 'Scripts & Pine', 'House Rules', 'Moderators', 'Chat'].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[13px] text-[#434656] hover:text-[#131722] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Subscriptions */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase tracking-wider text-[#6A707C] font-bold">
              Subscriptions
            </span>
            <nav className="flex flex-col gap-2">
              {['Essential', 'Plus', 'Premium', 'Ultimate', 'Broker integrations'].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[13px] text-[#434656] hover:text-[#131722] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 4: Company */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase tracking-wider text-[#6A707C] font-bold">
              Company
            </span>
            <nav className="flex flex-col gap-2">
              {['About', 'Features', 'Careers', 'Press', 'Manifesto'].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[13px] text-[#434656] hover:text-[#131722] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 5: Policies & Security */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase tracking-wider text-[#6A707C] font-bold">
              Policies & Security
            </span>
            <nav className="flex flex-col gap-2">
              {['Terms of service', 'Privacy policy', 'Security & Trust', 'Disclaimers', 'Status page'].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-[13px] text-[#434656] hover:text-[#131722] transition-colors"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#131722] flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold tracking-tight">TV</span>
            </div>
            <span className="text-[12px] text-[#868993]">
              © 2025 TradingView, Inc. All rights reserved. Look first / Then leap.
            </span>
          </div>

          <div className="text-[12px] text-[#868993] max-w-xl text-left md:text-right">
            Market data and real-time feeds are provided by ICE Data Services, BATS, CME Group, and respective worldwide exchanges. Disclaimers apply.
          </div>
        </div>
      </div>
    </footer>
  );
};
