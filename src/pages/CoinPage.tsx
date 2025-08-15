
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, TrendingUp, TrendingDown, 
  Activity, BarChart3, Clock, Globe, 
  ArrowUpRight, ArrowDownRight, Bookmark,
  Share, Heart, Plus, Minus, ExternalLink,
  Calendar, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BottomNavigation from '@/components/BottomNavigation';

interface CryptoData {
  id: string | number;
  name: string;
  symbol: string;
  price: number;
  change: number;
  logo: string;
  market_cap?: string;
  volume_24h?: string;
  rank?: string;
  binance_symbol?: string;
}

const CoinPage = () => {
  const { coinId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [timeframe, setTimeframe] = useState('24H');
  
  // Get crypto data from navigation state or use default
  const crypto: CryptoData = location.state?.crypto || {
    id: coinId || 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 65432.50,
    change: 2.34,
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png',
    market_cap: '$1.2T',
    volume_24h: '$28.5B',
    rank: '1'
  };

  const timeframes = ['1H', '24H', '7D', '30D', '1Y'];
  const isPositive = crypto.change >= 0;

  // Generate mock price history data
  const generatePriceData = () => {
    const data = [];
    const basePrice = crypto.price;
    for (let i = 0; i < 24; i++) {
      const variation = (Math.random() - 0.5) * 0.05; // 5% variation
      const price = basePrice * (1 + variation);
      data.push({ time: i, price });
    }
    return data;
  };

  const priceData = generatePriceData();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="pb-24">
        {/* Modern Header */}
        <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-3 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 flex items-center justify-center">
                      <img 
                        src={crypto.logo} 
                        alt={crypto.name} 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                        }}
                      />
                    </div>
                  </div>
                  {crypto.rank && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      #{crypto.rank}
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-xl font-bold text-white">{crypto.name}</h1>
                  <p className="text-sm text-gray-400 uppercase font-medium">{crypto.symbol}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-3 rounded-full"
              >
                <Heart className={cn("w-5 h-5", isBookmarked && "text-red-400 fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-3 rounded-full"
              >
                <Share className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="px-4 py-8">
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-white mb-3 tracking-tight">
              ₹{crypto.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold",
              isPositive 
                ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            )}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span>
                {isPositive ? '+' : ''}{crypto.change.toFixed(2)}% (24h)
              </span>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl p-6 mb-8 border border-gray-700/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                Price Chart
              </h3>
              <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      timeframe === tf
                        ? "bg-teal-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Enhanced Chart Visualization */}
            <div className="h-40 flex items-end justify-between gap-1 px-2">
              {priceData.slice(0, 20).map((point, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-3 rounded-t-full transition-all duration-500 hover:opacity-80",
                      isPositive 
                        ? "bg-gradient-to-t from-green-500 to-green-300" 
                        : "bg-gradient-to-t from-red-500 to-red-300"
                    )}
                    style={{
                      height: `${Math.max(15, (point.price / crypto.price) * 120)}%`,
                      opacity: 0.7 + (index * 0.015)
                    }}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="px-4 mb-8">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-teal-400" />
            Market Statistics
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: DollarSign,
                label: "Market Cap",
                value: crypto.market_cap || 'N/A',
                color: "text-blue-400",
                bgColor: "from-blue-500/10 to-blue-600/5"
              },
              {
                icon: Activity,
                label: "24h Volume",
                value: crypto.volume_24h || 'N/A',
                color: "text-purple-400",
                bgColor: "from-purple-500/10 to-purple-600/5"
              },
              {
                icon: TrendingUp,
                label: "24h High",
                value: `₹${(crypto.price * 1.05).toLocaleString(undefined, {maximumFractionDigits: 2})}`,
                color: "text-green-400",
                bgColor: "from-green-500/10 to-green-600/5"
              },
              {
                icon: TrendingDown,
                label: "24h Low",
                value: `₹${(crypto.price * 0.95).toLocaleString(undefined, {maximumFractionDigits: 2})}`,
                color: "text-orange-400",
                bgColor: "from-orange-500/10 to-orange-600/5"
              }
            ].map((stat, index) => (
              <div key={index} className={cn(
                "bg-gradient-to-br rounded-2xl p-5 border border-gray-700/30 backdrop-blur-sm",
                stat.bgColor
              )}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-gray-800/50", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-gray-300 text-sm font-medium">{stat.label}</span>
                </div>
                <p className="text-white font-bold text-xl">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg border-0 text-lg">
              <Plus className="w-6 h-6" />
              Buy {crypto.symbol}
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-400/50 font-semibold py-6 rounded-2xl flex items-center justify-center gap-3 text-lg"
            >
              <Minus className="w-6 h-6" />
              Sell {crypto.symbol}
            </Button>
          </div>
        </div>

        {/* About Section */}
        <div className="px-4">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5 text-teal-400" />
            About {crypto.name}
          </h3>
          
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl p-6 border border-gray-700/30 backdrop-blur-sm">
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              {crypto.name} ({crypto.symbol}) is a digital cryptocurrency with strong market presence. 
              Track its performance, analyze trends, and make informed trading decisions with real-time data.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                <span className="text-gray-400 font-medium">Symbol</span>
                <span className="text-white font-semibold">{crypto.symbol}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                <span className="text-gray-400 font-medium">Binance Pair</span>
                <span className="text-white font-semibold">{crypto.binance_symbol || `${crypto.symbol}USDT`}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-400 font-medium">Last Updated</span>
                <span className="text-white font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CoinPage;
