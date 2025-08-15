
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Share, Heart, MoreVertical,
  Zap, Shield, Smartphone, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PopupModal from '@/components/trade/PopupModal';
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
  const [tradeType, setTradeType] = useState<'call' | 'put'>('call');
  const [amount, setAmount] = useState(100);
  const [duration, setDuration] = useState(60);
  const [showPopup, setShowPopup] = useState(false);
  const [showTradeStatus, setShowTradeStatus] = useState(false);
  const [tradeData, setTradeData] = useState<any>(null);
  
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

  const handleTrade = () => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to place trades",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const newTradeData = {
      type: tradeType,
      amount,
      duration,
      symbol: crypto.symbol,
      entryPrice: crypto.price
    };
    
    setTradeData(newTradeData);
    setShowTradeStatus(true);
    console.log(`${tradeType.toUpperCase()} trade:`, newTradeData);
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
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Quick Trade</h3>
              
              {/* Trade Type Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setTradeType('call')}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-200",
                    tradeType === 'call'
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-gray-700/50 border-gray-600 text-gray-400 hover:border-gray-500"
                  )}
                >
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">CALL</div>
                  <div className="text-xs">Price will rise</div>
                </button>
                <button
                  onClick={() => setTradeType('put')}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-200",
                    tradeType === 'put'
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-gray-700/50 border-gray-600 text-gray-400 hover:border-gray-500"
                  )}
                >
                  <TrendingDown className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">PUT</div>
                  <div className="text-xs">Price will fall</div>
                </button>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Investment Amount</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[100, 500, 1000, 5000].map((value) => (
                    <button
                      key={value}
                      onClick={() => setAmount(value)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                        amount === value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      )}
                    >
                      ₹{value}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter custom amount"
                />
              </div>

              {/* Duration Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Trade Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 120, 300].map((value) => (
                    <button
                      key={value}
                      onClick={() => setDuration(value)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                        duration === value
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      )}
                    >
                      {value}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Trade Button */}
              <Button
                onClick={handleTrade}
                className={cn(
                  "w-full h-12 rounded-xl font-semibold text-white shadow-lg",
                  tradeType === 'call'
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                )}
              >
                {tradeType === 'call' ? 'CALL' : 'PUT'} - ₹{amount} for {duration}s
              </Button>
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
      <PopupModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        type="info"
        title="Trade Information"
        message="Your trade has been submitted successfully!"
      />

      {tradeData && (
        <TradeStatusModal
          isOpen={showTradeStatus}
          onClose={() => setShowTradeStatus(false)}
          tradeData={tradeData}
        />
      )}
    </div>
  );
};

export default CoinPage;
