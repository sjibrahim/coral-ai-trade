
import { useState, useEffect, useRef } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PriceChart from '@/components/PriceChart';
import { Card } from '@/components/ui/card';
import { mockCryptoCurrencies, mockPriceChartData } from '@/data/mockData';
import { ArrowUp, ArrowDown, ChevronRight, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import NumericKeypad from '@/components/NumericKeypad';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const CoinDetailPage = () => {
  const crypto = mockCryptoCurrencies[0]; // Using Bitcoin for demo
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // For price updates
  const [currentDate] = useState(new Date());
  const [currentPrice, setCurrentPrice] = useState(93944.28);
  const [previousPrice, setPreviousPrice] = useState(93916.78);
  const [priceChange, setPriceChange] = useState(0.0293);
  const [chartData, setChartData] = useState<{timestamp: string, price: number}[]>([]);
  
  // For time selection
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m'); 
  
  // For trade modal
  const [tradeType, setTradeType] = useState<'call' | 'put'>('call');
  const [showTradeSheet, setShowTradeSheet] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradePeriod, setTradePeriod] = useState('1min');
  const [availableBalance, setAvailableBalance] = useState(20023);

  // Generate initial chart data
  useEffect(() => {
    generateChartData();
  }, []);

  // Generate chart data based on the selected timeframe
  const generateChartData = () => {
    const data: {timestamp: string, price: number}[] = [];
    const now = new Date();
    const basePrice = 94000;
    let currentTime = new Date(now);
    
    // Adjust time scale based on timeframe
    const timeScale = selectedTimeframe === '1m' ? 1 :
                      selectedTimeframe === '5m' ? 5 :
                      selectedTimeframe === '15m' ? 15 : 1;
                      
    // Create data points for last hour
    for (let i = 60; i >= 0; i--) {
      currentTime.setMinutes(now.getMinutes() - (i * timeScale));
      const timestamp = currentTime.toTimeString().substring(0, 5);
      
      // Generate random price fluctuation for realistic chart
      const randomChange = (Math.random() - 0.5) * 100;
      const price = basePrice - (i < 50 ? 60 : 0) + randomChange;
      
      data.push({
        timestamp,
        price
      });
    }
    
    // Set the current price to the latest data point
    setCurrentPrice(data[data.length-1].price);
    setPreviousPrice(data[0].price);
    setPriceChange(((data[data.length-1].price - data[0].price) / data[0].price) * 100);
    setChartData(data);
  };

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random price fluctuation between -0.1% and +0.1%
      const fluctuation = (Math.random() - 0.5) * 0.002;
      const newPrice = currentPrice * (1 + fluctuation);
      
      // Add new price point to chart data
      const now = new Date();
      const timestamp = now.toTimeString().substring(0, 5);
      
      setChartData(prev => {
        const newData = [...prev.slice(1), { timestamp, price: newPrice }];
        return newData;
      });
      
      setCurrentPrice(newPrice);
      
      // Update change percentage
      const newChange = priceChange + (fluctuation * 100);
      setPriceChange(newChange);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [currentPrice, priceChange]);

  const handleOpenTradeSheet = (type: 'call' | 'put') => {
    setTradeType(type);
    setTradeAmount('');
    setShowTradeSheet(true);
  };

  const handleConfirmTrade = () => {
    setShowTradeSheet(false);
    
    // Success message
    toast({
      title: `${tradeType === 'call' ? 'Buy Call' : 'Buy Put'} Order Placed`,
      description: `Your ${tradePeriod} ${tradeType} order for ${tradeAmount} has been placed at ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      variant: "default",
    });
    
    setTradeAmount('');
  };

  const handleTradePeriodChange = (period: string) => {
    setTradePeriod(period);
  };
  
  const handleQuickAmountSelect = (amount: number) => {
    setTradeAmount(amount.toString());
  };

  const isPriceIncreasing = currentPrice > previousPrice;

  // Format the price with proper separators
  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const renderTimeOptions = () => {
    return (
      <div className="flex space-x-2 justify-center my-3 overflow-x-auto scrollbar-hide">
        {['1m', '5m', '15m', '30m', '1h', '1d'].map(time => (
          <button
            key={time}
            onClick={() => setSelectedTimeframe(time)}
            className={cn(
              "px-4 py-1 rounded-full text-sm font-medium flex-shrink-0",
              selectedTimeframe === time
                ? "bg-[#323755] text-white shadow-inner"
                : "bg-[#1B1D2D] text-gray-400 hover:bg-[#262B43]"
            )}
          >
            {time}
          </button>
        ))}
      </div>
    );
  };

  return (
    <MobileLayout showBackButton title={crypto.name} noScroll>
      <div className="flex flex-col h-full bg-gradient-to-b from-[#0A0B14] to-[#141723]">
        {/* Header with price info */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={crypto.logo} alt={crypto.symbol} className="w-10 h-10" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{crypto.symbol}/INR</span>
                <span className={cn(
                  "text-xs rounded-full px-2 py-0.5 flex items-center",
                  isPriceIncreasing ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                )}>
                  {isPriceIncreasing ? <ChevronUp className="h-3 w-3 mr-0.5" /> : <ChevronDown className="h-3 w-3 mr-0.5" />}
                  {Math.abs(priceChange).toFixed(4)}%
                </span>
              </div>
              <p className="text-sm text-gray-400">{currentDate.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white">$ {formatPrice(currentPrice)}</h1>
              <sup className="ml-2 text-sm text-gray-400 font-normal">({crypto.symbol})</sup>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex-1 flex flex-col relative overflow-hidden" ref={chartContainerRef}>
          {/* Timeframe tabs */}
          {renderTimeOptions()}
          
          <Card className="flex-1 mx-3 mb-24 overflow-hidden bg-[#151824] border border-[#252A43]/50 shadow-lg rounded-xl">
            <div className="h-full w-full p-2">
              <div className="flex justify-between mb-2 px-2 pt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">O: {formatPrice(previousPrice)}</span>
                  <span className="text-xs text-gray-400">C: {formatPrice(currentPrice)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">
                    H: {formatPrice(Math.max(...chartData.map(d => d.price)))}
                  </span>
                  <span className="text-xs text-gray-400">
                    L: {formatPrice(Math.min(...chartData.map(d => d.price)))}
                  </span>
                </div>
              </div>
              
              <PriceChart 
                data={chartData}
                height="100%"
                currentPrice={currentPrice}
                previousPrice={previousPrice}
                areaChart={true}
                showGridLines={true}
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                {chartData.length > 0 && (
                  <>
                    <span>{chartData[0].timestamp}</span>
                    <span>{chartData[Math.floor(chartData.length / 2)].timestamp}</span>
                    <span>{chartData[chartData.length - 1].timestamp}</span>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom trading buttons */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-3 backdrop-blur-md bg-[#0A0B14]/90 border-t border-[#252A43]/30 grid grid-cols-2 gap-3 pb-safe">
          <Button 
            onClick={() => handleOpenTradeSheet('call')}
            className="py-6 bg-[#4169E1] hover:bg-[#3154c7] text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-900/20"
          >
            BUY CALL
          </Button>
          <Button 
            onClick={() => handleOpenTradeSheet('put')}
            variant="outline"
            className="py-6 bg-transparent hover:bg-white/5 text-white border-white/20 font-bold rounded-xl text-lg"
          >
            BUY PUT
          </Button>
        </div>
      </div>

      {/* Trading Modal */}
      <Sheet open={showTradeSheet} onOpenChange={setShowTradeSheet}>
        <SheetContent side="bottom" className="h-[85%] bg-[#0A0B14] border-t border-[#252A43] rounded-t-3xl p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-[#252A43]">
              <div>
                <h2 className="text-xl font-bold text-white">
                  BTC/INR
                </h2>
                <p className="text-sm text-gray-400">Select Time Period</p>
              </div>
              <button 
                onClick={() => setShowTradeSheet(false)} 
                className="p-2 rounded-full hover:bg-[#252A43]/50 text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Time period selection */}
            <div className="p-4 border-b border-[#252A43]">
              <div className="bg-[#111218] rounded-full p-1 flex">
                {['1min', '2min', '5min', '10min', '15min'].map((period) => (
                  <button
                    key={period}
                    onClick={() => handleTradePeriodChange(period)}
                    className={cn(
                      "flex-1 py-3 rounded-full text-center text-sm font-medium transition-all",
                      tradePeriod === period
                        ? "bg-[#252A43] text-white shadow-inner"
                        : "text-gray-400"
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Available balance and amount input */}
            <div className="p-4 border-b border-[#252A43]">
              <div className="mb-2">
                <p className="text-gray-400 text-sm">Available : ₹{availableBalance}</p>
              </div>
              
              <div className="bg-[#151824] border border-[#252A43] rounded-xl p-4 mb-4 relative">
                <input
                  type="text"
                  value={tradeAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value)) {
                      setTradeAmount(value);
                    }
                  }}
                  placeholder="0"
                  className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none"
                />
              </div>

              {/* Quick amount buttons */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[600, 1000, 2000, 3000, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAmountSelect(amount)}
                    className={cn(
                      "py-3 rounded-xl bg-[#151824] border",
                      tradeAmount === amount.toString()
                        ? "border-blue-500/50 text-blue-400"
                        : "border-[#252A43] text-gray-300",
                      "hover:border-blue-500/30 transition-colors"
                    )}
                  >
                    <span className="font-medium">₹{amount}</span>
                  </button>
                ))}
              </div>
              
              {/* Summary */}
              <div className="bg-[#151824] border border-[#252A43] rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">Direction</p>
                    <p className="text-white font-medium">{tradeType === 'call' ? 'Call' : 'Put'}</p>
                  </div>
                  <div className="text-center border-x border-[#252A43]">
                    <p className="text-gray-400">Price</p>
                    <p className={cn(
                      "font-medium",
                      isPriceIncreasing ? "text-green-400" : "text-red-400"
                    )}>{currentPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Amount</p>
                    <p className="text-white font-medium">{tradeAmount || '0'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm button */}
            <div className="mt-auto p-4">
              <Button
                onClick={handleConfirmTrade}
                disabled={!tradeAmount || Number(tradeAmount) <= 0}
                className="w-full py-5 bg-[#4169E1] hover:bg-[#3154c7] text-white font-bold rounded-xl text-lg shadow-lg"
              >
                CONFIRM
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </MobileLayout>
  );
};

export default CoinDetailPage;
