
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { getMarketData } from "@/services/api";
import { 
  TrendingUp, TrendingDown, Star, Activity, 
  Search, Filter, Crown, Zap, BarChart3,
  ArrowUpRight, ArrowDownRight, Eye, Sparkles,
  Home, Users, TrendingUpIcon, DollarSign, User, Monitor, Bot
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
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');
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

  const getFilteredData = () => {
    if (filter === 'gainers') {
      return marketData.filter(crypto => (crypto.change || 0) > 0).slice(0, 20);
    }
    if (filter === 'losers') {
      return marketData.filter(crypto => (crypto.change || 0) < 0).slice(0, 20);
    }
    return marketData;
  };

  const topGainers = marketData.filter(crypto => (crypto.change || 0) > 0).slice(0, 3);
  const topLosers = marketData.filter(crypto => (crypto.change || 0) < 0).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-y-auto">
      {/* Scrollable content container */}
      <div className="pb-24 min-h-screen"> 
        {/* Top header with logo and icons - matching HomePage */}
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

        {/* Market tagline */}
        <div className="px-4 mb-6">
          <p className="text-gray-400 text-sm">
            Live cryptocurrency prices and market data
          </p>
        </div>

        {/* Market Overview Cards - matching HomePage style */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-700/30 p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white/90">Top Gainers</span>
                </div>
                <div className="space-y-1">
                  {topGainers.slice(0, 2).map((crypto, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{crypto.symbol.toUpperCase()}</span>
                      <span className="text-sm font-bold text-white">+{Math.abs(crypto.change || 0).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white/90">Top Losers</span>
                </div>
                <div className="space-y-1">
                  {topLosers.slice(0, 2).map((crypto, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{crypto.symbol.toUpperCase()}</span>
                      <span className="text-sm font-bold text-white">{crypto.change?.toFixed(1) || 0}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons - matching HomePage style */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-700/30 p-4">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: 'all', label: 'All Coins', icon: Star },
                { key: 'gainers', label: 'Gainers', icon: TrendingUp },
                { key: 'losers', label: 'Losers', icon: TrendingDown }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap",
                    filter === item.key
                      ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-lg"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cryptocurrency List - matching HomePage style */}
        <div className="px-4">
          <div className="bg-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-700/30">
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" />
                <span className="font-semibold text-white">
                  {filter === 'all' ? 'All Cryptocurrencies' : 
                   filter === 'gainers' ? 'Top Gainers' : 'Top Losers'}
                </span>
                <div className="ml-auto text-xs bg-teal-400/20 text-teal-400 px-2 py-1 rounded-full">
                  {getFilteredData().length}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-1 p-4">
                {Array(8).fill(0).map((_, idx) => (
                  <div key={idx} className="animate-pulse flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                      <div>
                        <div className="h-4 w-16 bg-gray-600 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-20 bg-gray-600 rounded mb-1"></div>
                      <div className="h-3 w-10 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-700/30">
                {getFilteredData().map((crypto, idx) => (
                  <Link
                    key={crypto.id}
                    to={`/coin/${crypto.id}`}
                    className="group flex items-center justify-between p-4 hover:bg-gray-700/30 transition-all duration-300"
                    style={{
                      animationDelay: `${idx * 50}ms`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                          <img 
                            src={crypto.logo} 
                            alt={crypto.name} 
                            className="w-8 h-8 rounded-full"
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
                      <div>
                        <div className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                          {crypto.name.length > 12 ? crypto.name.substring(0, 12) + '...' : crypto.name}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">{crypto.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white font-mono">
                        ₹{crypto.price > 100 ? crypto.price.toLocaleString(undefined, {maximumFractionDigits: 0}) : crypto.price.toLocaleString()}
                      </div>
                      <div className={cn(
                        "text-sm flex items-center justify-end font-medium",
                        (crypto.change || 0) >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {(crypto.change || 0) >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {(crypto.change || 0) >= 0 ? '+' : ''}{crypto.change?.toFixed(2) || 0}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Button - matching HomePage */}
      <div className="fixed bottom-28 right-4 z-40">
        <button className="w-14 h-14 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Bot className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Background decoration - matching HomePage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Bottom Navigation - using new component */}
      <BottomNavigation />
    </div>
  );
};

export default MarketPage;
