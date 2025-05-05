
import { useState, useEffect, useRef } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PriceChart from '@/components/PriceChart';
import { Button } from '@/components/ui/button';
import { mockCryptoCurrencies, mockPriceChartData } from '@/data/mockData';
import { ArrowDown, ArrowUp } from 'lucide-react';

const CoinDetailPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const crypto = mockCryptoCurrencies[0]; // Using the first crypto from the list for demo
  
  // Transform mockPriceChartData to have the timestamp property instead of time
  const transformedChartData = mockPriceChartData.map(item => ({
    timestamp: item.time,
    price: item.price
  }));

  // Simulate live price updates
  const [livePrice, setLivePrice] = useState(crypto.price);
  const [priceChange, setPriceChange] = useState(-0.0753); // Negative change as shown in reference
  const [openPrice, setOpenPrice] = useState(93974.74);
  const [currentTime, setCurrentTime] = useState(new Date());
  const chartRef = useRef<HTMLDivElement>(null);

  // Create a live price effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Random price fluctuation between -0.5% and +0.5%
      const fluctuation = (Math.random() - 0.6) * 0.01; // Slightly biased to negative to match reference
      const newPrice = livePrice * (1 + fluctuation);
      setLivePrice(newPrice);
      
      // Update change percentage
      const newChange = fluctuation * 100;
      setPriceChange(parseFloat((priceChange + (fluctuation * 0.1)).toFixed(4)));
      
      // Update current time
      setCurrentTime(new Date());
    }, 3000);
    
    return () => clearInterval(interval);
  }, [livePrice, priceChange]);
  
  // Format current time to match reference (2025-05-05 07:19)
  const formatCurrentTime = () => {
    return `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(2, '0')} ${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <MobileLayout showBackButton noScroll className="bg-[#0F1116] text-white">
      <div className="flex flex-col h-full">
        {/* Header with crypto name and symbol */}
        <div className="flex items-center justify-center py-4 px-6 relative">
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded-full p-1 mr-1">
              <img 
                src={crypto.logo} 
                alt={crypto.symbol}
                className="w-6 h-6"
              />
            </div>
            <h1 className="text-xl font-bold">Bitcoin (BTC)</h1>
          </div>
          
          <div className="absolute right-4">
            <Button variant="ghost" className="bg-[#29303E] rounded-full p-2 h-auto w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-line"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </Button>
          </div>
        </div>
        
        {/* Price information */}
        <div className="px-6 py-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">${livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h2>
              <p className="text-gray-400 text-sm">( {(livePrice / 15278.74).toFixed(7)} )</p>
            </div>
            <div className={`${priceChange < 0 ? 'bg-[#F25F5C]' : 'bg-[#41C3A9]'} px-4 py-1 rounded-full text-white`}>
              {priceChange > 0 ? '+' : ''}{priceChange}%
            </div>
          </div>
        </div>
        
        {/* Time period selector */}
        <div className="px-2 pt-6 flex space-x-4 justify-around overflow-x-auto">
          {['1m', '3m', '5m', '15m', 'Area'].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-5 py-1 text-sm ${
                selectedTimeframe === tf
                  ? 'text-white font-medium'
                  : 'text-gray-400'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        
        {/* Time and price info */}
        <div className="px-6 pt-1 pb-0 text-xs text-gray-400">
          <p>
            时间: {formatCurrentTime()} &nbsp; 开: {openPrice.toFixed(2)} &nbsp; 收: {livePrice.toFixed(2)}
          </p>
        </div>
        
        {/* Chart area */}
        <div 
          ref={chartRef} 
          className="flex-grow relative my-2"
          style={{ minHeight: '400px' }}
        >
          <PriceChart 
            data={transformedChartData} 
            currentPrice={livePrice}
            previousPrice={livePrice - (livePrice * priceChange / 100)}
            height="100%"
            timeframe={selectedTimeframe}
            showControls={false}
            tooltipVisible={false}
            showHorizontalLine
            currentPriceLabel="93904.02"
          />
        </div>
        
        {/* Bottom buttons */}
        <div className="px-4 py-4 flex space-x-4 bg-[#0F1116]">
          <Button 
            className="flex-1 py-6 rounded-xl bg-[#4C6FFF] hover:bg-[#3C5FEF] text-white font-bold text-lg"
          >
            BUY CALL
          </Button>
          <Button 
            className="flex-1 py-6 rounded-xl bg-transparent hover:bg-[#29303E] text-white border border-gray-600 font-bold text-lg"
          >
            BUY PUT
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CoinDetailPage;
