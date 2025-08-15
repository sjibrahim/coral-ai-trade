
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Share, Heart, MoreVertical,
  Zap, Shield, Smartphone, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BottomNavigation from '@/components/BottomNavigation';
import LiveTradeChart from '@/components/LiveTradeChart';
import ModernTradeActions from '@/components/trade/ModernTradeActions';
import ModernMarketStats from '@/components/trade/ModernMarketStats';

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
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'trade' | 'stats' | 'info'>('trade');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  
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

  const handleTrade = (type: 'call' | 'put', amount: number, duration: number) => {
    console.log(`${type.toUpperCase()} trade:`, { amount, duration, symbol: crypto.symbol });
    // Handle trade logic here
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsHeaderCollapsed(scrollTop > 100);
  };

  if (isChartFullscreen) {
    return (
      <div className="min-h-screen bg-background">
        <LiveTradeChart
          symbol={crypto.symbol}
          currentPrice={crypto.price}
          change={crypto.change}
          isFullscreen={true}
          onToggleFullscreen={() => setIsChartFullscreen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pb-20" onScroll={handleScroll}>
        {/* Modern Header */}
        <div className={cn(
          "sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 transition-all duration-300",
          isHeaderCollapsed && "bg-background/98"
        )}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-secondary/80"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/50 p-1 ring-2 ring-primary/20">
                    <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
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
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                      #{crypto.rank}
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-lg font-bold">{crypto.name}</h1>
                  <p className="text-xs text-muted-foreground uppercase font-medium">{crypto.symbol}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 rounded-full hover:bg-secondary/80"
              >
                <Heart className={cn("w-4 h-4", isBookmarked && "text-red-400 fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full hover:bg-secondary/80"
              >
                <Share className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full hover:bg-secondary/80"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="px-4 py-6 text-center bg-gradient-to-b from-background via-background/50 to-transparent">
          <div className="text-4xl font-bold mb-2">
            ₹{crypto.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </div>
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
            isPositive 
              ? "bg-green-500/10 text-green-400 border border-green-500/20" 
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          )}>
            <span>
              {isPositive ? '+' : ''}{crypto.change.toFixed(2)}% (24h)
            </span>
          </div>
        </div>

        {/* Live Chart */}
        <div className="px-4 mb-6">
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden shadow-lg">
            <LiveTradeChart
              symbol={crypto.symbol}
              currentPrice={crypto.price}
              change={crypto.change}
              onToggleFullscreen={() => setIsChartFullscreen(true)}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 mb-4">
          <div className="flex bg-secondary/30 rounded-xl p-1 backdrop-blur-sm">
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
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
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
            <div className="bg-card/20 backdrop-blur-sm rounded-2xl border border-border/30">
              <ModernTradeActions
                symbol={crypto.symbol}
                currentPrice={crypto.price}
                onTrade={handleTrade}
              />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-card/20 backdrop-blur-sm rounded-2xl border border-border/30">
              <ModernMarketStats
                marketCap={crypto.market_cap}
                volume24h={crypto.volume_24h}
                currentPrice={crypto.price}
                change={crypto.change}
              />
            </div>
          )}

          {activeTab === 'info' && (
            <div className="bg-card/20 backdrop-blur-sm rounded-2xl border border-border/30 p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About {crypto.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {crypto.name} ({crypto.symbol}) is a leading cryptocurrency with strong market presence. 
                    Monitor real-time price movements and execute trades with advanced charting tools.
                  </p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-border/30">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symbol</span>
                    <span className="font-medium">{crypto.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rank</span>
                    <span className="font-medium">#{crypto.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trading Pair</span>
                    <span className="font-medium">{crypto.binance_symbol || `${crypto.symbol}USDT`}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CoinPage;
