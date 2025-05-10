
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import CryptoCard from "@/components/CryptoCard";
import { Sparkles } from "lucide-react";
import { getMarketData } from "@/services/api";

interface CryptoData {
  id: string | number;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  market_cap?: string;
  volume_24h?: string;
  rank?: string;
  status?: string;
  picks?: number;
  home?: number;
  change?: number;
}

const MarketPage = () => {
  const [marketData, setMarketData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Make sure we have a token before fetching
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        
        const response = await getMarketData(token);
        
        if (response.status && Array.isArray(response.data)) {
          // Add a dummy change value since we don't have it in the API
          const dataWithChange = response.data.map((crypto: CryptoData) => ({
            ...crypto,
            change: Math.random() > 0.5 ? +(Math.random() * 5).toFixed(2) : -(Math.random() * 5).toFixed(2), // Random change value
            price: parseFloat(typeof crypto.price === 'string' ? crypto.price : crypto.price.toString())
          }));
          
          // Filter for active cryptocurrencies (status = 1)
          const filteredData = dataWithChange.filter((crypto: CryptoData) => 
            crypto.status === "1" || crypto.status === 1
          );
          
          // Sort by rank (ascending)
          const sortedData = filteredData.sort((a: CryptoData, b: CryptoData) => {
            const rankA = parseInt(a.rank?.toString() || "9999");
            const rankB = parseInt(b.rank?.toString() || "9999");
            return rankA - rankB;
          });
          
          setMarketData(sortedData);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);
  
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
          {isLoading ? (
            Array(8).fill(0).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="p-3.5 border-b border-border/30 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/40"></div>
                    <div>
                      <div className="h-4 w-24 bg-secondary/40 rounded"></div>
                      <div className="h-3 w-12 bg-secondary/40 rounded mt-1.5"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-16 bg-secondary/40 rounded"></div>
                    <div className="h-3 w-10 bg-secondary/40 rounded mt-1.5 ml-auto"></div>
                  </div>
                </div>
              </div>
            ))
          ) : marketData.length > 0 ? (
            marketData.map((crypto, index) => (
              <CryptoCard
                key={crypto.id}
                id={crypto.id}
                name={crypto.name}
                symbol={crypto.symbol}
                price={crypto.price}
                change={crypto.change || 0}
                logo={crypto.logo}
                animationDelay={index * 100}
              />
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No market data available
            </div>
          )}
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
