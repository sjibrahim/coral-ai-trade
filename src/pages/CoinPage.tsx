
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, TrendingUp, TrendingDown, 
  Activity, BarChart3, Clock, Globe, 
  ArrowUpRight, ArrowDownRight, Bookmark,
  Share, Heart, Plus, Minus
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
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                  <img 
                    src={crypto.logo} 
                    alt={crypto.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">{crypto.name}</h1>
                  <p className="text-xs text-gray-400 uppercase">{crypto.symbol}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
              >
                <Heart className={cn("w-5 h-5", isBookmarked && "text-red-400 fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
              >
                <Share className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="px-4 py-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white mb-2">
              ₹{crypto.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
            <div className={cn(
              "flex items-center justify-center gap-2 text-lg font-semibold",
              isPositive ? "text-green-400" : "text-red-400"
            )}>
              {isPositive ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
              <span>
                {isPositive ? '+' : ''}{crypto.change.toFixed(2)}% (24h)
              </span>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Price Chart</h3>
              <div className="flex bg-gray-700/50 rounded-lg p-1">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded transition-all",
                      timeframe === tf
                        ? "bg-teal-500 text-white"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Simple Chart Visualization */}
            <div className="h-32 flex items-end justify-between">
              {priceData.slice(0, 12).map((point, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 rounded-t transition-all duration-300",
                    isPositive ? "bg-green-400" : "bg-red-400"
                  )}
                  style={{
                    height: `${Math.max(20, (point.price / crypto.price) * 80)}%`,
                    opacity: 0.6 + (index * 0.04)
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            Market Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <span className="text-gray-400 text-sm">Market Cap</span>
              </div>
              <p className="text-white font-bold text-lg">{crypto.market_cap || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">24h Volume</span>
              </div>
              <p className="text-white font-bold text-lg">{crypto.volume_24h || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Market Rank</span>
              </div>
              <p className="text-white font-bold text-lg">#{crypto.rank || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">24h High</span>
              </div>
              <p className="text-white font-bold text-lg">
                ₹{(crypto.price * 1.05).toLocaleString(undefined, {maximumFractionDigits: 2})}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
              <Plus className="w-5 h-5" />
              Buy {crypto.symbol}
            </Button>
            <Button 
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 font-semibold py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Minus className="w-5 h-5" />
              Sell {crypto.symbol}
            </Button>
          </div>
        </div>

        {/* About Section */}
        <div className="px-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-400" />
            About {crypto.name}
          </h3>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
            <p className="text-gray-300 text-sm leading-relaxed">
              {crypto.name} ({crypto.symbol}) is a digital cryptocurrency that has shown significant market activity. 
              Track its price movements, market cap, and trading volume to make informed investment decisions.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-700/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Symbol:</span>
                <span className="text-white font-medium">{crypto.symbol}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">Binance Symbol:</span>
                <span className="text-white font-medium">{crypto.binance_symbol || `${crypto.symbol}USDT`}</span>
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
