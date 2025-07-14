import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getMarketData } from "@/services/api";
import { 
  TrendingUp, TrendingDown, Star, Activity, 
  Search, Filter, Crown, Zap, BarChart3,
  ArrowUpRight, ArrowDownRight, Eye, Sparkles
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
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="px-4 py-6 space-y-6 relative z-10 pb-24">
          {/* Premium Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Live Markets
                </h1>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Real-time prices</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full border-emerald-200 hover:bg-emerald-50">
                <Search className="w-4 h-4 text-emerald-600" />
              </Button>
            </div>
          </div>

          {/* Market Overview Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium opacity-90">Top Gainers</span>
                </div>
                <div className="space-y-1">
                  {topGainers.slice(0, 2).map((crypto, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-xs font-medium">{crypto.symbol.toUpperCase()}</span>
                      <span className="text-xs font-bold">+{Math.abs(crypto.change || 0).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-xs font-medium opacity-90">Top Losers</span>
                </div>
                <div className="space-y-1">
                  {topLosers.slice(0, 2).map((crypto, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-xs font-medium">{crypto.symbol.toUpperCase()}</span>
                      <span className="text-xs font-bold">{crypto.change?.toFixed(1) || 0}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Buttons */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl">
            <CardContent className="p-4">
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
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                      filter === item.key
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <item.icon className="w-3 h-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cryptocurrency List */}
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 font-trading">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                  {filter === 'all' ? 'All Cryptocurrencies' : 
                   filter === 'gainers' ? 'Top Gainers' : 'Top Losers'}
                </span>
                <div className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  {getFilteredData().length} coins
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(8).fill(0).map((_, idx) => (
                    <div key={idx} className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                        <div>
                          <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-10 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {getFilteredData().map((crypto, idx) => (
                    <Link
                      key={crypto.id}
                      to={`/coin/${crypto.id}`}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-200 animate-fade-in"
                      style={{
                        animationDelay: `${idx * 50}ms`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img 
                              src={crypto.logo} 
                              alt={crypto.name} 
                              className="w-6 h-6 rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                              }}
                            />
                          </div>
                          {idx < 3 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Crown className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {crypto.name.length > 12 ? crypto.name.substring(0, 12) + '...' : crypto.name}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">{crypto.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 font-mono">
                          ₹{crypto.price > 100 ? crypto.price.toLocaleString(undefined, {maximumFractionDigits: 0}) : crypto.price.toLocaleString()}
                        </div>
                        <div className={cn(
                          "text-sm flex items-center justify-end font-medium",
                          (crypto.change || 0) >= 0 ? "text-emerald-600" : "text-red-500"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MarketPage;