
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
    <div className="min-h-screen bg-gray-900 text-white overflow-y-auto">
      <div className="pb-24 min-h-screen"> 
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <span className="text-lg font-bold text-white">Coral</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-400">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Market Hero Section */}
        <div className="px-4 mb-8">
          <div className="bg-gradient-to-br from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Crypto Market</h2>
                  <p className="text-teal-200">Live prices & real-time data</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-teal-200 text-sm">Total Coins</p>
                  <p className="text-white font-bold text-lg">{marketData.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-teal-200 text-sm">24h Volume</p>
                  <p className="text-white font-bold text-lg">$2.4T</p>
                </div>
                <div className="text-center">
                  <p className="text-teal-200 text-sm">Market Cap</p>
                  <p className="text-white font-bold text-lg">$3.2T</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptocurrency Grid */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-teal-400" />
              <h3 className="text-xl font-bold text-white">All Cryptocurrencies</h3>
            </div>
            <div className="text-xs bg-teal-400/20 text-teal-400 px-3 py-1 rounded-full font-medium">
              Live
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array(6).fill(0).map((_, idx) => (
                <div key={idx} className="animate-pulse bg-gray-800/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
                      <div>
                        <div className="h-4 w-20 bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 w-16 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 w-16 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {marketData.map((crypto, idx) => (
                <Link
                  key={crypto.id}
                  to={`/coin/${crypto.id}`}
                  className="group bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-800/80 transition-all duration-300 border border-gray-700/30 hover:border-teal-400/30"
                  style={{
                    animationDelay: `${idx * 50}ms`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shadow-lg">
                          <img 
                            src={crypto.logo} 
                            alt={crypto.name} 
                            className="w-8 h-8 rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                            }}
                          />
                        </div>
                        {idx < 5 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <Crown className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white text-lg group-hover:text-teal-400 transition-colors">
                            {crypto.name.length > 15 ? crypto.name.substring(0, 15) + '...' : crypto.name}
                          </h4>
                          {idx < 3 && (
                            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                              TOP
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 font-mono text-sm uppercase">{crypto.symbol}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-gray-400">#{crypto.rank || idx + 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-lg font-mono mb-1">
                        ₹{crypto.price > 100 ? crypto.price.toLocaleString(undefined, {maximumFractionDigits: 0}) : crypto.price.toLocaleString()}
                      </div>
                      <div className={cn(
                        "flex items-center justify-end gap-1 font-bold text-sm",
                        (crypto.change || 0) >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {(crypto.change || 0) >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span>
                          {(crypto.change || 0) >= 0 ? '+' : ''}{crypto.change?.toFixed(2) || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional stats bar */}
                  <div className="mt-4 pt-3 border-t border-gray-700/30">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400">Market Cap</span>
                        <p className="text-white font-medium">{crypto.market_cap || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">24h Volume</span>
                        <p className="text-white font-medium">{crypto.volume_24h || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Button */}
      <div className="fixed bottom-28 right-4 z-40">
        <button className="w-14 h-14 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Bot className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MarketPage;
