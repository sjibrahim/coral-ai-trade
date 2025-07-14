import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import PriceChart from '@/components/PriceChart';
import { useAuth } from "@/contexts/AuthContext";
import MobileOptimizedChart from '@/components/MobileOptimizedChart';
import TradeTimer from '@/components/TradeTimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mockCryptoCurrencies } from '@/data/mockData';
import { ArrowUp, ArrowDown, X, Info, TrendingUp, Activity, BarChart3 } from 'lucide-react';
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
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('1min');
  const [tradeAmount, setTradeAmount] = useState('1000');
  const [direction, setDirection] = useState<'Call' | 'Put'>('Call');
  const [chartData, setChartData] = useState<any[]>([]);
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
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
        
        setChartData(formattedData);
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
    
    const newDataPoint = {
      time: new Date().toISOString(),
      price: newPrice,
    };
    setChartData(prevData => 
      prevData.length > 0 
        ? [...prevData.slice(1), newDataPoint] 
        : [newDataPoint]
    );
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

  const transformedChartData = chartData.map(item => ({
    timestamp: item.time,
    price: item.price,
    volume: item.volume || Math.random() * 100000,
    high: item.high || item.price * 1.005,
    low: item.low || item.price * 0.995,
  }));
  
  const handleBuyClick = () => {
    setDirection('Call');
    setIsBuyModalOpen(true);
  };

  const handleSellClick = () => {
    setDirection('Put');
    setIsSellModalOpen(true);
  };
  
  const handleConfirmTrade = async () => {
    setIsBuyModalOpen(false);
    setIsSellModalOpen(false);
    
    try {
      const timeInSeconds = parseInt(selectedTimePeriod.replace('min', '')) * 60;
      const token = localStorage.getItem('auth_token');
      const trade_amount = parseFloat(tradeAmount);
      const symbol = crypto.symbol;
      const apiDirection = direction.toLowerCase();
      
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to place trades",
          variant: "destructive",
        });
        return;
      }
      
      const response = await placeTrade(
        token,
        trade_amount,
        symbol,
        apiDirection === 'call' ? 'buy' : 'put',
        livePrice,
        timeInSeconds
      );
      
      if (response.success) {
        setTradeApiResponse(response.data);
        setTradeTimer(timeInSeconds);
        setStartingTradePrice(livePrice);
        setIsTradeTimerOpen(true);
        
        toast({
          title: "Trade Placed",
          description: `Your ${direction} trade for ${crypto.symbol} has been placed for ${selectedTimePeriod}`,
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to place trade",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place trade. Please try again.",
        variant: "destructive",
      });
    }
  };
  
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

  const predefinedAmounts = ['600', '1000', '2000', '3000', '5000', '10000'];
  
  const closeModal = () => {
    setIsBuyModalOpen(false);
    setIsSellModalOpen(false);
    setIsTradeTimerOpen(false);
  };
  
  const toggleFullscreen = () => {
    setIsChartFullscreen(!isChartFullscreen);
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChartFullscreen) {
        setIsChartFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isChartFullscreen]);
  
  return (
    <MobileLayout showBackButton title={crypto.name} noScroll={isChartFullscreen}>
      <div className={`flex flex-col h-full bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isChartFullscreen ? 'fullscreen-container' : 'pb-24'}`}>
        {isChartFullscreen ? (
          <div className="flex-1 flex flex-col">
            <MobileOptimizedChart 
              data={transformedChartData}
              currentPrice={livePrice}
              previousPrice={livePrice - (livePrice * priceChange / 100)}
              timeframe={selectedTimeframe}
              onToggleFullscreen={toggleFullscreen}
              isFullscreen={true}
              onClose={toggleFullscreen}
              symbol={crypto.symbol}
            />
          </div>
        ) : (
          <>
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
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="bg-white dark:bg-gray-800 mx-4 grid grid-cols-3 mb-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <TabsTrigger value="chart" className="rounded-lg text-foreground data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Chart</TabsTrigger>
                <TabsTrigger value="trade" className="rounded-lg text-foreground data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Trade</TabsTrigger>
                <TabsTrigger value="info" className="rounded-lg text-foreground data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Info</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="flex-1 flex flex-col mx-4">
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4">
                  <MobileOptimizedChart 
                    data={transformedChartData}
                    currentPrice={livePrice}
                    previousPrice={livePrice - (livePrice * priceChange / 100)}
                    timeframe={selectedTimeframe}
                    onToggleFullscreen={toggleFullscreen}
                    isFullscreen={false}
                    symbol={crypto.symbol}
                  />
                </div>
              </TabsContent>

              <TabsContent value="trade" className="flex-1 mx-4">
                <div className="space-y-4">
                  <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-emerald-600 dark:text-emerald-400">Quick Trade</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          onClick={handleBuyClick}
                          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-6"
                        >
                          <ArrowUp className="mr-2 h-5 w-5" />
                          CALL
                        </Button>
                        <Button 
                          onClick={handleSellClick}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 py-6"
                        >
                          <ArrowDown className="mr-2 h-5 w-5" />
                          PUT
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="info" className="flex-1 mx-4">
                <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="text-emerald-600 dark:text-emerald-400">Asset Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="font-semibold">${livePrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">24h Change</p>
                        <p className={`font-semibold ${priceChange > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Trade Modals - keep existing modals with Trexo styling */}
      <Dialog open={isBuyModalOpen || isSellModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-800">
          <DialogTitle className="text-emerald-600 dark:text-emerald-400">
            Place {direction} Trade
          </DialogTitle>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Amount (₹)</label>
              <Input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time Period</label>
              <select 
                value={selectedTimePeriod} 
                onChange={(e) => setSelectedTimePeriod(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="1min">1 Minute</option>
                <option value="3min">3 Minutes</option>
                <option value="5min">5 Minutes</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleConfirmTrade}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
              >
                Confirm Trade
              </Button>
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
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
      />
    </MobileLayout>
  );
};

export default CoinDetailPage;
