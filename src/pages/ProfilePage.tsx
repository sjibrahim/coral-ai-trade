import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown, User, Settings, Bell, Shield, Star, 
  Wallet, ArrowUpRight, ArrowDownRight, Send,
  CreditCard, FileText, Download, LogOut,
  Eye, EyeOff, TrendingUp, Award, Zap,
  BarChart3, Target, Lock, Gift, DollarSign,
  IndianRupee, PieChart, Activity, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const getRandomAvatarUrl = () => {
  const seed = Math.floor(Math.random() * 1000);
  return `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}`;
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
  const [hideRevenue, setHideRevenue] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
      return;
    }
    
    setIsLoading(false);
    
    if (user.name) {
      const newAvatarUrl = getRandomAvatarUrl();
      const img = new Image();
      img.src = newAvatarUrl;
      img.onload = () => setAvatarUrl(newAvatarUrl);
      img.onerror = () => setAvatarUrl('https://api.dicebear.com/6.x/avataaars/svg?seed=default');
    }
  }, [user?.name]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const depositBalance = user?.wallet || 0;
  const totalIncome = user?.total_income || user?.income || 0;
  const todayIncome = user?.today_income || 0;

  const quickActions = [
    { icon: Wallet, label: "Deposit", gradient: "from-emerald-500 to-green-600", link: "/deposit" },
    { icon: Send, label: "Withdraw", gradient: "from-blue-500 to-indigo-600", link: "/withdraw" },
    { icon: BarChart3, label: "Trade", gradient: "from-purple-500 to-violet-600", link: "/market" },
    { icon: Gift, label: "Rewards", gradient: "from-orange-500 to-red-500", link: "/rewards" }
  ];

  const profileMenuItems = [
    {
      category: "Trading",
      items: [
        { icon: BarChart3, label: "Trading History", link: "/transactions", color: "emerald" },
        { icon: PieChart, label: "Portfolio", link: "/portfolio", color: "blue" },
        { icon: Award, label: "VIP Benefits", link: "/vip", color: "amber" },
        { icon: Target, label: "Referrals", link: "/invite", color: "purple" }
      ]
    },
    {
      category: "Finance",
      items: [
        { icon: CreditCard, label: "Bank Details", link: "/bank", color: "green" },
        { icon: FileText, label: "Transaction Records", link: "/transactions", color: "indigo" },
        { icon: IndianRupee, label: "Salary Records", link: "/salary-record", color: "teal" },
        { icon: ArrowDownRight, label: "Withdrawal History", link: "/all-withdrawals", color: "pink" }
      ]
    },
    {
      category: "Support",
      items: [
        { icon: Shield, label: "Security", link: "/security", color: "red" },
        { icon: Settings, label: "Settings", link: "/settings", color: "gray" },
        { icon: FileText, label: "Help & Support", link: "/support", color: "blue" },
        { icon: Download, label: "Download App", link: "#", color: "green", action: "download" }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: "text-emerald-600 bg-emerald-100/80",
      blue: "text-blue-600 bg-blue-100/80",
      amber: "text-amber-600 bg-amber-100/80",
      purple: "text-purple-600 bg-purple-100/80",
      green: "text-green-600 bg-green-100/80",
      indigo: "text-indigo-600 bg-indigo-100/80",
      teal: "text-teal-600 bg-teal-100/80",
      pink: "text-pink-600 bg-pink-100/80",
      red: "text-red-600 bg-red-100/80",
      gray: "text-gray-600 bg-gray-100/80"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="px-4 py-6 space-y-6 relative z-10 pb-24">
          {/* Premium Profile Header */}
          <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-3 border-white/30 shadow-lg">
                    <AvatarImage src={avatarUrl} alt={user?.name || ''} />
                    <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                      {user?.name?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                    <Crown className="w-3 h-3 text-amber-800" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold font-trading">{user?.name || 'Trexo User'}</h2>
                    {user?.rank && (
                      <div className="bg-amber-400 text-amber-900 rounded-full px-2 py-0.5 text-xs font-bold">
                        {user.rank}
                      </div>
                    )}
                  </div>
                  <p className="text-emerald-100 text-sm font-mono">ID: {user?.id}</p>
                  <p className="text-emerald-200 text-sm">{user?.phone}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">Available</span>
                  </div>
                  <button onClick={() => setHideBalance(!hideBalance)} className="p-1">
                    {hideBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-lg font-bold text-gray-900 font-mono">
                  {hideBalance ? "••••••" : `₹${parseFloat(depositBalance.toString()).toLocaleString()}`}
                </p>
                <div className="flex items-center text-emerald-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span className="text-xs font-semibold">+5.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">Total Profit</span>
                  </div>
                  <button onClick={() => setHideRevenue(!hideRevenue)} className="p-1">
                    {hideRevenue ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-lg font-bold text-gray-900 font-mono">
                  {hideRevenue ? "••••••" : `₹${totalIncome.toLocaleString()}`}
                </p>
                <div className="flex items-center text-blue-600 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  <span className="text-xs font-semibold">Today: ₹{todayIncome}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-trading">
                <Zap className="w-4 h-4 text-emerald-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(action.link)}
                    className="group p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200/50"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto bg-gradient-to-r transition-all duration-300 group-hover:scale-110",
                      action.gradient
                    )}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors block text-center">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Menu */}
          {profileMenuItems.map((category, categoryIdx) => (
            <Card key={categoryIdx} className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-700 font-trading">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.action === 'download') {
                          window.open('/downloads/trexo-app.apk', '_blank');
                        } else {
                          navigate(item.link);
                        }
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-200 group"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                        getColorClasses(item.color)
                      )}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors flex-1 text-left">
                        {item.label}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Logout Button */}
          <Card className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 shadow-xl">
            <CardContent className="p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;