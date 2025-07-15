import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { useAuth } from "@/contexts/AuthContext";
import TradeTimer from '@/components/TradeTimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mockCryptoCurrencies } from '@/data/mockData';
import { ArrowUp, ArrowDown, TrendingUp, Activity, BarChart3, X, Info, Wallet, IndianRupee, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { getBinancePrice, getBinanceKlines, getMarketData, getCoin, placeTrade } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const CoinDetailPage = () => {
  const { toast } = useToast();
  const { user, updateProfile, refreshUserData } = useAuth();
  const { id: coinId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const cachedCrypto = location.state?.crypto;
  
  const [activeTab, setActiveTab] = useState('chart');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('1min');
  const [tradeAmount, setTradeAmount] = useState('1000');
  const [direction, setDirection] = useState<'Call' | 'Put'>('Call');
  const [isTradeTimerOpen, setIsTradeTimerOpen] = useState(false);
  const [tradeTimer, setTradeTimer] = useState(0);
  const [tradeResult, setTradeResult] = useState<{
    value: number | null;
    type: 'Profit' | 'Loss' | null;
  }>({ value: null, type: null });
  
  const [crypto, setCrypto] = useState<Cryptocurrency>(cachedCrypto || {
    id: '',
    name: 'Loading...',
    symbol: '',
    binance_symbol: '',
    price: 0,
    change: 0,
    logo: '',
  });
  const [isLoading, setIsLoading] = useState(!cachedCrypto);
  const [livePrice, setLivePrice] = useState(cachedCrypto ? parseFloat(cachedCrypto.price) : 0);
  const [priceChange, setPriceChange] = useState(cachedCrypto ? parseFloat(cachedCrypto.change || 0) : 0);
  const [startingTradePrice, setStartingTradePrice] = useState(0);
  const [tradeApiResponse, setTradeApiResponse] = useState<any>(null);
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    if (!coinId) return;
    
    const fetchCoinData = async () => {
      try {
        if (!cachedCrypto) setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (token && coinId) {
          const response = await getCoin(token, coinId);
          
          if (response.status && response.data) {
            const coinData = response.data;
            
            setCrypto({
              id: coinData.id,
              name: coinData.name,
              symbol: coinData.symbol,
              binance_symbol: coinData.binance_symbol,
              price: parseFloat(coinData.price),
              change: 0,
              logo: coinData.logo,
              market_cap: coinData.market_cap,
              volume_24h: coinData.volume_24h,
              rank: coinData.rank,
              picks: coinData.picks,
              home: coinData.home,
              status: coinData.status,
              created_at: coinData.created_at,
              updated_at: coinData.updated_at,
            });
            
            setLivePrice(parseFloat(coinData.price));
          } else {
            fallbackToMockData();
          }
        } else {
          fallbackToMockData();
        }
        
        setIsLoading(false);
      } catch (error) {
        fallbackToMockData();
        setIsLoading(false);
      }
    };
    
    const fallbackToMockData = () => {
      if (coinId) {
        const mockCrypto = mockCryptoCurrencies.find(c => c.id === coinId);
        if (mockCrypto) {
          setCrypto(mockCrypto);
          setLivePrice(mockCrypto.price);
          setPriceChange(mockCrypto.change);
        } else {
          setCrypto(mockCryptoCurrencies[0]);
          setLivePrice(mockCryptoCurrencies[0].price);
          setPriceChange(mockCryptoCurrencies[0].change);
        }
      } else {
        setCrypto(mockCryptoCurrencies[0]);
        setLivePrice(mockCryptoCurrencies[0].price);
        setPriceChange(mockCryptoCurrencies[0].change);
      }
    };
    
    if (cachedCrypto) {
      setCrypto(cachedCrypto);
      setLivePrice(parseFloat(cachedCrypto.price));
      setPriceChange(parseFloat(cachedCrypto.change || 0));
      setTimeout(fetchCoinData, 1000);
    } else {
      fetchCoinData();
    }
  }, [coinId, toast, cachedCrypto]);

  const getBinanceSymbol = useCallback(() => {
    return crypto.binance_symbol || `${crypto.symbol.toUpperCase()}USDT`;
  }, [crypto]);

  const fetchBinanceData = useCallback(async () => {
    try {
      if (!crypto.binance_symbol) {
        return;
      }
      
      const symbol = getBinanceSymbol();
      const priceData = await getBinancePrice(symbol);
      
      if (priceData && priceData.price) {
        const newPrice = parseFloat(priceData.price);
        setLivePrice(newPrice);
        
        const previousPrice = livePrice;
        const changePercent = previousPrice > 0 ? ((newPrice - previousPrice) / previousPrice) * 100 : 0;
        setPriceChange(changePercent);
      }
      
      const klinesData = await getBinanceKlines(symbol, '1m', '100');
      if (Array.isArray(klinesData)) {
        const formattedData = klinesData.map((kline: any) => ({
          time: new Date(kline[0]).toISOString(),
          price: parseFloat(kline[4]),
          high: parseFloat(kline[2]),
          low: parseFloat(kline[3]),
          volume: parseFloat(kline[5]),
        }));
        
      }
    } catch (error) {
      simulatePriceUpdates();
    }
  }, [getBinanceSymbol, livePrice, crypto.binance_symbol]);
  
  const simulatePriceUpdates = useCallback(() => {
    const fluctuation = (Math.random() - 0.5) * 0.01;
    const newPrice = livePrice * (1 + fluctuation);
    setLivePrice(newPrice);
    
    const newChange = priceChange + (fluctuation * 100);
    setPriceChange(newChange);
    
  }, [livePrice, priceChange]);

  useEffect(() => {
    if (!isLoading && crypto.binance_symbol) {
      fetchBinanceData();
      
      const interval = setInterval(() => {
        fetchBinanceData().catch(() => {
          simulatePriceUpdates();
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [fetchBinanceData, simulatePriceUpdates, isLoading, crypto.binance_symbol]);

  const handleBuyClick = () => {
    setDirection('Call');
    setIsBuyModalOpen(true);
  };

  const handleSellClick = () => {
    setDirection('Put');
    setIsSellModalOpen(true);
  };

  const handleConfirmTrade = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to place trades",
          variant: "destructive",
        });
        return;
      }

      const timeInSeconds = selectedTimePeriod === '1min' ? 60 : selectedTimePeriod === '3min' ? 180 : 300;
      
      // Close the trade modal first
      closeModal();
      
      // Set up the trade timer state BEFORE making the API call
      setStartingTradePrice(livePrice);
      setTradeTimer(timeInSeconds);
      
      // Show the trade timer modal immediately
      setIsTradeTimerOpen(true);
      
      const response = await placeTrade(
        token,
        parseFloat(tradeAmount),
        crypto.binance_symbol || crypto.symbol.toUpperCase(),
        direction.toLowerCase(),
        livePrice,
        timeInSeconds
      );
      
      if (response.success) {
        // Store the API response for later use
        setTradeApiResponse(response);
        
        // Show success toast
        toast({
          title: "Trade Placed",
          description: `${direction} trade of ₹${tradeAmount} placed successfully`,
        });
      } else {
        toast({
          title: "Trade Failed",
          description: response.message || "Failed to place trade",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Trade error:', error);
      toast({
        title: "Trade Error",
        description: "An error occurred while placing the trade",
        variant: "destructive",
      });
    }
  };

  const predefinedAmounts = ['600', '1000', '2000', '3000', '5000', '10000'];
  
  const handleTradeComplete = (finalPrice: number) => {
    if (tradeApiResponse) {
      if (user && typeof tradeApiResponse.new_balance === 'number') {
        updateProfile().then(() => {
          console.log('Profile updated after trade completion');
        }).catch(error => {
          console.error('Failed to update profile after trade:', error);
        });
      }
      
      const isProfit = tradeApiResponse.status === 'win';
      const resultAmount = isProfit ? tradeApiResponse.profit : tradeApiResponse.lost_amount;
      
      setTradeResult({
        value: resultAmount,
        type: isProfit ? 'Profit' : 'Loss'
      });
      
      toast({
        title: isProfit ? "Trade Profit" : "Trade Loss",
        description: `Your ${direction} trade resulted in a ${isProfit ? "profit" : "loss"} of ₹${resultAmount}`,
        variant: isProfit ? "default" : "destructive",
      });
    }
  };

  const closeModal = () => {
    setIsBuyModalOpen(false);
    setIsSellModalOpen(false);
  };

  // Listen for price updates from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PRICE_UPDATE' && event.data.price) {
        setLivePrice(event.data.price);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const totalBalance = Number(user?.wallet || 0) + Number(user?.income || 0);
  
  return (
    <MobileLayout showBackButton title={crypto.name} noScroll={false} hideFooter={true}>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Trexo-styled Header */}
        <div className="bg-card shadow-sm sticky top-0 z-10 border-b">
          <div className="p-4">
            {/* Coin Info Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <img 
                      src={crypto.logo} 
                      alt={crypto.symbol}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const fallback = target.nextElementSibling as HTMLElement;
                        target.style.display = 'none';
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-8 h-8 bg-primary rounded-full hidden items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold">{crypto.symbol?.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-card flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">{crypto.name}</h1>
                  <p className="text-sm text-muted-foreground font-medium">{crypto.symbol?.toUpperCase()}/USDT</p>
                  {crypto.rank && (
                    <p className="text-xs text-primary font-semibold">#{crypto.rank}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-foreground mb-1">
                  ${livePrice.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6 
                  })}
                </div>
                <div className={`text-sm font-semibold flex items-center justify-end px-2 py-1 rounded-full ${
                  priceChange >= 0 
                    ? 'text-market-increase bg-market-increase/10' 
                    : 'text-market-decrease bg-market-decrease/10'
                }`}>
                  {priceChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(priceChange).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Market Stats Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-muted/30 rounded-lg p-2 text-center border">
                <p className="text-xs text-muted-foreground font-medium mb-1">24h High</p>
                <p className="text-xs font-bold text-market-increase">
                  ${(livePrice * 1.05).toFixed(2)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-2 text-center border">
                <p className="text-xs text-muted-foreground font-medium mb-1">24h Low</p>
                <p className="text-xs font-bold text-market-decrease">
                  ${(livePrice * 0.95).toFixed(2)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-2 text-center border">
                <p className="text-xs text-muted-foreground font-medium mb-1">Volume</p>
                <p className="text-xs font-bold text-foreground">
                  ${Math.floor(Math.random() * 1000)}M
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-2 text-center border">
                <p className="text-xs text-muted-foreground font-medium mb-1">Cap</p>
                <p className="text-xs font-bold text-foreground">
                  ${Math.floor(Math.random() * 100)}B
                </p>
              </div>
            </div>

            {/* Balance Card - Trexo Style */}
            <div className="bg-primary rounded-xl p-4 text-primary-foreground">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm font-medium">Available Balance</span>
                </div>
                <button 
                  onClick={() => setHideBalance(!hideBalance)} 
                  className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                >
                  {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <IndianRupee className="h-5 w-5" />
                <span className="text-xl font-bold">
                  {hideBalance ? "******" : totalBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm opacity-90">
                <span>Wallet: ₹{hideBalance ? "***" : Number(user?.wallet || 0).toLocaleString()}</span>
                <span>Income: ₹{hideBalance ? "***" : Number(user?.income || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Chart */}
        <div className="flex-1 p-4">
          <Card className="mb-4 border-0 shadow-sm">
            <div className="h-80 relative rounded-lg overflow-hidden">
              <iframe
                src={`/trade-graph.html?symbol=${crypto.binance_symbol || crypto.symbol + 'usdt'}`}
                className="w-full h-full"
                title="Trading Chart"
                frameBorder="0"
              />
              <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-foreground text-sm border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="font-medium">Live Market</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Market Analytics */}
          <div className="space-y-4 mb-20">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Market Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Market Cap</span>
                      <span className="font-semibold text-sm text-foreground">${crypto.market_cap || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">24h Volume</span>
                      <span className="font-semibold text-sm text-foreground">${crypto.volume_24h || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Circulating</span>
                      <span className="font-semibold text-sm text-foreground">21M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Max Supply</span>
                      <span className="font-semibold text-sm text-foreground">21M</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <Activity className="h-4 w-4 text-primary" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">1H</div>
                    <div className="text-sm font-semibold text-market-increase">+2.34%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">24H</div>
                    <div className={`text-sm font-semibold ${priceChange >= 0 ? 'text-market-increase' : 'text-market-decrease'}`}>
                      {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">7D</div>
                    <div className="text-sm font-semibold text-market-decrease">-5.67%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fixed Trading Panel - Trexo Style */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-20 shadow-lg">
          <div className="grid grid-cols-2 gap-3 mb-2">
            <Button 
              onClick={handleBuyClick}
              className="bg-market-increase hover:bg-market-increase/90 text-white py-3 text-base font-bold rounded-lg shadow-sm"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              CALL
            </Button>
            <Button 
              onClick={handleSellClick}
              className="bg-market-decrease hover:bg-market-decrease/90 text-white py-3 text-base font-bold rounded-lg shadow-sm"
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              PUT
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Total Balance: ₹{hideBalance ? "******" : totalBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Trexo-styled Trade Modal */}
      <Dialog open={isBuyModalOpen || isSellModalOpen} onOpenChange={closeModal}>
        <DialogContent className="w-[95vw] max-w-sm mx-auto bg-card border rounded-2xl p-0 overflow-hidden">
          {/* Modal Header */}
          <div className={`flex items-center justify-between p-4 ${
            direction === 'Call' ? 'bg-market-increase' : 'bg-market-decrease'
          } text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">{crypto.symbol?.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-bold">{direction} Trade</h3>
                <p className="text-xs opacity-90">${livePrice.toFixed(2)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={closeModal} className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {/* Duration & Amount Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Duration</label>
                <div className="grid grid-cols-3 gap-1">
                  {['1min', '3min', '5min'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedTimePeriod(period)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                        selectedTimePeriod === period
                          ? direction === 'Call' ? 'bg-market-increase text-white' : 'bg-market-decrease text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="pl-7 h-10 text-sm font-medium bg-background border-input"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.slice(0, 6).map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTradeAmount(amount)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    tradeAmount === amount
                      ? direction === 'Call' ? 'bg-market-increase text-white' : 'bg-market-decrease text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            {/* Balance Display */}
            <div className="bg-muted/50 rounded-xl p-3 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Available</span>
              <span className="font-bold text-sm text-foreground">₹{totalBalance.toLocaleString()}</span>
            </div>

            {/* Confirm Button */}
            <Button 
              onClick={handleConfirmTrade}
              className={`w-full h-12 text-base font-bold rounded-xl ${
                direction === 'Call' 
                  ? 'bg-market-increase hover:bg-market-increase/90' 
                  : 'bg-market-decrease hover:bg-market-decrease/90'
              } text-white shadow-sm`}
            >
              Place {direction} Trade
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <TradeTimer
        open={isTradeTimerOpen}
        onClose={() => setIsTradeTimerOpen(false)}
        currentPrice={livePrice}
        startPrice={startingTradePrice}
        direction={direction}
        duration={tradeTimer}
        onComplete={handleTradeComplete}
        tradeApiResponse={tradeApiResponse}
      />
    </MobileLayout>
  );
};

export default CoinDetailPage;
