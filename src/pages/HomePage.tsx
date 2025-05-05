
import MobileLayout from "@/components/layout/MobileLayout";
import BalanceSummary from "@/components/BalanceSummary";
import ActionButtons from "@/components/ActionButtons";
import CryptoCard from "@/components/CryptoCard";
import { Link } from "react-router-dom";
import { mockCryptoCurrencies, mockBalances } from "@/data/mockData";

const HomePage = () => {
  // Only show first 4 cryptocurrencies on home page
  const displayedCryptos = mockCryptoCurrencies.slice(0, 4);
  
  return (
    <MobileLayout>
      <div className="animate-fade-in">
        {/* Balance Section */}
        <section className="bg-accent/30 rounded-b-3xl shadow-lg">
          <BalanceSummary 
            totalBalance={mockBalances.totalBalance}
            totalDeposit={mockBalances.totalDeposit}
            totalWithdrawal={mockBalances.totalWithdrawal}
            availableBalance={mockBalances.availableBalance}
          />
          <ActionButtons />
        </section>
        
        {/* Market Section */}
        <section className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Market</h2>
            <Link to="/market" className="text-primary text-sm">See More</Link>
          </div>
          
          <div className="bg-card rounded-xl overflow-hidden">
            {displayedCryptos.map((crypto) => (
              <CryptoCard
                key={crypto.id}
                id={crypto.id}
                name={crypto.name}
                symbol={crypto.symbol}
                price={crypto.price}
                change={crypto.change}
                logo={crypto.logo}
              />
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
