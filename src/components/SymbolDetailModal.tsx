import React, { useState, useMemo } from 'react';

export interface DetailSymbol {
  symbol: string;
  name: string;
  exchange?: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
  volume?: string;
  currency?: string;
}

interface SymbolDetailModalProps {
  symbolData: DetailSymbol | null;
  onClose: () => void;
  onOpenTrade: (symbol: DetailSymbol) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
}

type TimeFrame = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';
type ChartStyle = 'area' | 'line' | 'candlestick';

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  symbolData,
  onClose,
  onOpenTrade,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1M');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('area');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate deterministic realistic candle / line series data based on symbol and timeframe
  const chartPoints = useMemo(() => {
    if (!symbolData) return [];
    const count = timeframe === '1D' ? 24 : timeframe === '5D' ? 30 : timeframe === '1M' ? 30 : 40;
    const base = symbolData.price;
    const points: { time: string; open: number; high: number; low: number; close: number }[] = [];

    let current = base * (1 - (symbolData.changePercent / 100));
    const seed = symbolData.symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    for (let i = 0; i < count; i++) {
      const pseudoRand = Math.sin(seed * (i + 1)) * 10000;
      const randNorm = pseudoRand - Math.floor(pseudoRand);
      const deltaPercent = (randNorm - 0.48) * (timeframe === '1D' ? 0.008 : 0.02);
      
      const open = current;
      const close = Number((open * (1 + deltaPercent)).toFixed(2));
      const high = Number((Math.max(open, close) * (1 + Math.abs(deltaPercent) * 0.5)).toFixed(2));
      const low = Number((Math.min(open, close) * (1 - Math.abs(deltaPercent) * 0.5)).toFixed(2));
      
      current = close;
      points.push({
        time: timeframe === '1D' ? `${i}:00` : `Day ${i + 1}`,
        open,
        high,
        low,
        close,
      });
    }

    // Force the last point to match current price
    if (points.length > 0) {
      points[points.length - 1].close = symbolData.price;
    }
    return points;
  }, [symbolData, timeframe]);

  if (!symbolData) return null;

  const isBullish = symbolData.change >= 0;
  const currentHover = hoverIndex !== null && chartPoints[hoverIndex] ? chartPoints[hoverIndex] : null;
  const displayPrice = currentHover ? currentHover.close : symbolData.price;

  // Compute SVG coordinates
  const minVal = Math.min(...chartPoints.map((p) => p.low)) * 0.998;
  const maxVal = Math.max(...chartPoints.map((p) => p.high)) * 1.002;
  const range = maxVal - minVal || 1;

  const width = 680;
  const height = 260;
  const paddingX = 20;
  const paddingY = 20;

  const getY = (val: number) => height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);
  const getX = (idx: number) => paddingX + (idx / (chartPoints.length - 1)) * (width - paddingX * 2);

  const linePath = chartPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p.close).toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${getX(chartPoints.length - 1)} ${height - paddingY} L ${getX(0)} ${
    height - paddingY
  } Z`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#131722]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-[#E0E3EB] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-[#E0E3EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F3FA] flex items-center justify-center font-bold text-base text-[#131722] font-mono border border-[#E0E3EB]">
              {symbolData.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#131722]">{symbolData.symbol}</h3>
                <span className="text-xs bg-[#F0F3FA] text-[#6A707C] font-mono font-medium px-2 py-0.5 rounded">
                  {symbolData.exchange || 'INDEX'}
                </span>
              </div>
              <p className="text-xs text-[#6A707C] truncate max-w-xs sm:max-w-md">
                {symbolData.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Watchlist Toggle */}
            <button
              type="button"
              onClick={() => onToggleWatchlist(symbolData.symbol)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'bg-amber-50 border-amber-300 text-amber-500'
                  : 'border-[#E0E3EB] text-[#868993] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isWatchlisted ? 'star' : 'star_border'}
              </span>
            </button>

            {/* Quick Trade Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTrade(symbolData);
              }}
              className="bg-[#2962ff] hover:bg-[#0049db] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Trade
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#6A707C] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-5">
          {/* Top Price & Stats Strip */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl font-extrabold text-[#131722] font-mono tabular-nums tracking-tight">
                ${displayPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: displayPrice < 10 ? 4 : 2,
                })}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-sm font-bold font-mono tabular-nums ${
                    isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isBullish
                    ? `+${symbolData.change.toFixed(2)} (+${symbolData.changePercent.toFixed(2)}%)`
                    : `−${Math.abs(symbolData.change).toFixed(2)} (–${Math.abs(
                        symbolData.changePercent
                      ).toFixed(2)}%)`}
                </span>
                <span className="text-xs text-[#868993]">• Real-time market feed</span>
              </div>
            </div>

            {/* Chart Style & Timeframe Selectors */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Chart Style Toggle */}
              <div className="flex bg-[#F0F3FA] p-0.5 rounded-lg border border-[#E0E3EB]">
                {(['area', 'candlestick', 'line'] as ChartStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setChartStyle(style)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                      chartStyle === style
                        ? 'bg-white text-[#131722] shadow-xs'
                        : 'text-[#6A707C] hover:text-[#131722]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>

              {/* Timeframe Buttons */}
              <div className="flex bg-[#F0F3FA] p-0.5 rounded-lg border border-[#E0E3EB]">
                {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as TimeFrame[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                      timeframe === tf
                        ? 'bg-[#131722] text-white shadow-xs'
                        : 'text-[#6A707C] hover:text-[#131722]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="bg-[#f7f9ff] rounded-xl p-3 border border-[#E0E3EB] relative">
            <svg
              className="w-full h-[220px] sm:h-[260px] overflow-visible"
              viewBox={`0 0 ${width} ${height}`}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <defs>
                <linearGradient id="chartGradBullish" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#089981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#089981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartGradBearish" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F23645" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F23645" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0.25, 0.5, 0.75].map((pct, idx) => {
                const yPos = paddingY + pct * (height - paddingY * 2);
                const val = maxVal - pct * range;
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={yPos}
                      x2={width - paddingX}
                      y2={yPos}
                      stroke="#E0E3EB"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={width - paddingX + 5}
                      y={yPos + 3}
                      fontSize="10"
                      fill="#868993"
                      fontFamily="monospace"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Chart Renderer: Candlestick or Area/Line */}
              {chartStyle === 'candlestick' ? (
                chartPoints.map((pt, idx) => {
                  const x = getX(idx);
                  const isUp = pt.close >= pt.open;
                  const candleColor = isUp ? '#089981' : '#F23645';
                  const top = getY(Math.max(pt.open, pt.close));
                  const bottom = getY(Math.min(pt.open, pt.close));
                  const candleHeight = Math.max(bottom - top, 2);

                  return (
                    <g key={idx} onMouseEnter={() => setHoverIndex(idx)}>
                      {/* High-Low Wick */}
                      <line
                        x1={x}
                        y1={getY(pt.high)}
                        x2={x}
                        y2={getY(pt.low)}
                        stroke={candleColor}
                        strokeWidth="1.5"
                      />
                      {/* Candle Body */}
                      <rect
                        x={x - 4}
                        y={top}
                        width="8"
                        height={candleHeight}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })
              ) : (
                <>
                  {chartStyle === 'area' && (
                    <path
                      d={areaPath}
                      fill={isBullish ? 'url(#chartGradBullish)' : 'url(#chartGradBearish)'}
                    />
                  )}
                  <path
                    d={linePath}
                    fill="none"
                    stroke={isBullish ? '#089981' : '#F23645'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Interactive Hover Point & Vertical Cursor Line */}
              {hoverIndex !== null && chartPoints[hoverIndex] && (
                <g>
                  <line
                    x1={getX(hoverIndex)}
                    y1={paddingY}
                    x2={getX(hoverIndex)}
                    y2={height - paddingY}
                    stroke="#2962ff"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={getX(hoverIndex)}
                    cy={getY(chartPoints[hoverIndex].close)}
                    r="5"
                    fill="#2962ff"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* Transparent overlay hit areas for hover tracking */}
              {chartPoints.map((_, idx) => (
                <rect
                  key={idx}
                  x={getX(idx) - (width / chartPoints.length) / 2}
                  y={0}
                  width={width / chartPoints.length}
                  height={height}
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(idx)}
                />
              ))}
            </svg>

            {hoverIndex !== null && chartPoints[hoverIndex] && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs border border-[#E0E3EB] p-2 rounded-lg shadow-sm text-xs pointer-events-none">
                <span className="text-[#868993] font-medium">{chartPoints[hoverIndex].time}</span>
                <div className="font-bold font-mono text-[#131722] text-sm">
                  ${chartPoints[hoverIndex].close.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Key Statistics Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A707C] mb-3">
              Key Fundamentals & Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#f1f4fb] p-3 rounded-lg">
                <span className="text-[11px] text-[#6A707C]">Market Cap</span>
                <div className="text-[14px] font-bold text-[#131722] font-mono mt-0.5">
                  {symbolData.marketCap || '3.42 TUSD'}
                </div>
              </div>

              <div className="bg-[#f1f4fb] p-3 rounded-lg">
                <span className="text-[11px] text-[#6A707C]">Volume (24h)</span>
                <div className="text-[14px] font-bold text-[#131722] font-mono mt-0.5">
                  {symbolData.volume || '42.8M'}
                </div>
              </div>

              <div className="bg-[#f1f4fb] p-3 rounded-lg">
                <span className="text-[11px] text-[#6A707C]">52-Week Range</span>
                <div className="text-[14px] font-bold text-[#131722] font-mono mt-0.5">
                  ${(symbolData.price * 0.72).toFixed(2)} – ${(symbolData.price * 1.15).toFixed(2)}
                </div>
              </div>

              <div className="bg-[#f1f4fb] p-3 rounded-lg">
                <span className="text-[11px] text-[#6A707C]">P/E Ratio</span>
                <div className="text-[14px] font-bold text-[#131722] font-mono mt-0.5">
                  34.82
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
