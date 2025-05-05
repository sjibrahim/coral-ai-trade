
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PriceChart from '@/components/PriceChart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { mockCryptoCurrencies, mockPriceChartData } from '@/data/mockData';
import { ArrowUp, ArrowDown, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NumericKeypad from '@/components/NumericKeypad';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const CoinDetailPage = () => {
  const [activeTab, setActiveTab] = useState('chart');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const crypto = mockCryptoCurrencies[0]; // Using the first crypto from the list for demo
  
  // For buy/sell
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [showTradeSheet, setShowTradeSheet] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
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

  const handleOpenTradeSheet = (type: 'buy' | 'sell') => {
    setTradeType(type);
    setTradeAmount('');
    setShowTradeSheet(true);
  };

  const handleConfirmTrade = () => {
    setShowTradeSheet(false);
    setShowConfirmDialog(false);
    
    // Success message
    setTimeout(() => {
      toast({
        title: `${tradeType === 'buy' ? 'Purchase' : 'Sale'} Successful`,
        description: `You have ${tradeType === 'buy' ? 'purchased' : 'sold'} ${tradeAmount} ${crypto.symbol} at $${livePrice.toFixed(2)}`,
        variant: tradeType === 'buy' ? 'default' : 'destructive',
      });
      setTradeAmount('');
    }, 500);
  };

  const estimatedTotal = tradeAmount ? (Number(tradeAmount) * livePrice).toFixed(2) : '0.00';
  
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
          <Button 
            onClick={() => handleOpenTradeSheet('buy')}
            className="py-5 bg-market-increase hover:bg-market-increase/90 text-white font-semibold rounded-xl"
          >
            BUY
          </Button>
          <Button 
            onClick={() => handleOpenTradeSheet('sell')}
            className="py-5 bg-[#14151F] hover:bg-[#1C1D2A] text-market-decrease font-semibold border border-market-decrease rounded-xl"
          >
            SELL
          </Button>
        </div>
      </div>

      {/* Trade Sheet Modal (Buy/Sell) */}
      <Sheet open={showTradeSheet} onOpenChange={setShowTradeSheet}>
        <SheetContent side="bottom" className="h-[85%] bg-[#0A0B14] border-t border-[#222] rounded-t-3xl p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#222]">
              <h2 className="text-xl font-bold text-gray-100">
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {crypto.symbol}
              </h2>
              <button 
                onClick={() => setShowTradeSheet(false)} 
                className="p-2 rounded-full hover:bg-[#222]/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Price */}
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-1">Current Price</div>
                <div className="text-2xl font-bold text-gray-100">
                  ${livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className={`text-sm flex items-center ${priceChange > 0 ? 'text-market-increase' : 'text-market-decrease'}`}>
                  {priceChange > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(priceChange).toFixed(4)}% (24h)
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-1">
                  {tradeType === 'buy' ? 'Amount to Purchase' : 'Amount to Sell'}
                </div>
                <div className="flex items-center gap-2 bg-[#14151F] rounded-xl p-3 border border-[#222]">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={tradeAmount}
                      onChange={(e) => {
                        // Only allow numbers and one decimal point
                        const value = e.target.value;
                        if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                          setTradeAmount(value);
                        }
                      }}
                      className="w-full bg-transparent text-2xl font-bold text-gray-100 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="text-gray-100 font-semibold">{crypto.symbol}</div>
                </div>
              </div>

              {/* Estimated Total */}
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-1">
                  {tradeType === 'buy' ? 'Estimated Cost' : 'Estimated Proceeds'}
                </div>
                <div className="text-xl font-bold text-gray-100">
                  ${estimatedTotal}
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[0.1, 0.5, 1].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTradeAmount(amount.toString())}
                    className={cn(
                      "py-2 px-1 rounded-xl transition-all duration-200",
                      "border border-[#222] bg-[#14151F]/50",
                      "hover:bg-primary/10 hover:border-primary/50",
                      tradeAmount === amount.toString() && "bg-primary/20 border-primary/70"
                    )}
                  >
                    <span className="text-sm font-medium text-gray-100">{amount} {crypto.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="border-t border-[#222] p-4">
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={!tradeAmount || Number(tradeAmount) <= 0}
                className={cn(
                  "w-full py-5 rounded-xl font-semibold text-white",
                  tradeType === 'buy'
                    ? "bg-market-increase hover:bg-market-increase/90"
                    : "bg-market-decrease hover:bg-market-decrease/90"
                )}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {tradeAmount || '0'} {crypto.symbol}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-[#14151F] border-[#222]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">
              Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              You are about to {tradeType === 'buy' ? 'purchase' : 'sell'} {tradeAmount} {crypto.symbol} at ${livePrice.toFixed(2)} each.
              {tradeType === 'buy'
                ? ` This will cost approximately $${estimatedTotal}.`
                : ` You will receive approximately $${estimatedTotal}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#222] text-gray-300 border-[#333]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmTrade}
              className={
                tradeType === 'buy'
                  ? "bg-market-increase hover:bg-market-increase/90"
                  : "bg-market-decrease hover:bg-market-decrease/90"
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
};

export default CoinDetailPage;
