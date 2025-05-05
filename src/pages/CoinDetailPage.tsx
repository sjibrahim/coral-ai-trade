
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PriceChart from '@/components/PriceChart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mockCryptoCurrencies, mockPriceChartData } from '@/data/mockData';
import { ArrowUp, ArrowDown, ChevronRight, X, Info } from 'lucide-react';

const CoinDetailPage = () => {
  const [activeTab, setActiveTab] = useState('chart');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('1min');
  const [tradeAmount, setTradeAmount] = useState('1000');
  const [direction, setDirection] = useState('Call'); // 'Call' or 'Put'
  const [chartData, setChartData] = useState(mockPriceChartData);
  
  const crypto = mockCryptoCurrencies[0]; // Using the first crypto from the list for demo
  
  // Transform mockPriceChartData to have the timestamp property instead of time
  const transformedChartData = chartData.map(item => ({
    timestamp: item.time,
    price: item.price,
    volume: Math.random() * 100000, // Add random volume data for demonstration
    high: item.price * (1 + Math.random() * 0.01), // Add high price
    low: item.price * (1 - Math.random() * 0.01), // Add low price
  }));

  // Simulate live price updates
  const [livePrice, setLivePrice] = useState(crypto.price);
  const [priceChange, setPriceChange] = useState(crypto.change);

  // Create a live price effect
  useEffect(() => {
    const interval = setInterval(() => {
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
      setChartData(prevData => [...prevData.slice(1), newDataPoint]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [livePrice, priceChange]);

  const handleBuyClick = () => {
    setDirection('Call');
    setIsBuyModalOpen(true);
  };

  const handleSellClick = () => {
    setDirection('Put');
    setIsSellModalOpen(true);
  };
  
  const handleConfirmTrade = () => {
    console.log(`Confirmed ${direction} trade for ${tradeAmount} on ${crypto.symbol} with ${selectedTimePeriod} timeframe`);
    setIsBuyModalOpen(false);
    setIsSellModalOpen(false);
    // In a real app, you would submit the trade here
  };

  const predefinedAmounts = ['600', '1000', '2000', '3000', '5000', '10000'];
  
  const closeModal = () => {
    setIsBuyModalOpen(false);
    setIsSellModalOpen(false);
  };
  
  return (
    <MobileLayout showBackButton title={crypto.name} noScroll={false}>
      <div className="flex flex-col h-full bg-[#0A0B14] pb-24">
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
          
          <div className="flex-1 overflow-y-auto px-4 styled-scrollbar">
            {/* Tab Content */}
            <TabsContent value="chart" className="space-y-4 mt-0 flex-1">
              <Card className="bg-[#14151F] border-[#222] text-gray-100">
                <CardContent className="pt-6">
                  <PriceChart 
                    data={transformedChartData} 
                    currentPrice={livePrice}
                    previousPrice={livePrice - (livePrice * priceChange / 100)}
                    height={220}
                    timeframe={selectedTimeframe}
                    showControls={false}
                    areaChart={true}
                    showVolume={true}
                    showGridLines={true}
                    enhancedTooltip={true}
                  />
                  
                  <div className="flex space-x-2 mt-4 justify-center">
                    {['1h', '24h', '7d', '30d'].map(tf => (
                      <button
                        key={tf}
                        onClick={() => setSelectedTimeframe(tf)}
                        className={`px-4 py-1.5 rounded-lg text-sm ${
                          selectedTimeframe === tf
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#222430] text-gray-300'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
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
                      <p className="font-medium">${(livePrice * 19000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">24h Volume</p>
                      <p className="font-medium">${(livePrice * 800000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
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
        
        {/* Fixed Buy/Sell buttons at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-[#0A0B14] border-t border-[#222] grid grid-cols-2 gap-3 z-10">
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
        <DialogContent className="bg-gradient-to-b from-[#1E2032] to-[#141525] border-none shadow-xl p-0 max-w-sm mx-auto rounded-2xl overflow-hidden">
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
                    {crypto.symbol}/INR
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
          
          <div className="p-5 space-y-5 max-h-[calc(100vh-120px)] overflow-y-auto styled-scrollbar">
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
                <p className="text-gray-200 text-sm font-medium">₹ 20,023</p>
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
                    ₹{parseInt(amount).toLocaleString()}
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
                    ₹{livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
    </MobileLayout>
  );
};

export default CoinDetailPage;
