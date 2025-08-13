
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { getMarketData } from "@/services/api";
import { 
  TrendingUp, TrendingDown, Star, Activity, 
  Search, Filter, Crown, Zap, BarChart3,
  ArrowUpRight, ArrowDownRight, Eye, Sparkles,
  Home, Users, TrendingUpIcon, DollarSign, User
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Bottom Navigation Items
  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Users, label: 'Team', path: '/team' },
    { icon: TrendingUpIcon, label: 'Trade', path: '/trade' },
    { icon: DollarSign, label: 'Invest', path: '/market' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <MobileLayout hideNavbar hideFooter>
      <div className="min-h-screen bg-gray-900 text-white relative pb-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 0%, transparent 70%),
                             radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 70%)`
          }} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
                <img 
                  src="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png" 
                  alt="Coral" 
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">Live Markets</h1>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Real-time prices</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Market Overview Cards */}
          <div className="px-4 mb-6">
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

          {/* Filter Buttons */}
          <div className="px-4 mb-6">
            <div className="bg-gray-800/50 rounded-xl p-3">
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
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
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

          {/* Cryptocurrency List */}
          <div className="px-4">
            <div className="bg-gray-800/50 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-white">
                    {filter === 'all' ? 'All Cryptocurrencies' : 
                     filter === 'gainers' ? 'Top Gainers' : 'Top Losers'}
                  </span>
                  <div className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
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
                          <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
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

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 px-4 z-50">
          <div className="flex items-center justify-around py-3">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                  item.path === '/market' 
                    ? "text-emerald-400" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MarketPage;
