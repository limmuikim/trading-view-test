import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MarketNavTabs } from './components/MarketNavTabs';
import { TopIndicesCards } from './components/TopIndicesCards';
import { IndicesSection } from './components/IndicesSection';
import { UsStocksSection } from './components/UsStocksSection';
import { WorldStocksSection } from './components/WorldStocksSection';
import { CryptoSection } from './components/CryptoSection';
import { FuturesForexSection } from './components/FuturesForexSection';
import { BondsSection } from './components/BondsSection';
import { EarningsSection } from './components/EarningsSection';
import { Footer } from './components/Footer';
import { SymbolDetailModal, DetailSymbol } from './components/SymbolDetailModal';
import { SearchModal } from './components/SearchModal';
import { TradeModal } from './components/TradeModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { AuthModal } from './components/AuthModal';

import {
  topIndicesData as initialTopIndices,
  globalIndicesTableData as initialGlobalIndices,
  usStocksHighestVolume as initialHighestVol,
  usStocksTopGainers as initialGainers,
  usStocksTopLosers as initialLosers,
  worldBiggestCompanies as initialWorldCompanies,
  worldLargestEmployers,
  cryptoCoins as initialCryptoCoins,
  defiProtocols,
  topCryptoMovers,
  commoditiesData as initialCommodities,
  forexData as initialForex,
  treasuryYieldCurve,
  corporateBonds,
  earningsEvents,
} from './data/marketData';

import {
  AssetCategory,
  MarketIndexItem,
  StockItem,
  CryptoItem,
  CommodityItem,
  ForexItem,
} from './types/market';

