
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
import { ArrowUp, ArrowDown, TrendingUp, Activity, BarChart3, X, Info } from 'lucide-react';
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
        setStartingTradePrice(livePrice);
        setTradeTimer(timeInSeconds);
        setIsTradeTimerOpen(true);
        closeModal();
        
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
    setIsTradeTimerOpen(false);
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
  
  return (
    <MobileLayout showBackButton title={crypto.name} noScroll={false} hideFooter={true}>
      <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-4">
          {/* Coin Header Info with Trexo Design */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full p-3 mr-3 shadow-lg">
                <img 
                  src={crypto.logo} 
                  alt={crypto.symbol}
                  className="w-12 h-12"
                />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{crypto.name}</h2>
                <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">${livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div className={`text-sm flex items-center justify-end ${priceChange > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {priceChange > 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(priceChange).toFixed(4)}%
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-3 text-center">
                <TrendingUp className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">24h High</p>
                <p className="text-sm font-semibold">${(livePrice * 1.05).toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-3 text-center">
                <Activity className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">24h Low</p>
                <p className="text-sm font-semibold">${(livePrice * 0.95).toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-3 text-center">
                <BarChart3 className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Volume</p>
                <p className="text-sm font-semibold">${Math.floor(Math.random() * 1000)}M</p>
              </CardContent>
            </Card>
          </div>

          {/* Trading Chart with iframe */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-emerald-800 mb-6">
            <iframe
              src={`/trade-graph.html?symbol=${crypto.binance_symbol || crypto.symbol + 'usdt'}`}
              className="w-full h-80 rounded-xl"
              title="Trading Chart"
              frameBorder="0"
            />
          </div>

          {/* CALL and PUT Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={handleBuyClick}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-8 text-lg font-bold"
            >
              <ArrowUp className="mr-3 h-6 w-6" />
              CALL
            </Button>
            <Button 
              onClick={handleSellClick}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-8 text-lg font-bold"
            >
              <ArrowDown className="mr-3 h-6 w-6" />
              PUT
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Trade Modal */}
      <Dialog open={isBuyModalOpen || isSellModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white border-none rounded-3xl p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{crypto.symbol}/USD</h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                direction === 'Call' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {direction}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-full bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-6 pb-6 space-y-6">
            {/* Time Period */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-medium text-gray-700">Time Period</span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex gap-2">
                {['1min', '2min', '5min', '10min', '15min'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimePeriod(period)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedTimePeriod === period
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Balance */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Balance</span>
              <span className="font-bold">₹{user?.balance || '100.00'}</span>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                <Input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="pl-8 h-14 text-lg font-medium bg-gray-50 border-gray-200 rounded-2xl"
                  placeholder="1000"
                />
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTradeAmount(amount)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      tradeAmount === amount
                        ? 'bg-emerald-500 text-white border-2 border-emerald-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Direction</span>
                <span className="text-gray-600">Current Price</span>
                <span className="text-gray-600">Investment</span>
              </div>
              <div className="flex justify-between">
                <span className={`font-bold ${direction === 'Call' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {direction}
                </span>
                <span className="font-bold">₹{livePrice.toLocaleString()}</span>
                <span className="font-bold">₹{tradeAmount}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <Button 
              onClick={handleConfirmTrade}
              className={`w-full h-14 text-lg font-bold rounded-2xl ${
                direction === 'Call' 
                  ? 'bg-emerald-500 hover:bg-emerald-600' 
                  : 'bg-red-500 hover:bg-red-600'
              } text-white`}
            >
              BUY {selectedTimePeriod}
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
