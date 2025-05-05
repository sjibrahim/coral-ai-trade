
import MobileLayout from "@/components/layout/MobileLayout";
import CryptoCard from "@/components/CryptoCard";
import { mockCryptoCurrencies } from "@/data/mockData";

const MarketPage = () => {
  return (
    <MobileLayout title="Market">
      <div className="p-4 space-y-4 animate-fade-in">
        <div className="bg-card rounded-xl overflow-hidden">
          {mockCryptoCurrencies.map((crypto) => (
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
      </div>
    </MobileLayout>
  );
};

export default MarketPage;