export default function App() {
  // Navigation & Category Tab state
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('Indices');
  const [selectedMarketView, setSelectedMarketView] = useState('Markets, everywhere');

  // Modals & Drawers state
  const [searchOpen, setSearchOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const [selectedSymbol, setSelectedSymbol] = useState<DetailSymbol | null>(null);
  const [tradeSymbol, setTradeSymbol] = useState<DetailSymbol | null>(null);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<DetailSymbol[]>([
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      exchange: 'NASDAQ',
      price: 138.07,
      change: 2.91,
      changePercent: 2.15,
      marketCap: '5.51 TUSD',
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      exchange: 'Crypto',
      price: 68450.00,
      change: 1602.8,
      changePercent: 2.40,
      marketCap: '1.35 TUSD',
    },
  ]);

  // Live simulation tick state
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [flashingSymbols, setFlashingSymbols] = useState<Record<string, 'up' | 'down'>>({});

  // Dynamic live dataset states
  const [topIndices, setTopIndices] = useState<MarketIndexItem[]>(initialTopIndices);
  const [globalIndices, setGlobalIndices] = useState<MarketIndexItem[]>(initialGlobalIndices);
  const [highestVolStocks, setHighestVolStocks] = useState<StockItem[]>(initialHighestVol);
  const [gainersStocks, setGainersStocks] = useState<StockItem[]>(initialGainers);
  const [losersStocks, setLosersStocks] = useState<StockItem[]>(initialLosers);
  const [worldCompanies, setWorldCompanies] = useState<StockItem[]>(initialWorldCompanies);
  const [cryptoCoinsList, setCryptoCoinsList] = useState<CryptoItem[]>(initialCryptoCoins);
  const [commodities, setCommodities] = useState<CommodityItem[]>(initialCommodities);
  const [forex, setForex] = useState<ForexItem[]>(initialForex);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated real-time tick heartbeat
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      // Pick random asset pool to tick
      const pool = Math.floor(Math.random() * 5);
      const isUp = Math.random() > 0.45;
      const pctDelta = (Math.random() * 0.12 + 0.02) * (isUp ? 1 : -1);

      if (pool === 0) {
        // Ticking top indices
        const idx = Math.floor(Math.random() * topIndices.length);
        const item = topIndices[idx];
        const newPrice = Number((item.lastPrice * (1 + pctDelta / 100)).toFixed(2));
        const newChange = Number((item.change + (item.lastPrice * pctDelta) / 100).toFixed(2));
        const newPct = Number((item.changePercent + pctDelta).toFixed(2));

        setTopIndices((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], lastPrice: newPrice, change: newChange, changePercent: newPct };
          return next;
        });

        triggerFlash(item.symbol, isUp ? 'up' : 'down');
      } else if (pool === 1) {
        // Ticking highest volume stocks
        const idx = Math.floor(Math.random() * highestVolStocks.length);
        const item = highestVolStocks[idx];
        const newPrice = Number((item.price * (1 + pctDelta / 100)).toFixed(2));
        const newPct = Number((item.changePercent + pctDelta).toFixed(2));

        setHighestVolStocks((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], price: newPrice, changePercent: newPct };
          return next;
        });

        triggerFlash(item.symbol, isUp ? 'up' : 'down');
      } else if (pool === 2) {
        // Ticking crypto
        const idx = Math.floor(Math.random() * cryptoCoinsList.length);
        const item = cryptoCoinsList[idx];
        const newPrice = Number((item.price * (1 + pctDelta / 100)).toFixed(item.price < 10 ? 4 : 2));
        const newPct = Number((item.change24h + pctDelta).toFixed(2));

        setCryptoCoinsList((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], price: newPrice, change24h: newPct };
          return next;
        });

        triggerFlash(item.symbol, isUp ? 'up' : 'down');
      } else if (pool === 3) {
        // Ticking commodities
        const idx = Math.floor(Math.random() * commodities.length);
        const item = commodities[idx];
        const newPrice = Number((item.price * (1 + pctDelta / 100)).toFixed(item.price < 10 ? 3 : 2));
        const newPct = Number((item.changePercent + pctDelta).toFixed(2));

        setCommodities((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], price: newPrice, changePercent: newPct };
          return next;
        });

        triggerFlash(item.code, isUp ? 'up' : 'down');
      } else {
        // Ticking forex
        const idx = Math.floor(Math.random() * forex.length);
        const item = forex[idx];
        const newRate = Number((item.rate * (1 + (pctDelta * 0.2) / 100)).toFixed(item.rate > 100 ? 3 : 5));
        const newPct = Number((item.changePercent + pctDelta * 0.2).toFixed(2));

        setForex((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], rate: newRate, changePercent: newPct };
          return next;
        });

        triggerFlash(item.symbol, isUp ? 'up' : 'down');
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveSimulating, topIndices, highestVolStocks, cryptoCoinsList, commodities, forex]);

  const triggerFlash = (sym: string, dir: 'up' | 'down') => {
    setFlashingSymbols((prev) => ({ ...prev, [sym]: dir }));
    setTimeout(() => {
      setFlashingSymbols((prev) => {
        const next = { ...prev };
        delete next[sym];
        return next;
      });
    }, 700);
  };

  // Watchlist handlers
  const handleToggleWatchlist = (symbol: string) => {
    const existing = watchlist.find((item) => item.symbol === symbol);
    if (existing) {
      setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
      showToast(`Removed ${symbol} from watchlist`);
    } else {
      // Find candidate from any list
      const candidate = allSearchSymbols.find((s) => s.symbol === symbol);
      if (candidate) {
        setWatchlist((prev) => [...prev, candidate]);
        showToast(`Added ${symbol} to watchlist`);
      }
    }
  };

  const isSymbolWatchlisted = (symbol: string) => {
    return watchlist.some((item) => item.symbol === symbol);
  };

  // Unified searchable symbol catalogue
  const allSearchSymbols = useMemo(() => {
    const list: (DetailSymbol & { type: 'Stock' | 'Index' | 'Crypto' | 'Commodity' | 'Forex' | 'Bond' })[] = [];

    topIndices.forEach((i) =>
      list.push({
        symbol: i.symbol,
        name: i.name,
        exchange: 'INDEX',
        price: i.lastPrice,
        change: i.change,
        changePercent: i.changePercent,
        type: 'Index',
      })
    );

    globalIndices.forEach((i) =>
      list.push({
        symbol: i.symbol,
        name: i.name,
        exchange: `${i.country} Index`,
        price: i.lastPrice,
        change: i.change,
        changePercent: i.changePercent,
        type: 'Index',
      })
    );

    highestVolStocks.forEach((s) =>
      list.push({
        symbol: s.symbol,
        name: s.name,
        exchange: s.exchange,
        price: s.price,
        change: s.change,
        changePercent: s.changePercent,
        marketCap: s.marketCap,
        volume: s.volume,
        type: 'Stock',
      })
    );

    gainersStocks.forEach((s) =>
      list.push({
        symbol: s.symbol,
        name: s.name,
        exchange: s.exchange,
        price: s.price,
        change: s.change,
        changePercent: s.changePercent,
        type: 'Stock',
      })
    );

    losersStocks.forEach((s) =>
      list.push({
        symbol: s.symbol,
        name: s.name,
        exchange: s.exchange,
        price: s.price,
        change: s.change,
        changePercent: s.changePercent,
        type: 'Stock',
      })
    );

    cryptoCoinsList.forEach((c) =>
      list.push({
        symbol: c.symbol,
        name: c.name,
        exchange: c.pair,
        price: c.price,
        change: Number(((c.price * c.change24h) / 100).toFixed(2)),
        changePercent: c.change24h,
        marketCap: c.marketCap,
        type: 'Crypto',
      })
    );

    commodities.forEach((cmd) =>
      list.push({
        symbol: cmd.badge,
        name: cmd.name,
        exchange: cmd.exchange,
        price: cmd.price,
        change: cmd.changeNominal,
        changePercent: cmd.changePercent,
        type: 'Commodity',
      })
    );

    forex.forEach((fx) =>
      list.push({
        symbol: fx.symbol,
        name: fx.name,
        exchange: fx.exchange,
        price: fx.rate,
        change: Number(((fx.rate * fx.changePercent) / 100).toFixed(4)),
        changePercent: fx.changePercent,
        type: 'Forex',
      })
    );

    return list;
  }, [topIndices, globalIndices, highestVolStocks, gainersStocks, losersStocks, cryptoCoinsList, commodities, forex]);

  // Tab navigation & scrolling
  const handleSelectTab = (tab: AssetCategory) => {
    setActiveCategory(tab);
    const targetMap: Record<AssetCategory, string> = {
      Indices: 'section-indices',
      'US stocks': 'section-us-stocks',
      'World stocks': 'section-world-stocks',
      Crypto: 'section-crypto',
      Futures: 'section-futures-forex',
      Forex: 'section-futures-forex',
      'Government bonds': 'section-bonds',
      'Corporate bonds': 'section-bonds',
      ETFs: 'section-us-stocks',
      Economy: 'section-earnings',
    };

    const targetId = targetMap[tab];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Trade submission handler
  const handleTradeExecuted = (trade: { symbol: string; side: 'Buy' | 'Sell'; amount: number; total: number }) => {
    showToast(
      `✓ Executed ${trade.side} ${trade.amount}x ${trade.symbol} for $${trade.total.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#181c21] flex flex-col font-sans selection:bg-[#2962ff] selection:text-white">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131722] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-[#089981] text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWatchlist={() => setWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        isLiveSimulating={isLiveSimulating}
        onToggleLiveSimulation={() => setIsLiveSimulating(!isLiveSimulating)}
        onOpenAuth={() => setAuthOpen(true)}
        onSelectNavTab={(tab) => {
          if (tab === 'Markets') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            showToast(`Navigated to ${tab} portal`);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1">
        {/* Category & Scope Bar */}
        <MarketNavTabs
          activeTab={activeCategory}
          onSelectTab={handleSelectTab}
          selectedMarketView={selectedMarketView}
          onSelectMarketView={(view) => {
            setSelectedMarketView(view);
            showToast(`Viewing: ${view}`);
          }}
        />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top 4 Quick Benchmark Cards */}
          <TopIndicesCards
            indices={topIndices}
            onSelectIndex={(index) =>
              setSelectedSymbol({
                symbol: index.symbol,
                name: index.name,
                exchange: 'INDEX',
                price: index.lastPrice,
                change: index.change,
                changePercent: index.changePercent,
              })
            }
            flashingSymbols={flashingSymbols}
          />

          {/* Section 1: Indices */}
          <IndicesSection
            indices={globalIndices}
            onSelectIndex={(index) =>
              setSelectedSymbol({
                symbol: index.symbol,
                name: index.name,
                exchange: `${index.country} Index`,
                price: index.lastPrice,
                change: index.change,
                changePercent: index.changePercent,
              })
            }
            flashingSymbols={flashingSymbols}
          />

          {/* Section 2: US Stocks Dashboard */}
          <UsStocksSection
            highestVolume={highestVolStocks}
            topGainers={gainersStocks}
            topLosers={losersStocks}
            onSelectStock={(stock) =>
              setSelectedSymbol({
                symbol: stock.symbol,
                name: stock.name,
                exchange: stock.exchange,
                price: stock.price,
                change: stock.change,
                changePercent: stock.changePercent,
                marketCap: stock.marketCap,
                volume: stock.volume,
              })
            }
            flashingSymbols={flashingSymbols}
          />

          {/* Section 3: World Stocks & Largest Companies */}
          <WorldStocksSection
            companies={worldCompanies}
            employers={worldLargestEmployers}
            onSelectStock={(stock) =>
              setSelectedSymbol({
                symbol: stock.symbol,
                name: stock.name,
                exchange: stock.exchange,
                price: stock.price,
                change: stock.change,
                changePercent: stock.changePercent,
                marketCap: stock.marketCap,
              })
            }
            flashingSymbols={flashingSymbols}
          />

          {/* Section 4: Crypto Market Overview & TVL */}
          <CryptoSection
            cryptoCoins={cryptoCoinsList}
            defiProtocols={defiProtocols}
            topCryptoMovers={topCryptoMovers}
            onSelectCrypto={(coin) =>
              setSelectedSymbol({
                symbol: coin.symbol,
                name: coin.name,
                exchange: coin.pair,
                price: coin.price,
                change: Number(((coin.price * coin.change24h) / 100).toFixed(2)),
                changePercent: coin.change24h,
                marketCap: coin.marketCap,
              })
            }
            onTradeCrypto={(coin) =>
              setTradeSymbol({
                symbol: coin.symbol,
                name: coin.name,
                exchange: coin.pair,
                price: coin.price,
                change: Number(((coin.price * coin.change24h) / 100).toFixed(2)),
                changePercent: coin.change24h,
              })
            }
            flashingSymbols={flashingSymbols}
          />

          {/* Section 5: Futures & Currencies / Forex */}
          <FuturesForexSection
            commodities={commodities}
            forex={forex}
            onSelectCommodity={(cmd) =>
              setSelectedSymbol({
                symbol: cmd.badge,
                name: cmd.name,
                exchange: `${cmd.code} • ${cmd.exchange}`,
                price: cmd.price,
                change: cmd.changeNominal,
                changePercent: cmd.changePercent,
              })
            }
            onSelectForex={(fx) =>
              setSelectedSymbol({
                symbol: fx.symbol,
                name: fx.name,
                exchange: fx.exchange,
                price: fx.rate,
                change: Number(((fx.rate * fx.changePercent) / 100).toFixed(4)),
                changePercent: fx.changePercent,
              })
            }
            flashingSymbols={flashingSymbols}
          />

          {/* Section 6: Government Bonds & Corporate Fixed Income */}
          <BondsSection
            treasuryYields={treasuryYieldCurve}
            corporateBonds={corporateBonds}
            onSelectBond={(name, symbol, yieldPct) =>
              setSelectedSymbol({
                symbol: symbol,
                name: name,
                exchange: 'Fixed Income',
                price: yieldPct,
                change: 0.01,
                changePercent: 0.15,
              })
            }
          />

          {/* Section 7: Upcoming Earnings Calendar */}
          <EarningsSection
            events={earningsEvents}
            onSelectTicker={(ticker) => {
              const matched = allSearchSymbols.find((s) => s.symbol === ticker);
              if (matched) {
                setSelectedSymbol(matched);
              } else {
                setSelectedSymbol({
                  symbol: ticker,
                  name: `${ticker} Corp.`,
                  exchange: 'NYSE/NASDAQ',
                  price: 320.5,
                  change: 4.8,
                  changePercent: 1.52,
                });
              }
            }}
          />
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <SymbolDetailModal
        symbolData={selectedSymbol}
        onClose={() => setSelectedSymbol(null)}
        onOpenTrade={(sym) => setTradeSymbol(sym)}
        isWatchlisted={selectedSymbol ? isSymbolWatchlisted(selectedSymbol.symbol) : false}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
        allSymbols={allSearchSymbols}
      />

      <TradeModal
        symbolData={tradeSymbol}
        onClose={() => setTradeSymbol(null)}
        onTradeExecuted={handleTradeExecuted}
      />

      <WatchlistDrawer
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        watchlist={watchlist}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
        onRemoveFromWatchlist={handleToggleWatchlist}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(name) => {
          setUserName(name);
          showToast(`Welcome, ${name}! Logged into TradingView`);
        }}
      />
    </div>
  );
}
