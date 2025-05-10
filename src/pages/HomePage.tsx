
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import BalanceSummary from "@/components/BalanceSummary";
import ActionButtons from "@/components/ActionButtons";
import CryptoCard from "@/components/CryptoCard";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMarketData } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface CryptoData {
  id: string | number;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  market_cap?: string;
  volume_24h?: string;
  rank?: string;
  status?: string;
  picks?: number;
  home?: number;
  change?: number;
}

const HomePage = () => {
  const [marketData, setMarketData] = useState<CryptoData[]>([]);
  const [picksData, setPicksData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Make sure we have a token before fetching
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        
        const response = await getMarketData(token);
        
        if (response.status && Array.isArray(response.data)) {
          // Add a dummy change value since we don't have it in the API
          const dataWithChange = response.data.map((crypto: CryptoData) => ({
            ...crypto,
            change: Math.random() > 0.5 ? +(Math.random() * 5).toFixed(2) : -(Math.random() * 5).toFixed(2), // Random change value
            price: parseFloat(typeof crypto.price === 'string' ? crypto.price : crypto.price.toString())
          }));
          
          // Filter home screen cryptos where home=1
          const homeScreenCryptos = dataWithChange.filter((crypto: CryptoData) => crypto.home === 1 && crypto.status === "1");
          
          // Filter today's picks where picks=1
          const todaysPicks = dataWithChange.filter((crypto: CryptoData) => 
            crypto.picks === 1 && crypto.status === "1"
          );
          
          setMarketData(homeScreenCryptos.length > 0 ? homeScreenCryptos.slice(0, 4) : []);
          setPicksData(todaysPicks.length > 0 ? todaysPicks.slice(0, 2) : []);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);
  
  return (
    <MobileLayout>
      <div className="animate-fade-in space-y-4 pb-20">
        {/* Balance Section */}
        <section className="bg-gradient-to-br from-primary/30 via-accent/40 to-blue-900/30 backdrop-blur-sm rounded-b-3xl shadow-lg relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Animated circles */}
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-blue-500/10 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-16 left-8 w-16 h-16 rounded-full bg-purple-500/10 animate-float" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative">
            <BalanceSummary 
              totalBalance={user?.wallet ? parseFloat(user.wallet) : 0}
              totalDeposit={0} // We don't have this from the API
              totalWithdrawal={0} // We don't have this from the API
              availableBalance={user?.wallet ? parseFloat(user.wallet) : 0}
            />
            <ActionButtons />
          </div>
          
          {/* Decoration Elements */}
          <div className="h-4 w-full bg-gradient-to-r from-blue-500/20 via-primary/20 to-purple-500/20"></div>
        </section>
        
        {/* Market Section */}
        <section className="px-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 text-primary mr-1.5 animate-pulse-glow" />
              <h2 className="text-base font-semibold text-gradient">
                Top Markets
              </h2>
            </div>
            <Link to="/market" className="flex items-center text-primary text-xs font-medium group">
              View All
              <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="card-glass rounded-xl overflow-hidden">
            {isLoading ? (
              Array(4).fill(0).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="p-3.5 border-b border-border/30 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary/40"></div>
                      <div>
                        <div className="h-4 w-24 bg-secondary/40 rounded"></div>
                        <div className="h-3 w-12 bg-secondary/40 rounded mt-1.5"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-16 bg-secondary/40 rounded"></div>
                      <div className="h-3 w-10 bg-secondary/40 rounded mt-1.5 ml-auto"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : marketData.length > 0 ? (
              marketData.map((crypto, idx) => (
                <CryptoCard
                  key={crypto.id}
                  id={crypto.id}
                  name={crypto.name}
                  symbol={crypto.symbol}
                  price={crypto.price}
                  change={crypto.change || 0}
                  logo={crypto.logo}
                  animationDelay={idx * 75}
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No market data available
              </div>
            )}
          </div>
          
          {/* Today's Picks Section */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-amber-400 mr-1.5 animate-pulse-glow" />
                <h2 className="text-base font-semibold bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
                  Today's Picks
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {isLoading ? (
                Array(2).fill(0).map((_, idx) => (
                  <div key={`pick-skeleton-${idx}`} className="card-glass p-3 rounded-xl border border-border/40 animate-pulse">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-secondary/50"></div>
                      <div className="h-4 w-12 bg-secondary/40 rounded"></div>
                    </div>
                    <div className="h-5 w-20 bg-secondary/40 rounded"></div>
                    <div className="h-3 w-10 bg-secondary/40 rounded mt-2"></div>
                    <div className="h-2 w-16 bg-secondary/40 rounded mt-2"></div>
                  </div>
                ))
              ) : picksData.length > 0 ? (
                picksData.map((crypto, idx) => (
                  <Link 
                    key={`pick-${crypto.id}`} 
                    to={`/coin/${crypto.id}`}
                    className="card-glass p-3 rounded-xl border border-border/40 hover:border-primary/40 transition-colors hover:bg-blue-500/5 hover:-translate-y-1 transition-all duration-300"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-secondary/50 flex items-center justify-center crypto-icon">
                        <img 
                          src={crypto.logo} 
                          alt={crypto.name} 
                          className="w-5 h-5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{crypto.symbol.toUpperCase()}</span>
                    </div>
                    <div className="text-base font-semibold">${crypto.price.toLocaleString()}</div>
                    <div className={cn(
                      "text-xs mt-1",
                      (crypto.change || 0) >= 0 ? "text-market-increase" : "text-market-decrease"
                    )}>
                      {(crypto.change || 0) >= 0 ? '+' : ''}{crypto.change}%
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">Trending today</div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 p-4 text-center text-muted-foreground">
                  No picks available
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
