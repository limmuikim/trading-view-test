import React, { useState, useEffect, useRef } from 'react';
import { DetailSymbol } from './SymbolDetailModal';

interface SearchItem extends DetailSymbol {
  type: 'Stock' | 'Index' | 'Crypto' | 'Commodity' | 'Forex' | 'Bond';
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: DetailSymbol) => void;
  allSymbols: SearchItem[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
  allSymbols,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setFilterType('All');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSymbols = allSymbols.filter((item) => {
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      (item.exchange && item.exchange.toLowerCase().includes(query.toLowerCase()));

    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesQuery && matchesType;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#131722]/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E0E3EB] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px] text-[#2962ff]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search markets, tickers, crypto, commodities..."
            className="w-full text-base font-medium text-[#131722] placeholder:text-[#868993] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#868993] hover:text-[#131722] p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] font-mono text-[#868993] bg-[#F0F3FA] px-2 py-0.5 rounded border border-[#E0E3EB]">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-[#F0F3FA] border-b border-[#E0E3EB] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['All', 'Stock', 'Index', 'Crypto', 'Commodity', 'Forex'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-[#131722] text-white shadow-xs'
                  : 'text-[#6A707C] hover:text-[#131722] hover:bg-white/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#ebeef5]">
          {filteredSymbols.length === 0 ? (
            <div className="py-12 text-center text-[#868993] text-sm">
              <span className="material-symbols-outlined text-3xl mb-1 block">search_off</span>
              No instruments found for "{query}"
            </div>
          ) : (
            filteredSymbols.map((item) => {
              const isBullish = item.change >= 0;
              return (
                <div
                  key={`${item.type}-${item.symbol}`}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  className="p-3 hover:bg-[#F0F3FA] rounded-xl flex items-center justify-between cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f1f4fb] flex items-center justify-center font-bold text-xs text-[#131722] font-mono group-hover:bg-[#2962ff] group-hover:text-white transition-colors">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13px] text-[#131722] group-hover:text-[#2962ff] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] bg-[#e5e8ef] text-[#5a5e6b] font-semibold px-1.5 py-0.5 rounded uppercase">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#6A707C] truncate max-w-xs">{item.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[13px] font-bold text-[#131722] font-mono tabular-nums">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: item.price < 10 ? 3 : 2 })}
                    </div>
                    <div
                      className={`text-[11px] font-semibold font-mono tabular-nums ${
                        isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isBullish ? `+${item.changePercent.toFixed(2)}%` : `−${Math.abs(item.changePercent).toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
