
import { useState, useEffect } from "react";
import CryptoCard from "@/components/CryptoCard";
import { mockCryptoCurrencies } from "@/data/mockData";

interface CryptoData {
  id: string | number;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  market_cap?: string;
  volume_24h?: string;
  rank?: string;
  status?: string | number;
  picks?: number | string;
  home?: number | string;
  change?: number;
  binance_symbol?: string;
}

interface CoinsListProps {
  marketData?: CryptoData[];
  loading?: boolean;
}

const CoinsList = ({ marketData = [], loading = false }: CoinsListProps) => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(mockCryptoCurrencies);

  // Use live market data if available, otherwise use mock data
  useEffect(() => {
    if (marketData && marketData.length > 0) {
      // Filter to only show coins where home = "1" or home = 1
      const homeCoins = marketData.filter(coin => 
        coin.home === "1" || coin.home === 1
      );
      
      // Map the filtered market data to match our expected format
      const formattedData: CryptoData[] = homeCoins.map((coin) => ({
        ...coin,
        id: String(coin.id), // Ensure id is always a string
        change: coin.change || 0, // Provide default value for change
        binance_symbol: coin.binance_symbol || (coin.symbol ? `${coin.symbol.toUpperCase()}USDT` : 'BTCUSDT')
      }));
      setCryptoData(formattedData);
    }
  }, [marketData]);

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-lg">Market</h3>
        <button className="text-teal-400 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="bg-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-700/30">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/30">
            {cryptoData.map((crypto, index) => (
              <CryptoCard
                key={crypto.id}
                id={String(crypto.id)}
                name={crypto.name}
                symbol={crypto.symbol}
                price={crypto.price}
                change={crypto.change || 0}
                logo={crypto.logo}
                binance_symbol={crypto.binance_symbol}
                animationDelay={index * 100}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinsList;
