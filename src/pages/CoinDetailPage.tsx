import { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PriceChart from '@/components/PriceChart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { mockCryptoCurrencies, mockBalances } from '@/data/mockData';
import NumericKeypad from '@/components/NumericKeypad';

// Create more detailed mock price data
const generateDetailedMockData = () => {
  const basePrice = 94300;
  const now = new Date();
  const data = [];
  
  // Generate 60 data points for the last hour (one per minute)
  for (let i = 60; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const timeString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    // Create some price movements, more volatile at the beginning and end
    let volatility;
    if (i > 45) volatility = 150;
    else if (i > 30) volatility = 100;
    else if (i > 15) volatility = 200;
    else volatility = 160;
    
    // Create some patterns in the price
    const randomFactor = Math.sin(i / 5) * volatility + (Math.random() - 0.5) * volatility;
    
    // Create a downward trend, then upward at the end
    const trendFactor = i > 20 ? -30 : 20;
    
    const price = basePrice + randomFactor + (60 - i) * trendFactor / 10;
    
    data.push({
      timestamp: timeString,
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return data;
};

const detailedMockPriceData = generateDetailedMockData();

const CoinDetailPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'call' | 'put'>('call');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const [livePrice, setLivePrice] = useState(94278.61);
  const [priceChange, setPriceChange] = useState(0.0009);
  const [amount, setAmount] = useState(mockBalances.availableBalance.toString());
  const [selectedTime, setSelectedTime] = useState('1min');
  const [chartData, setChartData] = useState(detailedMockPriceData);

  const crypto = mockCryptoCurrencies[0]; // Using Bitcoin

  // Simulate live price updates with a more sophisticated pattern
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Create a more realistic price movement
      const marketMood = Math.random(); // market sentiment
      
      let priceDelta;
      if (marketMood > 0.95) {
        // Occasional larger moves
        priceDelta = (Math.random() - 0.3) * 100;
      } else if (marketMood > 0.5) {
        // Slight upward bias
        priceDelta = (Math.random() - 0.45) * 20;
      } else {
        // Slight downward bias
        priceDelta = (Math.random() - 0.55) * 20;
      }
      
      const newPrice = livePrice + priceDelta;
      setLivePrice(newPrice);

      // Calculate change percentage
      const changePercent = (priceDelta / livePrice) * 100;
      setPriceChange(prevChange => {
        let newChange = prevChange + changePercent;
        // Keep the change within reasonable bounds
        if (Math.abs(newChange) > 5) {
          newChange = newChange > 0 ? 5 : -5;
        }
        return newChange;
      });

      // Update chart with new data point
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setChartData(prevData => {
        const newData = [...prevData.slice(1), { timestamp: timeString, price: newPrice }];
        return newData;
      });
    }, 3000);
    
    return () => clearInterval(updateInterval);
  }, [livePrice]);

  const handleOpenModal = (type: 'call' | 'put') => {
    setTradeType(type);
    setIsModalOpen(true);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toString();
  };

  return (
    <MobileLayout showBackButton title="" noScroll>
      <div className="flex flex-col h-full bg-[#0A0B14]">
        {/* Header with coin info */}
        <div className="flex items-center justify-center py-2 border-b border-[#222] bg-[#0F1018]">
          <div className="flex items-center gap-2">
            <img 
              src={crypto.logo}
              alt={crypto.symbol}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-100">{crypto.name} ({crypto.symbol})</span>
          </div>
        </div>

        {/* Price information */}
        <div className="px-4 pt-6 pb-2">
          <div className="flex justify-between items-baseline">
            <div>
              <h2 className="text-3xl font-bold text-gray-100">
                ${livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </h2>
              <p className="text-sm text-gray-400">
                ({crypto.price.toLocaleString(undefined, { maximumFractionDigits: 7 })})
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full ${priceChange >= 0 ? 'bg-[#063D21]/20 text-[#22c55e]' : 'bg-[#450A0A]/20 text-[#ef4444]'}`}>
              <span className="text-base font-medium">
                {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(4)}%
              </span>
            </div>
          </div>
        </div>

        {/* Time period selection */}
        <div className="px-4 pb-2">
          <div className="flex space-x-3 mb-1">
            {['1m', '3m', '5m', '15m', 'Area'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1 text-sm rounded-lg ${
                  selectedTimeframe === tf
                    ? 'bg-[#1D1E2A] text-gray-100 font-medium'
                    : 'bg-transparent text-gray-400'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="text-[10px] text-gray-400 flex space-x-6 px-1">
            <span>Time: {new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            <span>Open: {(livePrice - 10).toFixed(2)}</span>
            <span>Close: {livePrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Chart container */}
        <div className="flex-1 w-full overflow-hidden pb-20">
          <PriceChart
            data={chartData}
            currentPrice={livePrice}
            previousPrice={livePrice - (livePrice * priceChange / 100)}
            showControls={false}
            height="100%"
            areaChart={selectedTimeframe === 'Area'}
          />
        </div>

        {/* Fixed Buy/Sell buttons at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0B14] border-t border-[#222] grid grid-cols-2 gap-4">
          <Button 
            onClick={() => handleOpenModal('call')}
            className="bg-[#3861FB] hover:bg-[#3861FB]/90 text-white font-bold py-3 rounded-xl text-lg"
          >
            BUY CALL
          </Button>
          <Button 
            onClick={() => handleOpenModal('put')}
            className="bg-transparent hover:bg-[#1C1D2A] text-white font-bold py-3 border-2 border-[#3861FB] rounded-xl text-lg"
          >
            BUY PUT
          </Button>
        </div>

        {/* Trading Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-[#14151F] border border-[#222] text-white p-0 rounded-2xl w-[90%] max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {crypto.symbol}/USD
                </h2>
                <DialogClose className="bg-[#1A1F2C]/80 rounded-full p-2">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>

              {/* Time selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Select Time Period</h3>
                <div className="bg-[#1A1F2C]/60 p-1 rounded-full flex justify-between">
                  {['1min', '2min', '5min', '10min', '15min'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-full py-2 px-3 text-sm ${
                        selectedTime === time
                          ? 'bg-[#3861FB] text-white'
                          : 'text-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available balance */}
              <div className="mb-4">
                <p className="text-gray-400">
                  Available: ${mockBalances.availableBalance}
                </p>
              </div>

              {/* Amount input */}
              <div className="bg-[#1A1F2C]/30 border border-[#333] rounded-xl p-4 mb-4">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold focus:outline-none"
                />
              </div>

              {/* Quick amount selection */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[600, 1000, 2000, 3000, 5000, 10000].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleQuickAmountSelect(value)}
                    className="bg-[#1A1F2C]/80 hover:bg-[#1A1F2C] rounded-full py-2 px-1 text-sm transition"
                  >
                    ${value}
                  </button>
                ))}
              </div>

              {/* Trade summary */}
              <div className="bg-[#1A1F2C]/30 border border-[#333] rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Direction</p>
                    <p className="text-white font-medium">
                      {tradeType === 'call' ? 'Call' : 'Put'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Price</p>
                    <p className={`${priceChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'} font-medium`}>
                      {livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Amount</p>
                    <p className="text-white font-medium">
                      {parseFloat(amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirm button */}
              <Button
                className="w-full bg-[#3861FB] hover:bg-[#3861FB]/90 py-6 rounded-xl text-lg font-bold"
              >
                CONFIRM
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
};

export default CoinDetailPage;
