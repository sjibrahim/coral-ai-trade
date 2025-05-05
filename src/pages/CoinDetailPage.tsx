
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { mockCryptoCurrencies, mockPriceChartData, mockBalances } from "@/data/mockData";
import PriceChart from "@/components/PriceChart";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X, ChevronRight, TrendingUp, TrendingDown, Info, Clock, Wallet } from "lucide-react";

const CoinDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tradeDirection, setTradeDirection] = useState<'CALL' | 'PUT'>('CALL');
  const [selectedAmount, setSelectedAmount] = useState(mockBalances.availableBalance.toString());
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<'1min' | '2min' | '5min' | '10min' | '15min'>('1min');
  const [timeLeft, setTimeLeft] = useState(60); // For countdown timer
  
  // Find the cryptocurrency by ID
  const coin = mockCryptoCurrencies.find(crypto => crypto.id === id);
  
  // Countdown timer effect for demo
  useEffect(() => {
    if (!isDialogOpen || timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, isDialogOpen]);
  
  if (!coin) {
    return (
      <MobileLayout showBackButton title="Coin Detail">
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-xl text-muted-foreground">Cryptocurrency not found</p>
        </div>
      </MobileLayout>
    );
  }
  
  const isPositiveChange = coin.change >= 0;
  
  const handleOpenTrade = (direction: 'CALL' | 'PUT') => {
    setTradeDirection(direction);
    setTimeLeft(60); // Reset countdown
    setIsDialogOpen(true);
  };
  
  const handleConfirmTrade = () => {
    // In a real app, this would submit the trade to an API
    console.log(`Confirming ${tradeDirection} trade for ${selectedAmount} on ${coin.symbol} with ${selectedTimePeriod} timeframe`);
    setIsDialogOpen(false);
  };

  const predefinedAmounts = [600, 1000, 2000, 3000, 5000, 10000];
  
  const currentPrice = Math.floor(coin.price * 83.25); // Converting to INR for demo
  
  // Calculate potential profit (simplified for demo)
  const calculateProfit = () => {
    const amount = Number(selectedAmount);
    // Simply using a 95% return for demo purposes
    return amount * 0.95;
  };
  
  return (
    <MobileLayout showBackButton title={`${coin.symbol}`}>
      <div className="p-4 space-y-5 pb-20 animate-fade-in">
        {/* Current Price */}
        <div className="card-glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/30 p-1.5 rounded-lg">
                <img src={coin.logo} alt={coin.name} className="w-9 h-9" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{coin.name}</h1>
                <p className="text-sm text-muted-foreground">{coin.symbol}/USDT</p>
              </div>
            </div>
            <span className={cn(
              "px-2.5 py-1 rounded-full text-sm font-medium",
              isPositiveChange ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}>
              {isPositiveChange ? '+' : ''}{coin.change}%
            </span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gradient">${coin.price.toLocaleString()}</h2>
            <p className="text-base text-muted-foreground">
              (₹ {(coin.price * 83.25).toFixed(2)})
            </p>
          </div>
        </div>
        
        {/* Chart */}
        <div className="card-glass rounded-xl p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-1.5">
              {['1H', '4H', '1D', '1W', 'All'].map((period) => (
                <button 
                  key={period}
                  className={cn(
                    "px-3 py-1 text-xs rounded-md transition-colors",
                    period === '1H' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary/50'
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
            <button className="text-primary text-sm">
              <Info size={16} />
            </button>
          </div>
          <PriceChart data={mockPriceChartData} isPositive={isPositiveChange} />
        </div>
        
        {/* Trade Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            className={cn(
              "rounded-xl py-3.5 text-white font-semibold text-base flex items-center justify-center gap-2",
              "bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/20"
            )}
            onClick={() => handleOpenTrade('CALL')}
          >
            <TrendingUp size={18} />
            BUY CALL
          </button>
          <button 
            className={cn(
              "rounded-xl py-3.5 font-semibold text-base flex items-center justify-center gap-2",
              "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/20 text-white"
            )}
            onClick={() => handleOpenTrade('PUT')}
          >
            <TrendingDown size={18} />
            BUY PUT
          </button>
        </div>
        
        {/* Coin Information */}
        <div className="card-glass rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="text-gradient">About {coin.name}</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            {coin.name} ({coin.symbol}) is a digital currency that can be sent from user to user on the peer-to-peer network without the need for intermediaries.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
              <p className="font-medium">${(coin.price * 19000000).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Volume (24h)</p>
              <p className="font-medium">${(coin.price * 500000).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Circulating Supply</p>
              <p className="font-medium">19,000,000</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Max Supply</p>
              <p className="font-medium">21,000,000</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Redesigned Trade Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-background border-none p-0 max-w-md rounded-xl sm:max-w-md">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className={cn(
              "px-4 py-3 flex items-center justify-between rounded-t-xl",
              tradeDirection === 'CALL' 
                ? "bg-gradient-to-r from-green-600/90 to-green-500/90" 
                : "bg-gradient-to-r from-red-600/90 to-red-500/90"
            )}>
              <div className="flex items-center gap-3">
                <img src={coin.logo} alt={coin.name} className="w-8 h-8" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-bold text-white">{coin.symbol}/INR</h2>
                    <span className={cn(
                      "px-1.5 py-0.5 text-xs rounded-md font-medium",
                      tradeDirection === 'CALL' ? "bg-green-300/20 text-green-300" : "bg-red-300/20 text-red-300"
                    )}>
                      {tradeDirection}
                    </span>
                  </div>
                  <p className="text-xs text-white/70">Current: ₹{currentPrice.toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDialogOpen(false)} 
                className="rounded-full bg-white/10 p-1.5 hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-5">
              {/* Time period selection with countdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium flex items-center gap-1">
                    <Clock size={16} className="text-primary" />
                    Time Period
                  </h3>
                  {isDialogOpen && timeLeft > 0 && (
                    <div className="bg-secondary/50 px-2 py-1 rounded-md text-xs flex items-center">
                      <span className="text-primary font-medium">{timeLeft}s</span>
                      <span className="text-muted-foreground ml-1">remaining</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-1 bg-secondary/30 p-1 rounded-lg">
                  {['1min', '2min', '5min', '10min', '15min'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedTimePeriod(period as any)}
                      className={cn(
                        "rounded-md py-2 text-xs font-medium",
                        selectedTimePeriod === period 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'hover:bg-muted/50 text-muted-foreground'
                      )}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Available balance */}
              <div className="bg-secondary/30 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Wallet size={16} className="text-primary" />
                    <p className="text-sm">Available Balance</p>
                  </div>
                  <p className="text-base font-semibold">₹{mockBalances.availableBalance.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Amount input */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Trade Amount</h3>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">₹</span>
                  <Input 
                    value={selectedAmount} 
                    onChange={(e) => setSelectedAmount(e.target.value)}
                    className="text-center text-2xl py-5 bg-secondary/30 border-border/50 font-bold pl-10"
                  />
                </div>
                
                {/* Quick amount buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {predefinedAmounts.map(amount => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount.toString())}
                      className="bg-secondary/30 rounded-md py-2 hover:bg-muted/50 transition-colors text-sm"
                    >
                      ₹{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Trade Summary */}
              <div className="bg-card/80 border border-border/50 p-4 rounded-lg">
                <h3 className="text-base font-medium mb-3">Trade Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Direction</span>
                    <span className={tradeDirection === 'CALL' ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                      {tradeDirection}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Price</span>
                    <span className="font-medium">₹{currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">₹{Number(selectedAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Period</span>
                    <span className="font-medium">{selectedTimePeriod}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-border/50 mt-2">
                    <span className="text-muted-foreground">Potential Profit</span>
                    <span className="text-green-400 font-medium">₹{calculateProfit().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Confirm Button */}
              <Button 
                onClick={handleConfirmTrade}
                className={cn(
                  "w-full py-6 text-base font-bold",
                  tradeDirection === 'CALL' 
                    ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600" 
                    : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                )}
              >
                CONFIRM {tradeDirection}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default CoinDetailPage;
