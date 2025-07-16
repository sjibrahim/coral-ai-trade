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
  Wallet,
  Send,
  BarChart3,
  Users,
  Bell,
  Star,
  Activity,
  DollarSign,
  Shield,
  Zap,
  Target,
  Globe,
  CheckCircle2,
  Sparkles,
  Crown,
  Award,
  Lock,
  PieChart,
  LineChart,
  Clock,
  Download
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
  
  const handleDownloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/uploads/trexo.apk';
    link.download = 'trexo.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const depositAmount = user?.deposit ? parseFloat(user.deposit) : 0;
  const walletAmount = user?.wallet ? parseFloat(user.wallet) : 0;
  const incomeAmount = user?.income ? parseFloat(user.income) : 0;
  const totalBalance = walletAmount + incomeAmount;

  const quickActions = [
    { icon: Wallet, label: "Deposit", color: "from-emerald-500 to-emerald-600", link: "/deposit" },
    { icon: Send, label: "Withdraw", color: "from-blue-500 to-blue-600", link: "/withdraw" },
    { icon: Users, label: "Invite", color: "from-orange-500 to-orange-600", link: "/invite" }
  ];

  const stats = [
    { label: "24h Volume", value: "$2.4B", change: "+12.5%", positive: true, icon: Activity },
    { label: "Active Users", value: "125K+", change: "+8.2%", positive: true, icon: Users },
    { label: "Security Level", value: "AAA+", change: "Verified", positive: true, icon: Shield },
    { label: "Uptime", value: "99.9%", change: "Reliable", positive: true, icon: Zap }
  ];

  const features = [
    { icon: Crown, title: "Premium Trading", desc: "Advanced tools & features", gradient: "from-yellow-400 to-amber-500" },
    { icon: Shield, title: "Bank Security", desc: "Military-grade encryption", gradient: "from-green-400 to-emerald-500" },
    { icon: Sparkles, title: "AI Analytics", desc: "Smart trading insights", gradient: "from-purple-400 to-violet-500" },
    { icon: Globe, title: "Global Access", desc: "Trade anywhere, anytime", gradient: "from-blue-400 to-cyan-500" }
  ];
  
  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        <WelcomeInfoModal />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-300/10 to-emerald-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          
          {/* Floating shapes */}
          <div className="absolute top-16 left-8 w-3 h-3 bg-green-400/30 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-24 right-12 w-2 h-2 bg-emerald-400/40 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-32 left-16 w-4 h-4 bg-green-300/30 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-48 right-8 w-1.5 h-1.5 bg-emerald-500/40 rounded-full animate-bounce delay-500"></div>
        </div>
        
        <div className="px-3 py-4 space-y-4 relative z-10 pb-20">
          {/* Premium Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Trexo
                </h1>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Premium Experience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full border-emerald-200 hover:bg-emerald-50"
                onClick={handleDownloadAPK}
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full border-emerald-200 hover:bg-emerald-50">
                <Bell className="w-3.5 h-3.5 text-emerald-600" />
              </Button>
            </div>
          </div>

          {/* Compact Portfolio Card with Premium Design */}
          <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <CardContent className="p-3.5 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <PieChart className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-emerald-100 text-xs font-medium font-trading">Total Portfolio</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xl font-bold font-trading">
                        {showBalance ? `₹${totalBalance.toLocaleString()}` : "••••••"}
                      </span>
                      <button 
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
                      >
                        {showBalance ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-emerald-100 mb-1">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    <span className="text-sm font-semibold font-mono">+12.5%</span>
                  </div>
                  <p className="text-xs text-emerald-200">24h</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                  <div className="flex items-center gap-1 mb-1">
                    <Wallet className="w-3 h-3 text-emerald-200" />
                    <span className="text-xs text-emerald-200 font-trading">Available</span>
                  </div>
                  <p className="text-base font-bold font-mono">
                    {showBalance ? `₹${totalBalance.toLocaleString()}` : "••••"}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                  <div className="flex items-center gap-1 mb-1">
                    <LineChart className="w-3 h-3 text-emerald-200" />
                    <span className="text-xs text-emerald-200 font-trading">Profit</span>
                  </div>
                  <p className="text-base font-bold font-mono">
                    {showBalance ? `₹${incomeAmount.toLocaleString()}` : "••••"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - Single Row */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl">
            <CardHeader className="pb-2.5">
              <CardTitle className="text-sm flex items-center gap-2 font-trading">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {quickActions.map((action, idx) => (
                  <Link 
                    key={idx}
                    to={action.link}
                    className="group flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200/50 min-w-[70px]"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 mx-auto bg-gradient-to-r transition-all duration-300 group-hover:scale-110",
                      action.color
                    )}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors block text-center font-trading">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Stats with Animations */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, idx) => (
                  <div key={idx} className="group p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                        <stat.icon className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                    </div>
                    <p className="text-base font-bold text-gray-900">{stat.value}</p>
                    <div className={cn(
                      "text-xs font-medium flex items-center gap-0.5 mt-0.5",
                      stat.positive ? "text-emerald-600" : "text-red-500"
                    )}>
                      {stat.positive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Cryptocurrencies - Mobile Optimized Premium Design */}
          <Card className="bg-white/95 backdrop-blur-sm border border-emerald-200/50 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-white/50 to-green-50/50"></div>
            <CardHeader className="pb-2.5 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2 font-trading">
                  <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent text-sm">
                    Top Cryptos
                  </span>
                </CardTitle>
                <Link to="/market" className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              {isLoading ? (
                <div className="space-y-1.5">
                  {Array(4).fill(0).map((_, idx) => (
                    <div key={idx} className="animate-pulse flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                        <div>
                          <div className="h-2.5 w-14 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 w-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-2.5 w-10 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {marketData.slice(0, 5).map((crypto, idx) => (
                    <Link
                      key={crypto.id}
                      to={`/coin/${crypto.id}`}
                      className="group flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-white/80 to-emerald-50/30 hover:from-emerald-50 hover:to-green-50 transition-all duration-500 hover:shadow-lg border border-emerald-100/50 hover:border-emerald-200 backdrop-blur-sm animate-fade-in"
                      style={{
                        animationDelay: `${idx * 100}ms`
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-7 h-7 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-md border border-emerald-200/50">
                            <img 
                              src={crypto.logo} 
                              alt={crypto.name} 
                              className="w-4 h-4 rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                              }}
                            />
                          </div>
                          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                            <span className="text-[7px] text-white font-bold">#{idx + 1}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors text-sm font-trading">
                            {crypto.name.length > 8 ? crypto.name.substring(0, 8) + '...' : crypto.name}
                          </div>
                          <div className="text-xs text-gray-500 font-mono font-medium">{crypto.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-sm font-mono">
                          ${crypto.price > 100 ? crypto.price.toLocaleString(undefined, {maximumFractionDigits: 0}) : crypto.price.toLocaleString()}
                        </div>
                        <div className={cn(
                          "text-xs flex items-center justify-end font-bold font-mono px-1.5 py-0.5 rounded-full",
                          (crypto.change || 0) >= 0 
                            ? "text-emerald-700 bg-emerald-100/80" 
                            : "text-red-700 bg-red-100/80"
                        )}>
                          {(crypto.change || 0) >= 0 ? (
                            <TrendingUp className="w-2 h-2 mr-0.5" />
                          ) : (
                            <TrendingDown className="w-2 h-2 mr-0.5" />
                          )}
                          {(crypto.change || 0) >= 0 ? '+' : ''}{Math.abs(crypto.change || 0).toFixed(1)}%
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="group p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-gradient-to-r group-hover:scale-110 transition-transform",
                      feature.gradient
                    )}>
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trading Tip with Animation */}
          <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200/50 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-l from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Pro Trading Insight
                  </h3>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    Diversification is key to successful trading. Spread your investments across different cryptocurrencies and set stop-loss orders to minimize risks.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                    Unlock Advanced Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom spacing for navigation */}
          <div className="h-16"></div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
