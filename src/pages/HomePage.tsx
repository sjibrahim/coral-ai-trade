import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import BalanceSummary from "@/components/BalanceSummary";
import ActionButtons from "@/components/ActionButtons";
import CryptoCard from "@/components/CryptoCard";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  Zap,
  BarChart3,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMarketData } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeInfoModal } from "@/components/WelcomeInfoModal";

interface CryptoData {
  id: string | number;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  market_cap?: string;
  volume_24h?: string;
  rank?: string;
  status?: string | number;
  picks?: number | string;
  home?: number | string;
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
          
          // Filter for active cryptocurrencies - convert both sides to the same type for comparison
          const activeCoins = dataWithChange.filter((crypto: CryptoData) => {
            const statusValue = crypto.status?.toString();
            return statusValue === "1";
          });
          
          // Filter home screen cryptos - convert both sides to the same type for comparison
          const homeScreenCryptos = activeCoins.filter((crypto: CryptoData) => {
            const homeValue = crypto.home?.toString();
            return homeValue === "1";
          });
          
          // Filter today's picks - convert both sides to the same type for comparison
          const todaysPicks = activeCoins.filter((crypto: CryptoData) => {
            const picksValue = crypto.picks?.toString();
            return picksValue === "1";
          });
          
          // Sort by rank
          const sortedHomeData = homeScreenCryptos.sort((a: CryptoData, b: CryptoData) => {
            const rankA = parseInt(a.rank?.toString() || "9999");
            const rankB = parseInt(b.rank?.toString() || "9999");
            return rankA - rankB;
          });
          
          const sortedPicksData = todaysPicks.sort((a: CryptoData, b: CryptoData) => {
            const rankA = parseInt(a.rank?.toString() || "9999");
            const rankB = parseInt(b.rank?.toString() || "9999");
            return rankA - rankB;
          });
          
