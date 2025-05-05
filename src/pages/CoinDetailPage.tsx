
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PriceChart from '@/components/PriceChart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { mockCryptoCurrencies, mockPriceChartData } from '@/data/mockData';
import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

const CoinDetailPage = () => {
  const [activeTab, setActiveTab] = useState('chart');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const crypto = mockCryptoCurrencies[0]; // Using the first crypto from the list for demo
  
  // Transform mockPriceChartData to have the timestamp property instead of time
  const transformedChartData = mockPriceChartData.map(item => ({
    timestamp: item.time,
    price: item.price
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
    }, 3000);
    
    return () => clearInterval(interval);
  }, [livePrice, priceChange]);
  
  return (
    <MobileLayout showBackButton title={crypto.name} noScroll>
      <div className="flex flex-col h-full bg-[#0A0B14]">
        <div className="p-4">
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
          <TabsList className="bg-[#14151F] mx-4 grid grid-cols-3 mb-4 rounded-xl">
            <TabsTrigger value="chart" className="rounded-lg text-gray-100 data-[state=active]:bg-[#222430] data-[state=active]:text-blue-400">Chart</TabsTrigger>
            <TabsTrigger value="about" className="rounded-lg text-gray-100 data-[state=active]:bg-[#222430] data-[state=active]:text-blue-400">About</TabsTrigger>
            <TabsTrigger value="trade" className="rounded-lg text-gray-100 data-[state=active]:bg-[#222430] data-[state=active]:text-blue-400">Trade</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto px-4 pb-24">
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
                    areaChart
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
            
            <TabsContent value="trade">
              <Card className="bg-[#14151F] border-[#222] text-gray-100">
                <CardContent className="pt-6 flex flex-col gap-4">
                  <Button className="bg-market-increase hover:bg-market-increase/90">
                    Buy {crypto.symbol}
                  </Button>
                  <Button variant="outline" className="border-market-decrease text-market-decrease">
                    Sell {crypto.symbol}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
        
        {/* Fixed Buy/Sell buttons at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0B14] border-t border-[#222] grid grid-cols-2 gap-3">
          <Button className="py-5 bg-market-increase hover:bg-market-increase/90 text-white font-semibold rounded-xl">
            BUY
          </Button>
          <Button className="py-5 bg-[#14151F] hover:bg-[#1C1D2A] text-market-decrease font-semibold border border-market-decrease rounded-xl">
            SELL
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CoinDetailPage;
