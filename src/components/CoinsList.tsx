
import { useState, useEffect } from "react";
import CryptoCard from "@/components/CryptoCard";
import { mockCryptoCurrencies } from "@/data/mockData";

const CoinsList = () => {
  const [cryptoData, setCryptoData] = useState(mockCryptoCurrencies);
  const [loading, setLoading] = useState(false);

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 font-medium text-lg">Market</h3>
        <button className="text-teal-400 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="bg-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-700/30">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/30">
            {cryptoData.slice(0, 6).map((crypto, index) => (
              <CryptoCard
                key={crypto.id}
                id={crypto.id}
                name={crypto.name}
                symbol={crypto.symbol}
                price={crypto.price}
                change={crypto.change}
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
