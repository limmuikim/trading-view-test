import React from 'react';
import { DetailSymbol } from './SymbolDetailModal';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: DetailSymbol[];
  onSelectSymbol: (symbol: DetailSymbol) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  onSelectSymbol,
  onRemoveFromWatchlist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#131722]/40 backdrop-blur-xs animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-[#E0E3EB] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#2962ff]">bookmark</span>
            <h3 className="font-bold text-base text-[#131722]">My Watchlist</h3>
            <span className="text-xs bg-[#F0F3FA] font-bold text-[#2962ff] px-2 py-0.5 rounded-full">
              {watchlist.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6A707C] hover:text-[#131722] hover:bg-[#F0F3FA]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#ebeef5] p-2">
          {watchlist.length === 0 ? (
            <div className="py-16 text-center text-[#868993] text-sm px-4">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#868993] block">
                star_border
              </span>
              <p className="font-semibold text-[#131722]">Your watchlist is empty</p>
              <p className="text-xs text-[#6A707C] mt-1">
                Click any symbol row or star icon in the chart view to pin your favorite assets here.
              </p>
            </div>
          ) : (
            watchlist.map((item) => {
              const isBullish = item.change >= 0;

              return (
                <div
                  key={item.symbol}
                  className="p-3 hover:bg-[#F0F3FA] rounded-xl flex items-center justify-between group transition-colors cursor-pointer"
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f1f4fb] flex items-center justify-center font-bold text-xs text-[#131722] font-mono">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                        {item.symbol}
                      </div>
                      <div className="text-xs text-[#6A707C] truncate max-w-[130px]">{item.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-[#131722] tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                      <div
                        className={`font-mono text-xs font-semibold tabular-nums ${
                          isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isBullish ? `+${item.changePercent.toFixed(2)}%` : `−${Math.abs(item.changePercent).toFixed(2)}%`}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(item.symbol);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#868993] hover:text-[#F23645] transition-opacity"
                      title="Remove from watchlist"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {watchlist.length > 0 && (
          <div className="p-3 border-t border-[#E0E3EB] bg-[#f1f4fb] flex items-center justify-between text-xs text-[#6A707C]">
            <span>Auto-saving to browser</span>
            <button
              onClick={() => watchlist.forEach((item) => onRemoveFromWatchlist(item.symbol))}
              className="text-[#F23645] hover:underline font-semibold"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
