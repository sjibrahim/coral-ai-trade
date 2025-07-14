
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  BarChart3,
  Wallet,
  CreditCard,
  Send,
  Download,
  Star,
  Bell,
  Gift,
  Users,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMarketData } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeInfoModal } from "@/components/WelcomeInfoModal";
import { Button } from "@/components/ui/button";

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
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        
        const response = await getMarketData(token);
        
        if (response.status && Array.isArray(response.data)) {
          const dataWithChange = response.data.map((crypto: CryptoData) => ({
            ...crypto,
            change: Math.random() > 0.5 ? +(Math.random() * 5).toFixed(2) : -(Math.random() * 5).toFixed(2),
            price: parseFloat(typeof crypto.price === 'string' ? crypto.price : crypto.price.toString())
          }));
          
          const activeCoins = dataWithChange.filter((crypto: CryptoData) => {
            const statusValue = crypto.status?.toString();
            return statusValue === "1";
          });
          
          const homeScreenCryptos = activeCoins.filter((crypto: CryptoData) => {
            const homeValue = crypto.home?.toString();
            return homeValue === "1";
          });
          
          const sortedHomeData = homeScreenCryptos.sort((a: CryptoData, b: CryptoData) => {
            const rankA = parseInt(a.rank?.toString() || "9999");
            const rankB = parseInt(b.rank?.toString() || "9999");
            return rankA - rankB;
          });
          
          setMarketData(sortedHomeData.length > 0 ? sortedHomeData.slice(0, 4) : activeCoins.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);
  
  const depositAmount = user?.deposit ? parseFloat(user.deposit) : 0;
  const walletAmount = user?.wallet ? parseFloat(user.wallet) : 0;
  const incomeAmount = user?.income ? parseFloat(user.income) : 0;
  const totalBalance = walletAmount + incomeAmount;

  const quickActions = [
    { icon: CreditCard, label: "Deposit", color: "bg-green-500", link: "/deposit" },
    { icon: Send, label: "Withdraw", color: "bg-blue-500", link: "/withdraw" },
    { icon: BarChart3, label: "Trade", color: "bg-purple-500", link: "/market" },
    { icon: Users, label: "Invite", color: "bg-orange-500", link: "/invite" }
  ];

  const portfolioItems = [
    { name: "Bitcoin", symbol: "BTC", amount: 0.0234, value: 1850, change: +5.2 },
    { name: "Ethereum", symbol: "ETH", amount: 0.456, value: 1200, change: -2.1 },
    { name: "Cardano", symbol: "ADA", amount: 234, value: 890, change: +8.7 }
  ];
  
  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Welcome Modal */}
        <WelcomeInfoModal />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-300/5 to-emerald-300/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          
          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-green-400/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-32 right-16 w-3 h-3 bg-emerald-400/30 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-40 left-20 w-5 h-5 bg-green-300/20 rounded-full animate-bounce delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-6 space-y-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Ready to trade today?
            </p>
          </div>

          {/* Balance Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {showBalance ? <Eye className="w-5 h-5 text-gray-600" /> : <EyeOff className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {showBalance ? `₹${totalBalance.toLocaleString()}` : "••••••"}
              </div>
              <div className="flex items-center justify-center text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+12.5% this month</span>
              </div>
            </div>

            {/* Balance Breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                <div className="flex items-center mb-2">
                  <Wallet className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Wallet</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {showBalance ? `₹${walletAmount.toLocaleString()}` : "••••"}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Profit</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {showBalance ? `₹${incomeAmount.toLocaleString()}` : "••••"}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action, idx) => (
                <Link 
                  key={idx}
                  to={action.link}
                  className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", action.color)}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Market Overview */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Market Overview</h2>
              <Link to="/market" className="text-green-600 text-sm font-medium hover:text-green-700">
                View All
              </Link>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, idx) => (
                  <div key={idx} className="animate-pulse flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {marketData.slice(0, 4).map((crypto, idx) => (
                  <Link
                    key={crypto.id}
                    to={`/coin/${crypto.id}`}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <img 
                          src={crypto.logo} 
                          alt={crypto.name} 
                          className="w-6 h-6"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{crypto.name}</div>
                        <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        ₹{crypto.price.toLocaleString()}
                      </div>
                      <div className={cn(
                        "text-sm flex items-center justify-end",
                        (crypto.change || 0) >= 0 ? "text-green-600" : "text-red-500"
                      )}>
                        {(crypto.change || 0) >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {(crypto.change || 0) >= 0 ? '+' : ''}{crypto.change || 0}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio Section */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">My Portfolio</h2>
              <Link to="/portfolio" className="text-green-600 text-sm font-medium hover:text-green-700">
                Manage
              </Link>
            </div>
            
            <div className="space-y-3">
              {portfolioItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">
                        {item.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.amount} {item.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">₹{item.value.toLocaleString()}</div>
                    <div className={cn(
                      "text-xs",
                      item.change >= 0 ? "text-green-600" : "text-red-500"
                    )}>
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trading Tips */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 shadow-lg border border-amber-100">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Today's Tip</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Diversify your portfolio across different cryptocurrencies to manage risk effectively. Never invest more than you can afford to lose.
            </p>
            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl">
              Learn More About Trading
            </Button>
          </div>

          {/* Bottom spacing for navigation */}
          <div className="h-20"></div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
