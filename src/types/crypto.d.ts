
declare interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  binance_symbol?: string;
  price: number;
  change: number;
  logo: string;
  market_cap?: string;
  volume_24h?: string;
  rank?: string;
  picks?: string;
  home?: string;
  status?: string;
}

declare interface CryptoMarketData {
  status: boolean;
  msg: string;
  data: Cryptocurrency[];
}
