
import { useParams } from "react-router-dom";
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { mockCryptoCurrencies, mockPriceChartData, mockBalances } from "@/data/mockData";
import PriceChart from "@/components/PriceChart";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import NumericKeypad from "@/components/NumericKeypad";

const CoinDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tradeDirection, setTradeDirection] = useState<'CALL' | 'PUT'>('CALL');
  const [selectedAmount, setSelectedAmount] = useState(mockBalances.availableBalance.toString());
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<'1min' | '2min' | '5min' | '10min' | '15min'>('1min');
  
  // Find the cryptocurrency by ID
  const coin = mockCryptoCurrencies.find(crypto => crypto.id === id);
  
  if (!coin) {
    return (
      <MobileLayout showBackButton title="Coin Detail">
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <p className="text-xl text-muted-foreground">Cryptocurrency not found</p>
        </div>
      </MobileLayout>
    );
  }
  
  const isPositiveChange = coin.change >= 0;
  
  const handleOpenTrade = (direction: 'CALL' | 'PUT') => {
    setTradeDirection(direction);
    setIsDialogOpen(true);
  };
  
  const handleConfirmTrade = () => {
    // In a real app, this would submit the trade to an API
    console.log(`Confirming ${tradeDirection} trade for ${selectedAmount} on ${coin.symbol} with ${selectedTimePeriod} timeframe`);
    setIsDialogOpen(false);
  };

  const predefinedAmounts = [600, 1000, 2000, 3000, 5000, 10000];
  
  const currentPrice = Math.floor(coin.price * 83.25); // Converting to INR for demo
  
  return (
    <MobileLayout showBackButton title={`${coin.name} (${coin.symbol})`}>
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Current Price */}
        <div className="bg-card rounded-xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <img src={coin.logo} alt={coin.name} className="w-10 h-10" />
            <h1 className="text-2xl font-bold">${coin.price.toLocaleString()}</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${isPositiveChange ? 'bg-market-increase/20 text-market-increase' : 'bg-market-decrease/20 text-market-decrease'}`}>
              {isPositiveChange ? '+' : ''}{coin.change}%
            </span>
          </div>
          
          {/* Price in local currency (mocked) */}
          <p className="text-lg text-muted-foreground">
            (₹ {(coin.price * 83.25).toFixed(2)})
          </p>
        </div>
        
        {/* Chart */}
        <div className="bg-card rounded-xl p-4">
          <PriceChart data={mockPriceChartData} isPositive={isPositiveChange} />
        </div>
        
        {/* Trade Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button 
            className="bg-primary rounded-xl py-4 text-white font-semibold text-lg"
            onClick={() => handleOpenTrade('CALL')}
          >
            BUY CALL
          </button>
          <button 
            className="bg-transparent border border-muted rounded-xl py-4 font-semibold text-lg"
            onClick={() => handleOpenTrade('PUT')}
          >
            BUY PUT
          </button>
        </div>
        
        {/* Coin Information */}
        <div className="bg-card rounded-xl p-5 space-y-4">
          <h2 className="text-xl font-semibold">About {coin.name}</h2>
          <p className="text-muted-foreground">
            {coin.name} ({coin.symbol}) is a digital currency that can be sent from user to user on the peer-to-peer network without the need for intermediaries.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground mb-1">Market Cap</p>
              <p className="font-medium">${(coin.price * 19000000).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Volume (24h)</p>
              <p className="font-medium">${(coin.price * 500000).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Circulating Supply</p>
              <p className="font-medium">19,000,000</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Max Supply</p>
              <p className="font-medium">21,000,000</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trade Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-background border-none p-0 max-w-md rounded-xl sm:max-w-md">
          <div className="p-6 space-y-6">
            {/* Header with close button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{coin.symbol}/INR</h2>
              <button 
                onClick={() => setIsDialogOpen(false)} 
                className="rounded-full p-2 hover:bg-muted"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Time period selection */}
            <div className="space-y-2">
              <label className="text-lg font-medium">Select Time Period</label>
              <div className="flex items-center justify-between rounded-full bg-muted/30 p-1.5">
                {['1min', '2min', '5min', '10min', '15min'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimePeriod(period as any)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      selectedTimePeriod === period 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Available balance */}
            <div>
              <p className="text-lg">Available : ₹{mockBalances.availableBalance}</p>
            </div>
            
            {/* Amount input */}
            <div className="space-y-2">
              <Input 
                value={selectedAmount} 
                onChange={(e) => setSelectedAmount(e.target.value)}
                className="text-center text-xl p-6 bg-card border border-border"
              />
              
              {/* Quick amount buttons */}
              <div className="grid grid-cols-3 gap-2">
                {predefinedAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount.toString())}
                    className="bg-muted/30 rounded-full py-2 hover:bg-muted"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Trade Summary */}
            <div className="bg-card border border-border p-4 rounded-lg">
              <div className="grid grid-cols-3 text-lg">
                <div>Direction</div>
                <div>Price</div>
                <div>Amount</div>
                <div className={tradeDirection === 'CALL' ? 'text-market-increase' : 'text-market-decrease'}>
                  {tradeDirection === 'CALL' ? 'Call' : 'Put'}
                </div>
                <div className="text-market-increase">
                  {currentPrice.toLocaleString()}.165
                </div>
                <div>₹{selectedAmount}</div>
              </div>
            </div>
            
            {/* Confirm Button */}
            <Button 
              onClick={handleConfirmTrade}
              className="w-full py-6 text-lg font-bold"
            >
              CONFIRM
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default CoinDetailPage;
