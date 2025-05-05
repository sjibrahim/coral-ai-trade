
import MobileLayout from "@/components/layout/MobileLayout";
import BalanceSummary from "@/components/BalanceSummary";
import ActionButtons from "@/components/ActionButtons";
import CryptoCard from "@/components/CryptoCard";
import { Link } from "react-router-dom";
import { mockCryptoCurrencies, mockBalances } from "@/data/mockData";
import { ChevronRight, Sparkles } from "lucide-react";

const HomePage = () => {
  // Only show first 4 cryptocurrencies on home page
  const displayedCryptos = mockCryptoCurrencies.slice(0, 4);
  
  return (
    <MobileLayout>
      <div className="animate-fade-in space-y-6">
        {/* Balance Section */}
        <section className="bg-gradient-to-b from-accent/40 to-accent/20 backdrop-blur-sm rounded-b-3xl shadow-lg pb-4">
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
              <Sparkles className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Top Markets
              </h2>
            </div>
            <Link to="/market" className="flex items-center text-primary text-sm font-medium">
              See More
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
          
          <div className="glass-card rounded-xl overflow-hidden">
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
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0116 2h3a1 1 0 110 2h-1.586l-.707.707a1 1 0 01-1.414 0L14.586 4H13a1 1 0 110-2h1zm-7.707 6.707a1 1 0 010-1.414L12.586 2H11a1 1 0 110-2h3a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0117 0h3a1 1 0 110 2h-1.586l-.707.707a1 1 0 01-1.414 0L16.586 2H15a1 1 0 110-2h1z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
                  Today's Picks
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {mockCryptoCurrencies.slice(0, 2).map((crypto, idx) => (
                <Link 
                  key={`pick-${crypto.id}`} 
                  to={`/coin/${crypto.id}`}
                  className="glass-card p-4 rounded-xl border border-border/40 hover:border-primary/40 transition-colors"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                      <img src={crypto.logo} alt={crypto.name} className="w-6 h-6" />
                    </div>
                    <span className="font-medium">{crypto.symbol}</span>
                  </div>
                  <div className="text-lg font-semibold">${crypto.price.toLocaleString()}</div>
                  <div className={cn(
                    "text-sm mt-1",
                    crypto.change >= 0 ? "text-market-increase" : "text-market-decrease"
                  )}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">Trending today</div>
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
