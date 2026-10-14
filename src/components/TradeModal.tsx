import React, { useState } from 'react';
import { DetailSymbol } from './SymbolDetailModal';

interface TradeModalProps {
  symbolData: DetailSymbol | null;
  onClose: () => void;
  onTradeExecuted: (tradeInfo: { symbol: string; side: 'Buy' | 'Sell'; amount: number; total: number }) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  symbolData,
  onClose,
  onTradeExecuted,
}) => {
  const [side, setSide] = useState<'Buy' | 'Sell'>('Buy');
  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');
  const [shares, setShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(symbolData?.price || 100);

  if (!symbolData) return null;

  const currentPrice = orderType === 'Market' ? symbolData.price : limitPrice;
  const estimatedTotal = shares * currentPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTradeExecuted({
      symbol: symbolData.symbol,
      side,
      amount: shares,
      total: estimatedTotal,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131722]/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E0E3EB] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#131722]">Order Ticket</h3>
            <span className="text-xs text-[#6A707C]">
              {symbolData.symbol} • {symbolData.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6A707C] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Buy / Sell Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#F0F3FA] rounded-xl border border-[#E0E3EB]">
            <button
              type="button"
              onClick={() => setSide('Buy')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                side === 'Buy'
                  ? 'bg-[#089981] text-white shadow-xs'
                  : 'text-[#6A707C] hover:text-[#131722]'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setSide('Sell')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                side === 'Sell'
                  ? 'bg-[#F23645] text-white shadow-xs'
                  : 'text-[#6A707C] hover:text-[#131722]'
              }`}
            >
              SELL
            </button>
          </div>

          {/* Order Type Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#131722]">Order Type</span>
            <div className="flex bg-[#F0F3FA] p-0.5 rounded-lg border border-[#E0E3EB]">
              {(['Market', 'Limit'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    orderType === type
                      ? 'bg-white text-[#131722] shadow-xs'
                      : 'text-[#6A707C] hover:text-[#131722]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#131722]">Quantity / Units</label>
              <div className="flex items-center gap-1">
                {[1, 5, 10, 50].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setShares((prev) => prev + inc)}
                    className="text-[11px] font-mono px-1.5 py-0.5 bg-[#F0F3FA] hover:bg-[#e5e8ef] text-[#434656] rounded transition-colors"
                  >
                    +{inc}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              min={1}
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 bg-[#F0F3FA] rounded-xl border border-[#E0E3EB] text-[#131722] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#2962ff]/40"
            />
          </div>

          {/* Limit Price if Limit order */}
          {orderType === 'Limit' && (
            <div>
              <label className="text-xs font-semibold text-[#131722] block mb-1">
                Limit Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || symbolData.price)}
                className="w-full px-3 py-2 bg-[#F0F3FA] rounded-xl border border-[#E0E3EB] text-[#131722] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#2962ff]/40"
              />
            </div>
          )}

          {/* Summary */}
          <div className="bg-[#f1f4fb] p-3.5 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-[#6A707C]">
              <span>Market Price:</span>
              <span className="font-mono font-semibold text-[#131722]">
                ${symbolData.price.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[#6A707C]">
              <span>Broker Commission:</span>
              <span className="font-mono font-semibold text-[#089981]">FREE ($0.00)</span>
            </div>
            <div className="border-t border-[#E0E3EB] pt-1.5 flex justify-between font-bold text-sm text-[#131722]">
              <span>Estimated Total:</span>
              <span className="font-mono tabular-nums text-[#2962ff]">
                ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className={`w-full py-2.5 rounded-full font-bold text-sm text-white shadow-md transition-all active:scale-98 cursor-pointer ${
              side === 'Buy' ? 'bg-[#089981] hover:bg-[#006554]' : 'bg-[#F23645] hover:bg-[#ba1a1a]'
            }`}
          >
            Place {side} Order ({shares} units)
          </button>
        </form>
      </div>
    </div>
  );
};
