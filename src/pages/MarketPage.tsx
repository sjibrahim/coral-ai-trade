
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { getMarketData } from "@/services/api";
import { 
  Search, Filter, Crown, Activity,
  ArrowUpRight, ArrowDownRight, Bot, Sparkles,
  TrendingUp, Star, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";

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
}

const MarketPage = () => {
  const [marketData, setMarketData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        
        const response = await getMarketData(token);
        
        if (response.status && Array.isArray(response.data)) {
          const dataWithChange = response.data.map((crypto: CryptoData) => ({
            ...crypto,
            change: Math.random() > 0.5 ? +(Math.random() * 15).toFixed(2) : -(Math.random() * 15).toFixed(2),
            price: parseFloat(typeof crypto.price === 'string' ? crypto.price : crypto.price.toString()),
            logo: crypto.logo || `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${crypto.symbol.toLowerCase()}.png`
          }));
          
          const filteredData = dataWithChange.filter((crypto: CryptoData) => {
            const statusValue = crypto.status?.toString();
            return statusValue === "1";
          });
          
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">Market</span>
              <p className="text-xs text-gray-400">Live Crypto Prices</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 p-2">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 p-2">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pb-28 min-h-0 flex-1">
        {/* Mobile Hero Stats */}
        <div className="px-4 py-6">
          <div className="bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-blue-500/10 rounded-2xl p-4 border border-teal-500/20">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-teal-200 text-xs">Total Coins</p>
                <p className="text-white font-bold text-lg">{marketData.length}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <p className="text-blue-200 text-xs">24h Volume</p>
                <p className="text-white font-bold text-lg">$2.4T</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="text-purple-200 text-xs">Market Cap</p>
                <p className="text-white font-bold text-lg">$3.2T</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-optimized Cryptocurrency List */}
        <div className="px-4 pb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-bold text-white">Live Prices</h3>
            </div>
            <div className="text-xs bg-green-400/20 text-green-400 px-3 py-1 rounded-full font-medium">
              Real-time
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array(8).fill(0).map((_, idx) => (
                <div key={idx} className="animate-pulse bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-xl"></div>
                      <div>
                        <div className="h-4 w-20 bg-gray-700 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-20 bg-gray-700 rounded mb-1"></div>
                      <div className="h-3 w-12 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {marketData.map((crypto, idx) => (
                <Link
                  key={crypto.id}
                  to={`/coin/${crypto.id}`}
                  className="group block bg-gray-800/50 rounded-xl p-3 hover:bg-gray-800/80 transition-all duration-200 border border-gray-700/30 hover:border-teal-400/30"
                  style={{
                    animationDelay: `${idx * 30}ms`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                          <img 
                            src={crypto.logo} 
                            alt={crypto.name} 
                            className="w-6 h-6"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                            }}
                          />
                        </div>
                        {idx < 3 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Crown className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-semibold text-white text-sm group-hover:text-teal-400 transition-colors truncate">
                            {crypto.name}
                          </h4>
                          {idx < 5 && (
                            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                              TOP
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs font-mono uppercase">{crypto.symbol}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 text-yellow-400" />
                            <span className="text-xs text-gray-500">#{crypto.rank || idx + 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-white text-sm font-mono mb-0.5">
                        ₹{crypto.price > 100 ? crypto.price.toLocaleString(undefined, {maximumFractionDigits: 0}) : crypto.price.toLocaleString()}
                      </div>
                      <div className={cn(
                        "flex items-center justify-end gap-1 font-semibold text-xs",
                        (crypto.change || 0) >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {(crypto.change || 0) >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>
                          {(crypto.change || 0) >= 0 ? '+' : ''}{crypto.change?.toFixed(2) || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile AI Assistant Button */}
      <div className="fixed bottom-32 right-4 z-40">
        <button className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Bot className="w-5 h-5 text-white" />
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MarketPage;
