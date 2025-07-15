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
import { ArrowUp, ArrowDown, TrendingUp, Activity, BarChart3, X, Info, Wallet, IndianRupee, Eye, EyeOff, ChevronLeft, Maximize2, Minimize2, Zap, Target, Timer, Coins, Play, Star, Sparkles } from 'lucide-react';
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
  const [isFullscreenChart, setIsFullscreenChart] = useState(false);
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
      
      closeModal();
      
      setStartingTradePrice(livePrice);
      setTradeTimer(timeInSeconds);
      
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
        setTradeApiResponse(response);
        
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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PRICE_UPDATE' && event.data.price) {
        setLivePrice(event.data.price);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `₹${(price / 1000000000).toFixed(2)}B`;
    } else if (price >= 1000000) {
      return `₹${(price / 1000000).toFixed(2)}M`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(2)}K`;
    } else if (price >= 1) {
      return `₹${price.toFixed(2)}`;
    } else {
      return `₹${price.toFixed(6)}`;
    }
  };

  return (
    <MobileLayout showBackButton title={crypto.name} noScroll={false} hideFooter={true}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 bg-white/80 backdrop-blur-md border-b border-green-200/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-0.5 animate-pulse-ring">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                    <img 
                      src={crypto.logo} 
                      alt={crypto.symbol}
                      className="w-10 h-10 rounded-xl"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const fallback = target.nextElementSibling as HTMLElement;
                        target.style.display = 'none';
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl hidden items-center justify-center">
                      <span className="text-white text-sm font-bold">{crypto.symbol?.charAt(0)}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-trexo">
                  {crypto.name}
                </h1>
                <p className="text-sm text-gray-600 font-medium">{crypto.symbol?.toUpperCase()}/USDT</p>
                {crypto.rank && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-3 h-3 text-amber-500 animate-pulse" />
                    <p className="text-xs text-amber-600 font-semibold">Rank #{crypto.rank}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1 text-gradient-trexo">
                {formatPrice(livePrice)}
              </div>
              <div className={`text-sm font-semibold flex items-center justify-end px-3 py-1.5 rounded-full ${
                priceChange >= 0 
                  ? 'text-green-700 bg-green-100 border border-green-200' 
                  : 'text-red-700 bg-red-100 border border-red-200'
              }`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 animate-bounce" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1 animate-bounce" />
                )}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-4 space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-green-200/50 overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gradient-trexo flex items-center gap-2">
                      Live Trading Chart
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </CardTitle>
                    <p className="text-xs text-gray-600">Real-time market data</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsFullscreenChart(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-green-200 hover:bg-green-50 text-green-700 hover:text-green-800 transition-all duration-200 hover:scale-105"
                >
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Fullscreen
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="h-96 relative bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                <iframe
                  src={`/trade-graph.html?symbol=${crypto.binance_symbol || crypto.symbol + 'usdt'}`}
                  className="w-full h-full rounded-b-xl"
                  title="Trading Chart"
                  frameBorder="0"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-200/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                    <span className="text-sm font-medium text-green-700">Market Analysis</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
                <div className="flex justify-center space-x-2 overflow-x-auto">
                  {['1m', '5m', '15m', '1h', '4h', '1d'].map((timeframe) => (
                    <button
                      key={timeframe}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-white hover:bg-green-50 text-green-700 hover:text-green-800 border border-green-200 hover:border-green-300 transition-all duration-200 hover:scale-105 whitespace-nowrap"
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600 animate-pulse" />
                  <span className="text-sm font-medium text-green-700">24h High</span>
                </div>
                <p className="text-lg font-bold text-green-800">
                  {formatPrice(livePrice * 1.05)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDown className="h-4 w-4 text-red-600 animate-pulse" />
                  <span className="text-sm font-medium text-red-700">24h Low</span>
                </div>
                <p className="text-lg font-bold text-red-800">
                  {formatPrice(livePrice * 0.95)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-24">
            <Card className="bg-white/90 backdrop-blur-sm border border-green-200/50 shadow-sm">
              <CardContent className="p-3 text-center">
                <div className="text-xs text-gray-600 mb-1 flex items-center justify-center">
                  <Timer className="w-3 h-3 mr-1" />
                  1H
                </div>
                <div className="text-sm font-bold text-green-600">+2.34%</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-green-200/50 shadow-sm">
              <CardContent className="p-3 text-center">
                <div className="text-xs text-gray-600 mb-1 flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  24H
                </div>
                <div className={`text-sm font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-green-200/50 shadow-sm">
              <CardContent className="p-3 text-center">
                <div className="text-xs text-gray-600 mb-1 flex items-center justify-center">
                  <Target className="w-3 h-3 mr-1" />
                  7D
                </div>
                <div className="text-sm font-bold text-red-600">-5.67%</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-green-200/50 p-4 z-20 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleBuyClick}
              className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
              <div className="flex items-center justify-center relative z-10">
                <TrendingUp className="mr-2 h-5 w-5" />
                CALL
              </div>
            </Button>
            <Button 
              onClick={handleSellClick}
              className="relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-4 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
              <div className="flex items-center justify-center relative z-10">
                <ArrowDown className="mr-2 h-5 w-5" />
                PUT
              </div>
            </Button>
          </div>
        </div>

        <Dialog open={isFullscreenChart} onOpenChange={setIsFullscreenChart}>
          <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 bg-gradient-to-br from-emerald-50 via-white to-green-50 border-none">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-green-200/50 bg-white/80 backdrop-blur-md">
                <h3 className="text-lg font-bold text-gradient-trexo">{crypto.name} Chart</h3>
                <Button
                  onClick={() => setIsFullscreenChart(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-green-200 hover:bg-green-50"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <iframe
                  src={`/trade-graph.html?symbol=${crypto.binance_symbol || crypto.symbol + 'usdt'}`}
                  className="w-full h-full"
                  title="Trading Chart Fullscreen"
                  frameBorder="0"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isBuyModalOpen || isSellModalOpen} onOpenChange={closeModal}>
          <DialogContent className="w-[95vw] max-w-sm mx-auto bg-white/95 backdrop-blur-md border border-green-200/50 rounded-2xl p-0 overflow-hidden shadow-2xl">
            <div className={`relative px-6 py-4 text-white ${
              direction === 'Call' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm`}>
                    {direction === 'Call' ? (
                      <TrendingUp className="h-5 w-5 text-white" />
                    ) : (
                      <ArrowDown className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{direction} Trade</h3>
                    <p className="text-sm opacity-90">{formatPrice(livePrice)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={closeModal} 
                  className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center">
                  <Timer className="w-4 h-4 mr-2 text-green-600" />
                  Trading Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1min', '3min', '5min'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedTimePeriod(period)}
                      className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                        selectedTimePeriod === period
                          ? direction === 'Call' 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center">
                  <Coins className="w-4 h-4 mr-2 text-green-600" />
                  Investment Amount
                </label>
                <div className="relative mb-3">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                  <Input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="pl-10 h-12 text-lg font-semibold bg-white border-green-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {predefinedAmounts.slice(0, 6).map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTradeAmount(amount)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        tradeAmount === amount
                          ? direction === 'Call' 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleConfirmTrade}
                className={`w-full h-14 text-lg font-bold rounded-xl transition-all duration-200 transform hover:scale-105 relative overflow-hidden shadow-lg hover:shadow-xl ${
                  direction === 'Call' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                    : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                } text-white`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
                <div className="flex items-center justify-center relative z-10">
                  {direction === 'Call' ? <TrendingUp className="mr-2 h-5 w-5" /> : <ArrowDown className="mr-2 h-5 w-5" />}
                  Place {direction} Trade
                </div>
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
      </div>
    </MobileLayout>
  );
};

export default CoinDetailPage;
