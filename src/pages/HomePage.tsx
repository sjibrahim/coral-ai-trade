
import MobileLayout from "@/components/layout/MobileLayout";
import BalanceSummary from "@/components/BalanceSummary";
import ActionButtons from "@/components/ActionButtons";
import CryptoCard from "@/components/CryptoCard";
import { Link } from "react-router-dom";
import { mockCryptoCurrencies, mockBalances } from "@/data/mockData";
import { ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const HomePage = () => {
  // Only show first 4 cryptocurrencies on home page
  const displayedCryptos = mockCryptoCurrencies.slice(0, 4);
  
  return (
    <MobileLayout>
      <div className="animate-fade-in space-y-4">
        {/* Balance Section */}
        <section className="bg-gradient-to-b from-accent/40 to-accent/10 backdrop-blur-sm rounded-b-3xl shadow-lg">
          <BalanceSummary 
            totalBalance={mockBalances.totalBalance}
            totalDeposit={mockBalances.totalDeposit}
            totalWithdrawal={mockBalances.totalWithdrawal}
            availableBalance={mockBalances.availableBalance}
          />
          <ActionButtons />
        </section>
        
        {/* Market Section */}
        <section className="px-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 text-primary mr-1.5" />
              <h2 className="text-base font-semibold text-gradient">
                Top Markets
              </h2>
            </div>
            <Link to="/market" className="flex items-center text-primary text-xs font-medium">
              View All
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
          
          <div className="card-glass rounded-xl overflow-hidden">
            {displayedCryptos.map((crypto, idx) => (
              <CryptoCard
                key={crypto.id}
                id={crypto.id}
                name={crypto.name}
                symbol={crypto.symbol}
                price={crypto.price}
                change={crypto.change}
                logo={crypto.logo}
                animationDelay={idx * 75}
              />
            ))}
          </div>
          
          {/* Today's Picks Section */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-amber-400 mr-1.5" />
                <h2 className="text-base font-semibold bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
                  Today's Picks
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {mockCryptoCurrencies.slice(0, 2).map((crypto, idx) => (
                <Link 
                  key={`pick-${crypto.id}`} 
                  to={`/coin/${crypto.id}`}
                  className="card-glass p-3 rounded-xl border border-border/40 hover:border-primary/40 transition-colors"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-secondary/50 flex items-center justify-center">
                      <img src={crypto.logo} alt={crypto.name} className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{crypto.symbol}</span>
                  </div>
                  <div className="text-base font-semibold">${crypto.price.toLocaleString()}</div>
                  <div className={cn(
                    "text-xs mt-1",
                    crypto.change >= 0 ? "text-market-increase" : "text-market-decrease"
                  )}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                  </div>
                  <div className="mt-1 text-[10px] text-muted-foreground">Trending today</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
