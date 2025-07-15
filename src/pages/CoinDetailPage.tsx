import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { useAuth } from "@/contexts/AuthContext";
import TradeTimer from '@/components/TradeTimer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mockCryptoCurrencies } from '@/data/mockData';
import { ArrowUp, ArrowDown, TrendingUp, X, IndianRupee, Maximize2, Timer, Coins, Star } from 'lucide-react';
import { getBinancePrice, getBinanceKlines, getMarketData, getCoin, placeTrade } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const CoinDetailPage = () => {
  const { toast } = useToast();
  const { user, updateProfile, refreshUserData } = useAuth();
  const { id: coinId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const cachedCrypto = location.state?.crypto;
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
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
    } else if (price >= 100000) {
      return `₹${(price / 1000).toFixed(1)}K`;
    } else if (price >= 1) {
      return `₹${price.toFixed(2)}`;
    } else {
      return `₹${price.toFixed(6)}`;
    }
  };

  const timeframes = [
    { label: '1H', value: '1H', change: '+2.34' },
    { label: '24H', value: '24H', change: priceChange.toFixed(2) },
    { label: '7D', value: '7D', change: '-1.28' },
  ];

  return (
    <MobileLayout showBackButton title="" noScroll={true} hideFooter={true}>
      <div className="h-screen flex flex-col bg-white">
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={crypto.logo} 
                  alt={crypto.symbol}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23F59E0B'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-size='18' font-weight='bold'%3E" + crypto.symbol?.charAt(0) + "%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{crypto.symbol?.toUpperCase()}</h1>
                <p className="text-sm text-gray-500">{crypto.symbol?.toUpperCase()}/USDT</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(livePrice)}
              </div>
              <div className={`text-sm font-semibold flex items-center justify-end ${
                priceChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {priceChange >= 0 ? '~' : ''} {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative bg-white">
          <iframe
            src={`/trade-graph.html?symbol=${crypto.binance_symbol || crypto.symbol + 'usdt'}`}
            className="w-full h-full"
            title="Trading Chart"
            frameBorder="0"
          />
          
          <div className="absolute top-4 left-4 flex space-x-2">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-white/90 text-gray-700 hover:bg-white border border-gray-200'
                }`}
              >
                <div>{timeframe.label}</div>
                <div className={`text-xs ${
                  selectedTimeframe === timeframe.value 
                    ? 'text-white/80' 
                    : timeframe.change.startsWith('-') ? 'text-red-500' : 'text-green-500'
                }`}>
                  {timeframe.change.startsWith('-') ? '' : '+'}{timeframe.change}%
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsFullscreenChart(true)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-all border border-gray-200"
          >
            <Maximize2 className="h-5 w-5 text-gray-600" />
          </button>

          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md border border-gray-200">
            <div className="text-lg font-bold text-gray-900">
              ${livePrice.toFixed(2)}
            </div>
            <div className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100 p-4">
          <div className="flex space-x-3">
            <Button 
              onClick={handleBuyClick}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-bold rounded-xl transition-all duration-200 transform active:scale-95 shadow-lg"
            >
              <TrendingUp className="mr-2 h-6 w-6" />
              BUY
            </Button>
            <Button 
              onClick={handleSellClick}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 text-lg font-bold rounded-xl transition-all duration-200 transform active:scale-95 shadow-lg"
            >
              <ArrowDown className="mr-2 h-6 w-6" />
              PUT
            </Button>
          </div>
        </div>

        <Dialog open={isFullscreenChart} onOpenChange={setIsFullscreenChart}>
          <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 bg-white border-none">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                <h3 className="text-lg font-bold text-gray-900">{crypto.name} Chart</h3>
                <Button
                  onClick={() => setIsFullscreenChart(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  <X className="h-4 w-4" />
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
          <DialogContent className="w-[95vw] max-w-sm mx-auto bg-white rounded-2xl p-0 overflow-hidden">
            <div className={`px-6 py-4 text-white ${
              direction === 'Call' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
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

            <div className="p-6 space-y-6">
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
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
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
                    className="pl-10 h-12 text-lg font-semibold bg-gray-50 border-gray-200 rounded-xl text-gray-800"
                    placeholder="1000"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {['600', '1000', '2000', '3000', '5000', '10000'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTradeAmount(amount)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        tradeAmount === amount
                          ? direction === 'Call' 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleConfirmTrade}
                className={`w-full h-14 text-lg font-bold rounded-xl transition-all duration-200 transform active:scale-95 ${
                  direction === 'Call' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                <div className="flex items-center justify-center">
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
