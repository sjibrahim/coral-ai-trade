
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
  CreditCard,
  Send,
  BarChart3,
  Users,
  Bell,
  Star,
  Activity,
  DollarSign,
  Percent,
  Clock,
  Award,
  Shield,
  Zap,
  Target,
  Globe,
  Lock,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMarketData } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeInfoModal } from "@/components/WelcomeInfoModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          
          setMarketData(sortedHomeData.length > 0 ? sortedHomeData.slice(0, 6) : activeCoins.slice(0, 6));
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
    { icon: Users, label: "Refer", color: "bg-orange-500", link: "/invite" }
  ];

  const stats = [
    { label: "24h Volume", value: "₹2.4B", change: "+12.5%", positive: true },
    { label: "Active Traders", value: "125K+", change: "+8.2%", positive: true },
    { label: "Markets", value: "150+", change: "New", positive: true },
    { label: "Security", value: "100%", change: "Secured", positive: true }
  ];

  const features = [
    { icon: Shield, title: "Bank-grade Security", desc: "Advanced encryption" },
    { icon: Activity, title: "Real-time Trading", desc: "Lightning fast execution" },
    { icon: Globe, title: "Global Markets", desc: "150+ cryptocurrencies" },
    { icon: Award, title: "Trusted Platform", desc: "Used by millions" }
  ];
  
  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <WelcomeInfoModal />
        
        <div className="px-4 py-6 space-y-6">
          {/* Professional Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
              <p className="text-gray-600 text-sm">Professional Trading Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Balance Overview */}
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Portfolio Value</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-bold">
                      {showBalance ? `₹${totalBalance.toLocaleString()}` : "••••••"}
                    </span>
                    <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1 rounded-full hover:bg-white/10"
                    >
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-100">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+12.5%</span>
                  </div>
                  <p className="text-xs text-green-200">Last 24h</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Available</span>
                  </div>
                  <p className="font-semibold">
                    {showBalance ? `₹${walletAmount.toLocaleString()}` : "••••"}
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">P&L</span>
                  </div>
                  <p className="font-semibold">
                    {showBalance ? `₹${incomeAmount.toLocaleString()}` : "••••"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {quickActions.map((action, idx) => (
                  <Link 
                    key={idx}
                    to={action.link}
                    className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                  >
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-2", action.color)}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    <div className={cn(
                      "text-xs font-medium flex items-center gap-1",
                      stat.positive ? "text-green-600" : "text-red-500"
                    )}>
                      {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Cryptocurrencies */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Top Cryptocurrencies</CardTitle>
                <Link to="/market" className="text-green-600 text-sm font-medium hover:text-green-700">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, idx) => (
                    <div key={idx} className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-xl">
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
                <div className="space-y-3">
                  {marketData.slice(0, 6).map((crypto, idx) => (
                    <Link
                      key={crypto.id}
                      to={`/coin/${crypto.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
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
                          <div className="font-semibold text-gray-900">{crypto.name}</div>
                          <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
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
            </CardContent>
          </Card>

          {/* Platform Features */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Why Choose Our Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">{feature.title}</h4>
                      <p className="text-xs text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trading Tips */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Pro Trading Tip</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Diversify your portfolio across different cryptocurrencies to manage risk effectively. 
                    Set stop-loss orders to protect your investments.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    <Target className="w-4 h-4 mr-2" />
                    Learn Advanced Trading
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom spacing for navigation */}
          <div className="h-4"></div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