          // Use filtered data or fallback to first 6 items if filtered is empty
          // Removed the slice(0, 4) to show all home coins
          setMarketData(sortedHomeData.length > 0 ? sortedHomeData : activeCoins.slice(0, 6));
          setPicksData(sortedPicksData.length > 0 ? sortedPicksData.slice(0, 2) : activeCoins.slice(0, 2));
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);
  
  // Get the deposit amount
  const depositAmount = user?.deposit ? parseFloat(user.deposit) : 0;
  // Get the wallet amount
  const walletAmount = user?.wallet ? parseFloat(user.wallet) : 0;
  // Get the income
  const incomeAmount = user?.income ? parseFloat(user.income) : 0;

  // Mock trending data for new features
  const trendingCoins = [
    { name: "Bitcoin", symbol: "BTC", change: +12.5, price: 68420 },
    { name: "Ethereum", symbol: "ETH", change: +8.3, price: 3850 },
    { name: "Cardano", symbol: "ADA", change: -2.4, price: 0.48 }
  ];

  const recentActivities = [
    { type: "buy", coin: "BTC", amount: 1250, time: "2 min ago" },
    { type: "sell", coin: "ETH", amount: 850, time: "15 min ago" },
    { type: "buy", coin: "ADA", amount: 500, time: "1h ago" }
  ];
  
  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
        {/* Welcome Modal */}
        <WelcomeInfoModal />
        
        {/* Enhanced Header Section */}
        <section className="bg-gradient-to-br from-trexo-green/10 via-white/80 to-green-100/50 backdrop-blur-sm border-b border-green-100/50 relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-trexo-green/20 blur-3xl"></div>
            <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-green-300/30 blur-2xl"></div>
          </div>
          
          <div className="relative px-4 pt-6 pb-4">
            {/* Greeting Section */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-trexo-dark mb-1">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
              </h1>
              <p className="text-trexo-gray text-sm">Ready to trade today?</p>
            </div>

            {/* Balance Summary */}
            <BalanceSummary 
              totalBalance={walletAmount}
              totalDeposit={depositAmount}
              totalWithdrawal={0}
              availableBalance={incomeAmount}
              showSmallDeposit={true}
            />
            
            {/* Action Buttons */}
            <ActionButtons />
          </div>
        </section>

        {/* Market Overview Cards */}
        <section className="px-4 py-6 space-y-6">
          {/* Market Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50/80 backdrop-blur-sm border border-green-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-trexo-dark">Market Cap</span>
                </div>
              </div>
              <div className="text-lg font-bold text-trexo-dark">$2.1T</div>
              <div className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +2.4% (24h)
              </div>
            </div>

            <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-trexo-dark">24h Volume</span>
                </div>
              </div>
              <div className="text-lg font-bold text-trexo-dark">$89.2B</div>
              <div className="text-xs text-blue-600 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </div>
            </div>
          </div>

          {/* Quick Trending */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-amber-500 mr-2" />
                <h2 className="text-base font-semibold text-trexo-dark">Trending Now</h2>
              </div>
              <Link to="/market" className="text-xs text-trexo-green font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {trendingCoins.map((coin, idx) => (
                <div key={coin.symbol} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-trexo-dark">
                        {coin.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-trexo-dark">{coin.name}</div>
                      <div className="text-xs text-trexo-gray">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-trexo-dark">
                      ${coin.price.toLocaleString()}
                    </div>
                    <div className={cn(
                      "text-xs flex items-center",
                      coin.change >= 0 ? "text-green-600" : "text-red-500"
                    )}>
                      {coin.change >= 0 ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {coin.change >= 0 ? '+' : ''}{coin.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-100/50 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <PieChart className="w-4 h-4 text-purple-600 mr-2" />
                <h2 className="text-base font-semibold text-trexo-dark">Portfolio Summary</h2>
              </div>
              <Link to="/portfolio" className="text-xs text-purple-600 font-medium">
                Details
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-trexo-dark">₹{(walletAmount * 0.6).toFixed(0)}</div>
                <div className="text-xs text-trexo-gray">Invested</div>
                <div className="text-xs text-green-600">+12.5%</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-trexo-dark">₹{(walletAmount * 0.3).toFixed(0)}</div>
                <div className="text-xs text-trexo-gray">Available</div>
                <div className="text-xs text-blue-600">Ready</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-trexo-dark">₹{(walletAmount * 0.1).toFixed(0)}</div>
                <div className="text-xs text-trexo-gray">Profit</div>
                <div className="text-xs text-green-600">+8.2%</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-600 mr-2" />
                <h2 className="text-base font-semibold text-trexo-dark">Recent Activity</h2>
              </div>
              <Link to="/transactions" className="text-xs text-trexo-green font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                      activity.type === 'buy' ? "bg-green-100" : "bg-red-100"
                    )}>
                      {activity.type === 'buy' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-trexo-dark">
                        {activity.type === 'buy' ? 'Bought' : 'Sold'} {activity.coin}
                      </div>
                      <div className="text-xs text-trexo-gray">{activity.time}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-trexo-dark">
                    ₹{activity.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Markets Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex items-center">
                <Target className="w-4 h-4 text-trexo-green mr-2" />
                <h2 className="text-base font-semibold text-trexo-dark">Top Markets</h2>
              </div>
              <Link to="/market" className="flex items-center text-trexo-green text-xs font-medium">
                View All
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
            
            <div className="divide-y divide-gray-50">
              {isLoading ? (
                Array(4).fill(0).map((_, idx) => (
                  <div key={`skeleton-${idx}`} className="p-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : marketData.length > 0 ? (
                marketData.slice(0, 5).map((crypto, idx) => (
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
                <div className="p-6 text-center text-trexo-gray">
                  No market data available
                </div>
              )}
            </div>
          </div>

          {/* Today's Picks - Enhanced */}
          {picksData.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 text-amber-600 mr-2" />
                  <h2 className="text-base font-semibold text-trexo-dark">Today's Picks</h2>
                </div>
                <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                  Hot
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {picksData.map((crypto, idx) => (
                  <Link 
                    key={`pick-${crypto.id}`} 
                    to={`/coin/${crypto.id}`}
                    className="bg-white/70 backdrop-blur-sm border border-white/50 p-3 rounded-xl hover:bg-white/90 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
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
                      <span className="text-sm font-semibold text-trexo-dark">
                        {crypto.symbol.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-base font-bold text-trexo-dark mb-1">
                      ₹{crypto.price.toLocaleString()}
                    </div>
                    <div className={cn(
                      "text-xs mb-2 flex items-center",
                      (crypto.change || 0) >= 0 ? "text-green-600" : "text-red-500"
                    )}>
                      {(crypto.change || 0) >= 0 ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {(crypto.change || 0) >= 0 ? '+' : ''}{crypto.change}%
                    </div>
                    <div className="text-[10px] text-amber-600 bg-amber-100/50 px-2 py-1 rounded-full inline-block">
                      Trending
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
