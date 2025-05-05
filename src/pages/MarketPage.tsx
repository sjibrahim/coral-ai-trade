
import MobileLayout from "@/components/layout/MobileLayout";
import CryptoCard from "@/components/CryptoCard";
import { mockCryptoCurrencies } from "@/data/mockData";
import { Sparkles } from "lucide-react";

const MarketPage = () => {
  return (
    <MobileLayout title="Market">
      <div className="p-4 space-y-4 pb-20 market-page-content">
        {/* Header with animation */}
        <div className="flex items-center mb-3">
          <Sparkles className="w-5 h-5 text-blue-400 mr-2 animate-pulse-glow" />
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-100 bg-clip-text text-transparent">
            Live Markets
          </h2>
        </div>
        
        <div className="bg-card/50 rounded-xl overflow-hidden backdrop-blur-sm border border-white/5 shadow-lg">
          {mockCryptoCurrencies.map((crypto, index) => (
            <CryptoCard
              key={crypto.id}
              id={crypto.id}
              name={crypto.name}
              symbol={crypto.symbol}
              price={crypto.price}
              change={crypto.change}
              logo={crypto.logo}
              animationDelay={index * 100}
            />
          ))}
        </div>
        
        {/* Animated decoration */}
        <div className="w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 mt-8 animate-pulse-glow"></div>
        
        {/* Add extra padding at the bottom to ensure content is scrollable past the navbar */}
        <div className="h-16"></div>
      </div>
    </MobileLayout>
  );
};

export default MarketPage;
