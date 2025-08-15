
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Share, Heart, MoreVertical,
  Zap, Shield, Smartphone, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, Activity, Clock, DollarSign,
  BarChart3, Users, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import QuickTradeModal from '@/components/trade/QuickTradeModal';
import TradeStatusModal from '@/components/trade/TradeStatusModal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'trade' | 'stats' | 'info'>('trade');
  const [showQuickTrade, setShowQuickTrade] = useState(false);
  const [showTradeStatus, setShowTradeStatus] = useState(false);
  const [tradeType, setTradeType] = useState<'call' | 'put'>('call');
  const [tradeResult, setTradeResult] = useState<any>(null);
  
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

  const isPositive = crypto.change >= 0;

  const handleTradeClick = (type: 'call' | 'put') => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to place trades",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setTradeType(type);
    setShowQuickTrade(true);
  };

  const handleTradeComplete = (result: any) => {
    setTradeResult(result);
    setShowQuickTrade(false);
    setShowTradeStatus(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pb-24">
      <div className="pb-4">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-800 text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 p-1 ring-2 ring-blue-500/20">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 flex items-center justify-center">
                      <img 
                        src={crypto.logo} 
                        alt={crypto.name} 
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                        }}
                      />
                    </div>
                  </div>
                  {crypto.rank && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                      #{crypto.rank}
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-lg font-bold text-white">{crypto.name}</h1>
                  <p className="text-xs text-gray-400 uppercase font-medium">{crypto.symbol}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {user && (
                <div className="text-right mr-3">
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="text-sm font-semibold text-white">₹{user.wallet || '0'}</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 rounded-full hover:bg-gray-800 text-white"
              >
                <Heart className={cn("w-4 h-4", isBookmarked && "text-red-400 fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full hover:bg-gray-800 text-white"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Live Chart */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden shadow-lg">
            <div className="h-80 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <iframe
                src="/trade-graph.html"
                className="w-full h-full border-0"
                title="Live Trading Chart"
                style={{ background: 'transparent' }}
              />
            </div>
          </div>
        </div>

        {/* Price Stats Cards */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Current Price</span>
              </div>
              <div className="text-xl font-bold text-white">
                ₹{crypto.price.toLocaleString()}
              </div>
              <div className={cn(
                "text-sm font-medium flex items-center gap-1",
                isPositive ? "text-green-400" : "text-red-400"
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{crypto.change.toFixed(2)}%
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">24h Volume</span>
              </div>
              <div className="text-xl font-bold text-white">
                {crypto.volume_24h}
              </div>
              <div className="text-sm text-gray-400">Market Cap: {crypto.market_cap}</div>
            </div>
          </div>
        </div>

        {/* Market Info */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-400" />
              Market Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Rank</div>
                <div className="text-sm font-bold text-white">#{crypto.rank}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Active Traders</div>
                <div className="text-sm font-bold text-green-400">12.5K</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Success Rate</div>
                <div className="text-sm font-bold text-blue-400">73%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Information Section */}
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Start Trading</h2>
              <p className="text-sm text-gray-400">Predict price movement and earn profits</p>
            </div>
            
            {/* Trading Tips */}
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>30s - 5min</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>Min ₹10</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>24/7 Trading</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-300">John placed BUY trade</span>
                </div>
                <span className="text-xs text-green-400">+₹120</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-sm text-gray-300">Sarah placed PUT trade</span>
                </div>
                <span className="text-xs text-red-400">-₹50</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-300">Mike placed BUY trade</span>
                </div>
                <span className="text-xs text-green-400">+₹85</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Buy/Put Buttons at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-gray-900/95 to-transparent backdrop-blur-xl border-t border-gray-800/50 p-4">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <button
            onClick={() => handleTradeClick('call')}
            className="group relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 hover:from-green-400 hover:via-green-500 hover:to-emerald-500 text-white font-bold py-3 px-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-green-500/25 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="relative z-10 flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-3 h-3" />
              </div>
              <div>
                <div className="text-sm font-extrabold">BUY</div>
                <div className="text-xs opacity-90">Price will rise</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleTradeClick('put')}
            className="group relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-rose-600 hover:from-red-400 hover:via-red-500 hover:to-rose-500 text-white font-bold py-3 px-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/25 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="relative z-10 flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingDown className="w-3 h-3" />
              </div>
              <div>
                <div className="text-sm font-extrabold">PUT</div>
                <div className="text-xs opacity-90">Price will fall</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <QuickTradeModal
        isOpen={showQuickTrade}
        onClose={() => setShowQuickTrade(false)}
        tradeType={tradeType}
        crypto={crypto}
        onTradeComplete={handleTradeComplete}
      />

      {tradeResult && (
        <TradeStatusModal
          isOpen={showTradeStatus}
          onClose={() => setShowTradeStatus(false)}
          tradeResult={tradeResult}
        />
      )}
    </div>
  );
};

export default CoinPage;
