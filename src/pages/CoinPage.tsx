
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Share, Heart, MoreVertical,
  Zap, Shield, Smartphone, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
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

        {/* Navigation Tabs */}
        <div className="px-4 mb-4">
          <div className="flex bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm">
            {[
              { id: 'trade', label: 'Trade', icon: Zap },
              { id: 'stats', label: 'Stats', icon: Shield },
              { id: 'info', label: 'Info', icon: Smartphone }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4">
          {activeTab === 'trade' && (
            <div className="space-y-4">
              {/* Quick Trade Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleTradeClick('call')}
                  className="h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg flex flex-col items-center justify-center"
                >
                  <TrendingUp className="w-6 h-6 mb-1" />
                  BUY
                </Button>
                
                <Button
                  onClick={() => handleTradeClick('put')}
                  className="h-16 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-lg rounded-xl shadow-lg flex flex-col items-center justify-center"
                >
                  <TrendingDown className="w-6 h-6 mb-1" />
                  PUT
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Market Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="text-white font-medium">{crypto.market_cap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="text-white font-medium">{crypto.volume_24h}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rank</span>
                  <span className="text-white font-medium">#{crypto.rank}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">About {crypto.name}</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {crypto.name} ({crypto.symbol}) is a leading cryptocurrency with strong market presence. 
                Monitor real-time price movements and execute trades with advanced charting tools.
              </p>
              
              <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Symbol</span>
                  <span className="text-white font-medium">{crypto.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rank</span>
                  <span className="text-white font-medium">#{crypto.rank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trading Pair</span>
                  <span className="text-white font-medium">{crypto.binance_symbol || `${crypto.symbol}USDT`}</span>
                </div>
              </div>
            </div>
          )}
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
