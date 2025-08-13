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
  Download,
  CreditCard,
  Gift,
  HelpCircle,
  Play,
  UserPlus,
  Banknote,
  Volume2,
  Home
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

  const actionItems = [
    { icon: CreditCard, label: "Deposit", color: "bg-orange-500", link: "/deposit" },
    { icon: Banknote, label: "Withdraw cash", color: "bg-green-500", link: "/withdraw" },
    { icon: UserPlus, label: "Invite friends", color: "bg-blue-500", link: "/invite" },
    { icon: Award, label: "Check in", color: "bg-purple-500", link: "/rewards" },
    { icon: Gift, label: "Promo rewards", color: "bg-pink-500", link: "/rewards" },
    { icon: CreditCard, label: "Bank Card", color: "bg-yellow-500", link: "/profile" },
    { icon: HelpCircle, label: "Instruction", color: "bg-teal-500", link: "/support" },
    { icon: HelpCircle, label: "Help", color: "bg-teal-500", link: "/support" }
  ];
  
  return (
    <MobileLayout hideNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <WelcomeInfoModal />
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, #10b981 2px, transparent 2px),
                               radial-gradient(circle at 80% 80%, #3b82f6 2px, transparent 2px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>
        
        <div className="relative z-10 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <img src="https://ik.imagekit.io/spmcumfu9/coral.jpeg" alt="TCPatel" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-emerald-400">TCPatel</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <Users className="w-5 h-5 text-gray-400" />
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Tagline */}
          <div className="px-4 mb-6">
            <p className="text-gray-300 text-sm flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              for the future and intelligently control every risk
            </p>
          </div>

          {/* Promotional Banner */}
          <div className="mx-4 mb-6">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-y-4 translate-x-4"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <img src="https://ik.imagekit.io/spmcumfu9/coral.jpeg" alt="TCPatel" className="w-full h-full object-cover rounded-lg" />
                </div>
                <span className="text-white font-semibold">TCPatel</span>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-white text-xl font-bold mb-2">
                  New users receive a<br />
                  <span className="text-yellow-300 text-3xl">$6</span> <span className="text-lg">bonus upon</span><br />
                  registration
                </h2>
              </div>
              
              {/* Phone mockup illustration */}
              <div className="absolute right-4 top-4 w-24 h-32 bg-black/30 rounded-xl border border-white/20">
                <div className="w-full h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-t-xl"></div>
                <div className="p-2 space-y-1">
                  <div className="w-full h-2 bg-white/20 rounded"></div>
                  <div className="w-3/4 h-2 bg-white/15 rounded"></div>
                  <div className="w-1/2 h-2 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="px-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              {actionItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.link}
                  className="flex flex-col items-center p-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-lg",
                    item.color
                  )}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-300 text-center leading-tight font-medium">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Promotional Video Section */}
          <div className="px-4 mb-6">
            <h3 className="text-white font-semibold mb-3">Promotional Video</h3>
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-lg">QUANTUM LEAP</h4>
                  <p className="text-emerald-100 text-sm">Advanced Trading Platform</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
            </div>
          </div>

          {/* Top Cryptocurrencies */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Market Trends</h3>
              <Link to="/market" className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">
                View All
              </Link>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, idx) => (
                  <div key={idx} className="animate-pulse flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-xl"></div>
                      <div>
                        <div className="h-3 w-20 bg-slate-700 rounded mb-1"></div>
                        <div className="h-2 w-12 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-3 w-16 bg-slate-700 rounded mb-1"></div>
                      <div className="h-2 w-10 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {marketData.slice(0, 4).map((crypto, idx) => (
                  <Link
                    key={crypto.id}
                    to={`/coin/${crypto.id}`}
                    className="flex items-center justify-between p-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-xl flex items-center justify-center">
                        <img 
                          src={crypto.logo} 
                          alt={crypto.name} 
                          className="w-6 h-6 rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${crypto.symbol.toUpperCase()}.png`;
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {crypto.name.length > 10 ? crypto.name.substring(0, 10) + '...' : crypto.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">{crypto.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-sm">
                        ${crypto.price > 100 ? crypto.price.toLocaleString(undefined, {maximumFractionDigits: 0}) : crypto.price.toLocaleString()}
                      </div>
                      <div className={cn(
                        "text-xs flex items-center justify-end font-semibold",
                        (crypto.change || 0) >= 0 
                          ? "text-emerald-400" 
                          : "text-red-400"
                      )}>
                        {(crypto.change || 0) >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {(crypto.change || 0) >= 0 ? '+' : ''}{Math.abs(crypto.change || 0).toFixed(1)}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50">
          <div className="flex justify-around items-center py-3 px-2">
            <Link to="/home" className="flex flex-col items-center gap-1 p-2 rounded-lg bg-emerald-500/20">
              <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-emerald-400 font-medium">Home</span>
            </Link>
            <Link to="/team" className="flex flex-col items-center gap-1 p-2">
              <Users className="w-6 h-6 text-gray-500" />
              <span className="text-xs text-gray-500">Team</span>
            </Link>
            <Link to="/deposit" className="flex flex-col items-center gap-1 p-2">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </Link>
            <Link to="/market" className="flex flex-col items-center gap-1 p-2">
              <BarChart3 className="w-6 h-6 text-gray-500" />
              <span className="text-xs text-gray-500">Invest</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center gap-1 p-2">
              <Clock className="w-6 h-6 text-gray-500" />
              <span className="text-xs text-gray-500">Profile</span>
            </Link>
          </div>
        </div>

        {/* AI Assistant Button */}
        <div className="fixed bottom-24 right-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <div className="w-6 h-6 bg-white/20 rounded-md mb-0.5"></div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
