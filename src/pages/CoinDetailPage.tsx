
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import PriceChart from '@/components/PriceChart';
import { mockCryptoData } from '@/data/mockData';
import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

const CoinDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<any>(null);
  
  useEffect(() => {
    // Find coin by id or symbol
    const coinData = mockCryptoData.find((item) => 
      item.id === id || 
      item.symbol.toLowerCase() === id?.toLowerCase()
    );
    
    if (coinData) {
      setCoin(coinData);
    } else {
      // Coin not found
      navigate('/market', { replace: true });
    }
  }, [id, navigate]);
  
  if (!coin) {
    return (
      <MobileLayout showBackButton title="Loading...">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </MobileLayout>
    );
  }
  
  // Determine if price is up or down
  const isPriceUp = coin.priceChangePercent > 0;
  
  // Generate some dummy chart data
  const generateChartData = () => {
    const now = Date.now();
    const data = [];
    const volatility = 0.05; // 5% volatility
    
    for (let i = 0; i < 24; i++) {
      // Start with the current price and add random volatility
      const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
      const timestamp = now - (24 - i) * 3600 * 1000 / 24;
      const price = coin.price * randomFactor;
      
      data.push({
        timestamp: timestamp,
        price: price
      });
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  
  return (
    <MobileLayout showBackButton title={`${coin.name} (${coin.symbol})`}>
      <div className="px-4 py-2">
        {/* Price Summary */}
        <div className="flex items-center space-x-3 mb-6">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-12 h-12 rounded-full bg-background p-1"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <h2 className="text-xl font-medium">{coin.symbol.toUpperCase()}/{coin.pairWith}</h2>
              <span 
                className={`ml-2 text-sm font-medium px-2 py-0.5 rounded-full ${
                  isPriceUp ? 'bg-market-increase/10 text-market-increase' : 'bg-market-decrease/10 text-market-decrease'
                }`}
              >
                {isPriceUp ? '+' : ''}{coin.priceChangePercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-2xl font-semibold">₹{coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="bg-card/50 rounded-xl p-4 mb-4">
          <PriceChart data={chartData} showControls height={220} />
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            className="bg-market-increase hover:bg-market-increase/90 text-white"
          >
            <ArrowUp className="mr-1 h-4 w-4" /> Buy
          </Button>
          <Button 
            variant="destructive"
            className="bg-market-decrease hover:bg-market-decrease/90"
          >
            <ArrowDown className="mr-1 h-4 w-4" /> Sell
          </Button>
        </div>
        
        {/* Market Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Market Information</h3>
          
          <div className="bg-card/50 rounded-xl divide-y divide-border/50">
            <InfoRow label="24h Volume" value={`₹${coin.volume24h.toLocaleString()}`} />
            <InfoRow label="24h High" value={`₹${(coin.price * 1.05).toFixed(2)}`} />
            <InfoRow label="24h Low" value={`₹${(coin.price * 0.95).toFixed(2)}`} />
            <InfoRow label="Market Cap" value={`₹${(coin.price * coin.circulatingSupply).toLocaleString()}`} />
            <InfoRow label="Circulating Supply" value={`${coin.circulatingSupply.toLocaleString()} ${coin.symbol.toUpperCase()}`} />
          </div>
          
          {/* Transaction History */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Recent Transactions</h3>
              <button className="text-primary text-sm flex items-center">
                See all <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            
            <div className="bg-card/50 rounded-xl overflow-hidden">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 border-b border-border/50 last:border-0">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      item % 2 === 0 ? 'bg-market-increase/10 text-market-increase' : 'bg-market-decrease/10 text-market-decrease'
                    }`}>
                      {item % 2 === 0 ? 
                        <ArrowUp className="h-4 w-4" /> : 
                        <ArrowDown className="h-4 w-4" />
                      }
                    </div>
                    <div>
                      <div className="font-medium">
                        {item % 2 === 0 ? 'Buy' : 'Sell'} {coin.symbol.toUpperCase()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(Date.now() - item * 3600000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item % 2 === 0 ? '+' : '-'}{(Math.random() * 0.5).toFixed(4)} {coin.symbol.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ₹{(coin.price * Math.random() * 0.5).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

// Helper component for info rows
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-3 px-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default CoinDetailPage;
