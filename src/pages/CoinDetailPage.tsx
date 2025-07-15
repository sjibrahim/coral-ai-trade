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
import { ArrowUp, ArrowDown, TrendingUp, Activity, BarChart3, X, Info, Wallet, IndianRupee, Eye, EyeOff } from 'lucide-react';
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
        
        // Show the trade timer modal
        setIsTradeTimerOpen(true);
        
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
    // Don't close trade timer here, let it close naturally
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Enhanced Price Header */}
        <div className="bg-white shadow-lg sticky top-0 z-10 border-b border-gray-100">
          <div className="p-4">
            {/* Main Price Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                    <img 
                      src={crypto.logo} 
                      alt={crypto.symbol}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const fallback = target.nextElementSibling as HTMLElement;
                        target.style.display = 'none';
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full hidden items-center justify-center">
                      <span className="text-white text-sm font-bold">{crypto.symbol?.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{crypto.name}</h1>
                  <p className="text-sm text-gray-500 font-medium">{crypto.symbol?.toUpperCase()}/USDT</p>
                  {crypto.rank && (
                    <p className="text-xs text-blue-600 font-semibold">Rank #{crypto.rank}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ${livePrice.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6 
                  })}
                </div>
                <div className={`text-sm font-semibold flex items-center justify-end px-2 py-1 rounded-full ${
                  priceChange >= 0 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
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

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center border border-green-200">
                <p className="text-xs text-green-600 font-medium mb-1">24h High</p>
                <p className="text-sm font-bold text-green-800">
                  ${(livePrice * 1.05).toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 text-center border border-red-200">
                <p className="text-xs text-red-600 font-medium mb-1">24h Low</p>
                <p className="text-sm font-bold text-red-800">
                  ${(livePrice * 0.95).toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border border-blue-200">
                <p className="text-xs text-blue-600 font-medium mb-1">Volume</p>
                <p className="text-sm font-bold text-blue-800">
                  ${Math.floor(Math.random() * 1000)}M
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center border border-purple-200">
                <p className="text-xs text-purple-600 font-medium mb-1">Cap</p>
                <p className="text-sm font-bold text-purple-800">
                  ${Math.floor(Math.random() * 100)}B
                </p>
              </div>
            </div>

            {/* Available Balance Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm font-medium">Available Balance</span>
                </div>
                <button 
                  onClick={() => setHideBalance(!hideBalance)} 
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <IndianRupee className="h-6 w-6" />
                <span className="text-2xl font-bold">
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

        {/* Chart Section */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden border border-gray-100">
            <div className="h-80 relative">
              <iframe
                src={`/trade-graph.html?symbol=${crypto.binance_symbol || crypto.symbol + 'usdt'}`}
                className="w-full h-full"
                title="Trading Chart"
                frameBorder="0"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Market</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Market Data Cards */}
          <div className="space-y-4 mb-20">
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Market Analytics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Market Cap</span>
                    <span className="font-semibold text-sm">${crypto.market_cap || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">24h Volume</span>
                    <span className="font-semibold text-sm">${crypto.volume_24h || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Circulating</span>
                    <span className="font-semibold text-sm">21M BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Max Supply</span>
                    <span className="font-semibold text-sm">21M BTC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Performance
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">1H</div>
                  <div className="text-sm font-semibold text-green-600">+2.34%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">24H</div>
                  <div className={`text-sm font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">7D</div>
                  <div className="text-sm font-semibold text-red-600">-5.67%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Trading Panel */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 shadow-lg">
          <div className="grid grid-cols-2 gap-3 mb-2">
            <Button 
              onClick={handleBuyClick}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-base font-bold rounded-xl shadow-lg"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              CALL
            </Button>
            <Button 
              onClick={handleSellClick}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 text-base font-bold rounded-xl shadow-lg"
            >
              <ArrowDown className="mr-2 h-5 w-5" />
              PUT
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500">
            Total Balance: ₹{hideBalance ? "******" : totalBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Compact Trade Modal */}
      <Dialog open={isBuyModalOpen || isSellModalOpen} onOpenChange={closeModal}>
        <DialogContent className="w-[95vw] max-w-sm mx-auto bg-white border-none rounded-2xl p-0 overflow-hidden">
          {/* Compact Header */}
          <div className={`flex items-center justify-between p-4 ${
            direction === 'Call' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
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
            <Button variant="ghost" size="sm" onClick={closeModal} className="text-white hover:bg-white/20 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {/* Compact Time & Amount Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Duration</label>
                <div className="grid grid-cols-3 gap-1">
                  {['1min', '3min', '5min'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedTimePeriod(period)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                        selectedTimePeriod === period
                          ? direction === 'Call' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="pl-7 h-10 text-sm font-medium bg-gray-50 border-gray-200 rounded-lg"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Amount Buttons - 2 rows */}
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.slice(0, 6).map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTradeAmount(amount)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    tradeAmount === amount
                      ? direction === 'Call' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            {/* Compact Balance Display */}
            <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
              <span className="text-xs text-gray-600">Available</span>
              <span className="font-bold text-sm">₹{totalBalance.toLocaleString()}</span>
            </div>

            {/* Confirm Button */}
            <Button 
              onClick={handleConfirmTrade}
              className={`w-full h-12 text-base font-bold rounded-xl ${
                direction === 'Call' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              } text-white shadow-lg`}
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
