export type AssetCategory =
  | 'Indices'
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export interface MarketIndexItem {
  symbol: string;
  name: string;
  country: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  marketState: 'Open' | 'Closed' | 'Pre-market' | 'After-hours';
  sparkline: number[];
  currency?: string;
}

export interface StockItem {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  marketCap?: string;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  sector?: string;
  peRatio?: number;
  high52?: number;
  low52?: number;
}

export interface EmployerItem {
  symbol: string;
  name: string;
  sector: string;
  country: string;
  employees: string;
}

export interface CryptoItem {
  symbol: string;
  name: string;
  pair: string;
  type: string;
  price: number;
  change24h: number;
  marketCap: string;
  symbolGlyph: string;
  color: string;
}

export interface DefiProtocol {
  name: string;
  letter: string;
  tvl: string;
}

export interface CommodityItem {
  symbol: string;
  code: string;
  name: string;
  exchange: string;
  price: number;
  changePercent: number;
  changeNominal: number;
  badge: string;
  badgeBg: string;
  badgeText: string;
  unit: string;
}

export interface ForexItem {
  pair: string;
  symbol: string;
  name: string;
  exchange: string;
  rate: number;
  changePercent: number;
  badge: string;
}

export interface BondItem {
  maturity: string;
  symbol: string;
  price: number;
  change: number;
  yieldPercent: number;
}

export interface CorporateBondItem {
  issuer: string;
  isin: string;
  type: string;
  yieldPercent: number;
  dueDate: string;
}

export interface EarningsEvent {
  company: string;
  ticker: string;
  dateStr: string;
  status: 'Reported' | 'Pending';
  epsAct?: number;
  epsEst: number;
  beatPercent?: number;
  timing: string;
}
