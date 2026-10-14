import React from 'react';
import { CryptoItem, DefiProtocol } from '../types/market';

interface CryptoSectionProps {
  cryptoCoins: CryptoItem[];
  defiProtocols: DefiProtocol[];
  topCryptoMovers: { name: string; change: number }[];
  onSelectCrypto: (crypto: CryptoItem) => void;
  onTradeCrypto: (crypto: CryptoItem) => void;
  flashingSymbols?: Record<string, 'up' | 'down'>;
}

export const CryptoSection: React.FC<CryptoSectionProps> = ({
  cryptoCoins,
  defiProtocols,
  topCryptoMovers,
  onSelectCrypto,
  onTradeCrypto,
  flashingSymbols = {},
}) => {
  return (
    <section id="section-crypto" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <a
          href="#section-crypto"
          className="group flex items-center gap-1.5 text-[#131722] hover:text-[#2962ff] transition-colors"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Crypto</h2>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5 text-[#868993] group-hover:text-[#2962ff]">
            chevron_right
          </span>
        </a>

        <a
          href="#section-crypto"
          onClick={(e) => {
            e.preventDefault();
            onSelectCrypto(cryptoCoins[0]);
          }}
          className="text-[13px] text-[#2962ff] font-semibold hover:underline flex items-center gap-1"
        >
          <span>Explore 12,000+ coins</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Major Coins Table (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E0E3EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f1f4fb] text-[#6A707C] text-[12px] font-semibold border-b border-[#E0E3EB]">
                  <th className="py-2.5 px-4 font-semibold">Asset</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Price</th>
                  <th className="py-2.5 px-3 text-right font-semibold">24h Chg</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Market Cap</th>
                  <th className="py-2.5 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebeef5]">
                {cryptoCoins.map((coin) => {
                  const isBullish = coin.change24h >= 0;
                  const flash = flashingSymbols[coin.symbol];

                  return (
                    <tr
                      key={coin.symbol}
                      className={`hover:bg-[#F0F3FA] transition-colors cursor-pointer group ${
                        flash === 'up'
                          ? 'bg-[#E8F5F1]'
                          : flash === 'down'
                          ? 'bg-[#FDECEE]'
                          : ''
                      }`}
                    >
                      <td
                        className="py-2.5 px-4 flex items-center gap-3"
                        onClick={() => onSelectCrypto(coin)}
                      >
                        <div
                          className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                          style={{ backgroundColor: coin.color }}
                        >
                          {coin.symbolGlyph}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                            {coin.name}
                          </div>
                          <div className="text-[11px] text-[#6A707C] font-mono">
                            {coin.pair} • {coin.type}
                          </div>
                        </div>
                      </td>

                      <td
                        className="py-2.5 px-3 text-right text-[13px] font-bold text-[#131722] font-mono tabular-nums"
                        onClick={() => onSelectCrypto(coin)}
                      >
                        ${coin.price >= 10 ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price.toFixed(4)}
                      </td>

                      <td
                        className={`py-2.5 px-3 text-right text-[13px] font-bold font-mono tabular-nums ${
                          isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                        onClick={() => onSelectCrypto(coin)}
                      >
                        {isBullish ? `+${coin.change24h.toFixed(2)}%` : `−${Math.abs(coin.change24h).toFixed(2)}%`}
                      </td>

                      <td
                        className="py-2.5 px-3 text-right text-[13px] font-medium text-[#131722] font-mono tabular-nums"
                        onClick={() => onSelectCrypto(coin)}
                      >
                        {coin.marketCap}
                      </td>

                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTradeCrypto(coin);
                          }}
                          className="text-[#2962ff] hover:text-white hover:bg-[#2962ff] px-3 py-1 rounded-full text-xs font-semibold border border-[#2962ff]/30 hover:border-transparent transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* TVL & Gainers/Losers Mini Panels */}
        <div className="space-y-4">
          {/* Highest TVL Protocols */}
          <div className="bg-white rounded-xl p-4 border border-[#E0E3EB] shadow-xs hover:border-[#2962ff]/30 transition-colors">
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-[#F0F3FA]">
              <h4 className="text-[14px] font-bold text-[#131722]">Highest TVL Protocols</h4>
              <span className="text-[12px] text-[#6A707C] font-medium">DeFi</span>
            </div>
            <div className="space-y-2.5">
              {defiProtocols.map((proto) => (
                <div key={proto.name} className="flex items-center justify-between text-sm hover:bg-[#F0F3FA] p-1 rounded transition-colors">
                  <div className="flex items-center gap-2 font-semibold text-[#131722]">
                    <span className="w-5 h-5 rounded-full bg-[#ebeef5] flex items-center justify-center text-[10px] font-bold font-mono">
                      {proto.letter}
                    </span>
                    {proto.name}
                  </div>
                  <span className="font-mono font-bold text-[#131722] tabular-nums">{proto.tvl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crypto Movers Summary */}
          <div className="bg-white rounded-xl p-4 border border-[#E0E3EB] shadow-xs hover:border-[#2962ff]/30 transition-colors">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#F0F3FA]">
              <h4 className="text-[14px] font-bold text-[#131722]">Top Crypto Movers</h4>
              <span className="text-[12px] text-[#089981] font-semibold">24h Gain</span>
            </div>
            <div className="space-y-1">
              {topCryptoMovers.map((mover, idx) => {
                const isBull = mover.change >= 0;
                return (
                  <div
                    key={mover.name}
                    className={`flex items-center justify-between py-1.5 px-1 hover:bg-[#F0F3FA] rounded transition-colors ${
                      idx !== topCryptoMovers.length - 1 ? 'border-b border-[#ebeef5]' : ''
                    }`}
                  >
                    <span className="text-[12px] text-[#131722] font-semibold">{mover.name}</span>
                    <span
                      className={`font-mono text-[12px] font-bold tabular-nums ${
                        isBull ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isBull ? `+${mover.change.toFixed(2)}%` : `−${Math.abs(mover.change).toFixed(2)}%`}
                    </span>
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
