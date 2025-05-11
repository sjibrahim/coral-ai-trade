
declare interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  binance_symbol: string;
  price: number;
  change: number;
  logo: string;
  market_cap?: string;
  volume_24h?: string;
  rank?: string;
  picks?: string;
  home?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

declare interface CryptoMarketData {
  status: boolean;
  msg: string;
  data: Cryptocurrency[];
}

declare interface CoinResponse {
  status: boolean;
  msg: string;
  data: Cryptocurrency;
}
