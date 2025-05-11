import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
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
import { ArrowUp, ArrowDown, X, Info } from 'lucide-react';
import { getBinancePrice, getBinanceKlines, getMarketData, getCoin } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const CoinDetailPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { id: coinId } = useParams();
  const location = useLocation();
  const cachedCrypto = location.state?.crypto; // Use cached data if available
  
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
  const [marketData, setMarketData] = useState<Cryptocurrency[]>([]);
  
  // Use cached data for initial state if available
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

  // Live price state
  const [livePrice, setLivePrice] = useState(cachedCrypto ? parseFloat(cachedCrypto.price) : 0);
  const [priceChange, setPriceChange] = useState(cachedCrypto ? parseFloat(cachedCrypto.change || 0) : 0);
  const [startingTradePrice, setStartingTradePrice] = useState(0);

  // Fetch coin data by ID on load - but only if we don't have cached data or after initial load with cached data
  useEffect(() => {
    if (!coinId) return;
    
    const fetchCoinData = async () => {
      try {
        if (!cachedCrypto) setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (token && coinId) {
          // Fetch coin details from the API
          const response = await getCoin(token, coinId);
          
          if (response.status && response.data) {
            const coinData = response.data;
            
            // Set crypto data from API response
            setCrypto({
              id: coinData.id,
              name: coinData.name,
              symbol: coinData.symbol,
              binance_symbol: coinData.binance_symbol,
              price: parseFloat(coinData.price),
              change: 0, // Will be updated with live data
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
            toast({
              title: "Error",
              description: "Failed to fetch coin details",
              variant: "destructive",
            });
            
            // Fallback to mock data if API call fails
            fallbackToMockData();
          }
        } else {
          // Fallback to mock data if no token or coinId
          fallbackToMockData();
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        toast({
          title: "Error",
          description: "Failed to load coin data. Please try again.",
          variant: "destructive",
        });
        
        // Fallback to mock data
        fallbackToMockData();
        setIsLoading(false);
      }
    };
    
    // Fallback function to use mock data
    const fallbackToMockData = () => {
      if (coinId) {
        const mockCrypto = mockCryptoCurrencies.find(c => c.id === coinId);
        if (mockCrypto) {
          setCrypto(mockCrypto);
          setLivePrice(mockCrypto.price);
          setPriceChange(mockCrypto.change);
        } else {
          // If specific coin not found, use the first one
          setCrypto(mockCryptoCurrencies[0]);
          setLivePrice(mockCryptoCurrencies[0].price);
          setPriceChange(mockCryptoCurrencies[0].change);
        }
      } else {
        // If no coinId provided, use the first one
        setCrypto(mockCryptoCurrencies[0]);
        setLivePrice(mockCryptoCurrencies[0].price);
        setPriceChange(mockCryptoCurrencies[0].change);
      }
    };
    
    // If we have cached data, use it first, then fetch fresh data
    if (cachedCrypto) {
      setCrypto(cachedCrypto);
      setLivePrice(parseFloat(cachedCrypto.price));
      setPriceChange(parseFloat(cachedCrypto.change || 0));
      // Wait a bit before fetching fresh data to avoid unnecessary API calls during navigation
      setTimeout(fetchCoinData, 1000);
    } else {
      fetchCoinData();
    }
  }, [coinId, toast, cachedCrypto]);

  // Get the binance symbol for the current crypto
  const getBinanceSymbol = useCallback(() => {
    return crypto.binance_symbol || `${crypto.symbol.toUpperCase()}USDT`;
  }, [crypto]);

  // Fetch Binance data
  const fetchBinanceData = useCallback(async () => {
    try {
      if (!crypto.binance_symbol) {
        return; // Skip if no binance_symbol available yet
      }
      
      const symbol = getBinanceSymbol();
      const priceData = await getBinancePrice(symbol);
      
      if (priceData && priceData.price) {
        const newPrice = parseFloat(priceData.price);
        setLivePrice(newPrice);
        
        // Calculate change percentage (comparing to previous price)
        const previousPrice = livePrice;
        const changePercent = previousPrice > 0 ? ((newPrice - previousPrice) / previousPrice) * 100 : 0;
        setPriceChange(changePercent);
      }
      
      // Get kline/candlestick data
      const klinesData = await getBinanceKlines(symbol, '1m', '100');
      if (Array.isArray(klinesData)) {
        const formattedData = klinesData.map((kline: any) => ({
          time: new Date(kline[0]).toISOString(),
          price: parseFloat(kline[4]), // closing price
          high: parseFloat(kline[2]),
          low: parseFloat(kline[3]),
          volume: parseFloat(kline[5]),
        }));
        
        setChartData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching Binance data:', error);
      // Fallback to simulated price updates
      simulatePriceUpdates();
    }
  }, [getBinanceSymbol, livePrice, crypto.binance_symbol]);
  
  // Simulate price updates if Binance API fails
  const simulatePriceUpdates = useCallback(() => {
    // Random price fluctuation between -0.5% and +0.5%
    const fluctuation = (Math.random() - 0.5) * 0.01;
    const newPrice = livePrice * (1 + fluctuation);
    setLivePrice(newPrice);
    
    // Update change percentage
    const newChange = priceChange + (fluctuation * 100);
    setPriceChange(newChange);
    
    // Add new data point to chart
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

  // Initialize data and set up interval for updates
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

  // Transform data for chart component
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
  
  const handleConfirmTrade = () => {
    // Close modals
    setIsBuyModalOpen(false);
    setIsSellModalOpen(false);
    
    // Set trade parameters
    const timeInSeconds = parseInt(selectedTimePeriod.replace('min', '')) * 60;
    setTradeTimer(timeInSeconds);
    setStartingTradePrice(livePrice);
    setIsTradeTimerOpen(true);
    
    // Show toast notification
    toast({
      title: "Trade Placed",
      description: `Your ${direction} trade for ${crypto.symbol} has been placed for ${selectedTimePeriod}`,
    });
  };
  
  const handleTradeComplete = (finalPrice: number) => {
    // Calculate profit/loss based on direction and price difference
    const priceDifference = finalPrice - startingTradePrice;
    const isProfit = (direction === 'Call' && priceDifference > 0) || 
                     (direction === 'Put' && priceDifference < 0);
    
    // Calculate profit/loss amount (simplified)
    const amount = parseFloat(tradeAmount);
    const result = isProfit 
      ? Math.abs(amount * 0.95) // 95% profit
      : -Math.abs(amount); // 100% loss
    
    setTradeResult({
      value: Math.abs(result),
      type: isProfit ? 'Profit' : 'Loss'
    });
    
    // Show result toast
    toast({
      title: isProfit ? "Trade Profit" : "Trade Loss",
      description: `Your ${direction} trade resulted in a ${isProfit ? "profit" : "loss"} of ₹${Math.abs(result)}`,
      variant: isProfit ? "default" : "destructive",
    });
  };

  const predefinedAmounts = ['600', '1000', '2000', '3000', '5000', '10000'];
  
  const closeModal = () => {
    setIsBuyModalOpen(false);
    setIsSellModalOpen(false);
    setIsTradeTimerOpen(false);
  };
  
  // Toggle fullscreen chart view
  const toggleFullscreen = () => {
    setIsChartFullscreen(!isChartFullscreen);
  };

  // Handle escape key to exit fullscreen
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
      <div className={`flex flex-col h-full bg-[#0A0B14] ${isChartFullscreen ? 'fullscreen-container' : 'pb-24'}`}>
        {/* Fullscreen Chart */}
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
            {/* Hide header info in fullscreen mode */}
            <div className="p-4">
              {/* Coin Header Info */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="bg-[#14151F]/70 backdrop-blur-sm rounded-full p-2 mr-3">
                    <img 
                      src={crypto.logo} 
                      alt={crypto.symbol}
                      className="w-10 h-10"
                    />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-gray-100">{crypto.name}</h2>
                    <p className="text-sm text-gray-400">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-100">${livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className={`text-sm flex items-center justify-end ${priceChange > 0 ? 'text-market-increase' : 'text-market-decrease'}`}>
                    {priceChange > 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(priceChange).toFixed(4)}%
                  </div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              {/* Tabs */}
              <TabsList className="bg-[#14151F] mx-4 grid grid-cols-3 mb-4 rounded-xl">
                <TabsTrigger value="chart" className="rounded-lg text-gray-100 data-[state=active]:bg-[#222430] data-[state=active]:text-blue-400">Chart</TabsTrigger>
                <TabsTrigger value="about" className="rounded-lg text-gray-100 data-[state=active]:bg-[#222430] data-[state=active]:text-blue-400">About</TabsTrigger>
                <TabsTrigger value="trade" className="rounded-lg text-gray-100 data-[state=active]:bg-[#222430] data-[state=active]:text-blue-400">Trade</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto px-4 styled-scrollbar tabs-content-scrollable">
                {/* Tab Content */}
                <TabsContent value="chart" className="space-y-4 mt-0 flex-1">
                  <Card className="bg-[#14151F] border-[#222] text-gray-100">
                    <CardContent className="pt-6">
                      {/* Use the new MobileOptimizedChart for non-fullscreen view */}
                      <MobileOptimizedChart
                        data={transformedChartData}
                        currentPrice={livePrice}
                        previousPrice={livePrice - (livePrice * priceChange / 100)}
                        timeframe={selectedTimeframe}
                        onToggleFullscreen={toggleFullscreen}
                        isFullscreen={false}
                      />
                    </CardContent>
                  </Card>
                  
                  {/* Market Stats */}
                  <Card className="bg-[#14151F] border-[#222] text-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Market Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Market Cap</p>
                          <p className="font-medium">${crypto.market_cap ? parseFloat(crypto.market_cap).toLocaleString(undefined, { maximumFractionDigits: 0 }) : (livePrice * 19000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">24h Volume</p>
                          <p className="font-medium">${crypto.volume_24h ? parseFloat(crypto.volume_24h).toLocaleString(undefined, { maximumFractionDigits: 0 }) : (livePrice * 800000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Circulating Supply</p>
                          <p className="font-medium">19,000,000</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Max Supply</p>
                          <p className="font-medium">21,000,000</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Price History */}
                  <Card className="bg-[#14151F] border-[#222] text-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Price History</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">1h</p>
                          <p className={priceChange > 0 ? 'text-market-increase' : 'text-market-decrease'}>
                            {priceChange > 0 ? '+' : ''}{(priceChange * 0.1).toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">24h</p>
                          <p className={priceChange > 0 ? 'text-market-increase' : 'text-market-decrease'}>
                            {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">7d</p>
                          <p className={priceChange > 0 ? 'text-market-increase' : 'text-market-decrease'}>
                            {priceChange > 0 ? '+' : ''}{(priceChange * 2.5).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* About Tab */}
                <TabsContent value="about">
                  <Card className="bg-[#14151F] border-[#222] text-gray-100">
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        {crypto.name} ({crypto.symbol}) is a digital currency that enables instant payments to anyone, anywhere in the world.
                      </p>
                      <p>
                        {crypto.name} uses peer-to-peer technology to operate with no central authority: managing transactions and issuing money are carried out collectively by the network.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Trade Tab */}
                <TabsContent value="trade">
                  <Card className="bg-[#14151F] border-[#222] text-gray-100">
                    <CardContent className="pt-6 flex flex-col gap-4">
                      <Button className="bg-market-increase hover:bg-market-increase/90" onClick={handleBuyClick}>
                        Buy {crypto.symbol}
                      </Button>
                      <Button variant="outline" className="border-market-decrease text-market-decrease" onClick={handleSellClick}>
                        Sell {crypto.symbol}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
        
        {/* Fixed Buy/Sell buttons at bottom - always visible, even in fullscreen */}
        <div className={`fixed bottom-0 left-0 right-0 p-4 pb-safe bg-[#0A0B14] border-t border-[#222] grid grid-cols-2 gap-3 z-10 ${isChartFullscreen ? 'fullscreen-actions' : ''}`}>
          <Button 
            className="py-5 bg-market-increase hover:bg-market-increase/90 text-white font-semibold rounded-xl"
            onClick={handleBuyClick}
          >
            BUY CALL
          </Button>
          <Button 
            className="py-5 bg-[#14151F] hover:bg-[#1C1D2A] text-market-decrease font-semibold border border-market-decrease rounded-xl"
            onClick={handleSellClick}
          >
            BUY PUT
          </Button>
        </div>
      </div>
      
      {/* Redesigned Buy/Sell Modal */}
      <Dialog open={isBuyModalOpen || isSellModalOpen} onOpenChange={closeModal}>
        <DialogContent className="bg-gradient-to-b from-[#1E2032] to-[#141525] border-none shadow-xl p-0 max-w-sm mx-auto rounded-2xl overflow-hidden m-5">
          {/* Modal Header with Title for accessibility */}
          <DialogTitle className="sr-only">
            {direction === 'Call' ? 'Buy' : 'Sell'} {crypto.symbol}
          </DialogTitle>
          
          <div className="relative border-b border-gray-800/30">
            <div className="px-5 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-[#252739]/70 backdrop-blur-sm rounded-full p-1.5">
                  <img 
                    src={crypto.logo} 
                    alt={crypto.symbol}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    {crypto.symbol}/USD
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      direction === 'Call' 
                        ? 'bg-market-increase/20 text-market-increase' 
                        : 'bg-market-decrease/20 text-market-decrease'
                    }`}>
                      {direction}
                    </span>
                  </h2>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="rounded-full p-2 bg-[#252739] hover:bg-[#313450] transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto styled-scrollbar">
            {/* Time Period Selection */}
            <div className="space-y-3">
              <p className="text-gray-300 font-medium flex items-center gap-1.5">
                <span>Time Period</span>
                <Info className="h-3.5 w-3.5 text-gray-500" />
              </p>
              <div className="grid grid-cols-5 gap-2">
                {['1min', '2min', '5min', '10min', '15min'].map((period) => (
                  <button
                    key={period}
                    className={`px-2 py-2.5 rounded-xl text-sm transition-all ${
                      selectedTimePeriod === period
                      ? `${direction === 'Call' ? 'bg-[#0F4686]' : 'bg-[#461F1E]'} text-white font-medium`
                      : 'bg-[#252739] text-gray-400 hover:bg-[#313450]'
                    }`}
                    onClick={() => setSelectedTimePeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Available Balance */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm">Available Balance</p>
                <p className="text-gray-200 text-sm font-medium">₹ ${user?.wallet}</p>
              </div>
              
              {/* Trade Amount Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</div>
                <Input
                  className="bg-[#252739] border-none text-white text-xl py-6 pl-8 pr-4 rounded-xl font-medium focus:ring-1 focus:ring-blue-600/50"
                  placeholder="Enter amount"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  type="text"
                  inputMode="decimal"
                />
              </div>
              
              {/* Predefined Amount Buttons */}
              <div className="grid grid-cols-3 gap-2.5">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    className={`bg-[#252739] hover:bg-[#313450] transition-all rounded-xl py-3 text-sm font-medium ${
                      tradeAmount === amount 
                        ? 'ring-1 ring-blue-500 text-gray-100' 
                        : 'text-gray-400'
                    }`}
                    onClick={() => setTradeAmount(amount)}
                  >
                    ${parseInt(amount).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Trade Summary */}
            <div className="bg-[#252739]/70 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1.5">Direction</p>
                  <p className={`font-medium text-sm ${
                    direction === 'Call' ? 'text-market-increase' : 'text-market-decrease'
                  }`}>
                    {direction}
                  </p>
                </div>
                <div className="text-center border-x border-gray-700/30">
                  <p className="text-gray-400 text-xs mb-1.5">Current Price</p>
                  <p className="font-medium text-sm text-gray-200">
                    ${livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1.5">Investment</p>
                  <p className="font-medium text-sm text-gray-200">
                    ₹{parseInt(tradeAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Confirm Button */}
            <Button 
              className={`w-full py-5 font-medium text-base rounded-xl ${
                direction === 'Call'
                ? 'bg-market-increase hover:bg-market-increase/90'
                : 'bg-market-decrease hover:bg-market-decrease/90'
              } text-white`}
              onClick={handleConfirmTrade}
            >
              {direction === 'Call' ? 'BUY' : 'SELL'} {selectedTimePeriod}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Trade Timer Component */}
      <TradeTimer
        open={isTradeTimerOpen}
        onClose={closeModal}
        duration={tradeTimer}
        direction={direction}
        startPrice={startingTradePrice}
        currentPrice={livePrice}
        onComplete={handleTradeComplete}
      />
    </MobileLayout>
  );
};

export default CoinDetailPage;
