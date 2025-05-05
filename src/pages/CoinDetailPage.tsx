
import { useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { mockCryptoCurrencies, mockPriceChartData } from "@/data/mockData";
import PriceChart from "@/components/PriceChart";

const CoinDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
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
          <button className="bg-primary rounded-xl py-4 text-white font-semibold text-lg">
            BUY CALL
          </button>
          <button className="bg-transparent border border-muted rounded-xl py-4 font-semibold text-lg">
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
    </MobileLayout>
  );
};

export default CoinDetailPage;
