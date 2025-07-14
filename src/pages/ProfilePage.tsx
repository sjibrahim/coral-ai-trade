
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown, User, Settings, Bell, Shield, Star, 
  Wallet, ArrowUpRight, Send, Users,
  CreditCard, FileText, LogOut,
  Eye, EyeOff, TrendingUp, Award, Zap,
  BarChart3, Target, Gift, DollarSign,
  IndianRupee, Activity, Sparkles
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
    { icon: Users, label: "Invite", gradient: "from-orange-500 to-red-500", link: "/invite" }
  ];

  const profileMenuItems = [
    {
      category: "Trading & Records",
      items: [
        { icon: Activity, label: "Contract Records", link: "/contract-record", color: "emerald" },
        { icon: FileText, label: "Transaction Records", link: "/transactions", color: "blue" },
        { icon: IndianRupee, label: "Withdrawals", link: "/all-withdrawals", color: "pink" },
        { icon: Users, label: "My Team", link: "/team", color: "purple" }
      ]
    },
    {
      category: "Account & Settings",
      items: [
        { icon: CreditCard, label: "Bank Details", link: "/bank", color: "green" },
        { icon: Shield, label: "Security", link: "/security", color: "red" },
        { icon: Settings, label: "Settings", link: "/settings", color: "gray" }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30">
        <div className="px-4 py-4 space-y-4 pb-20">
          {/* Profile Header */}
          <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 border-3 border-white/30 shadow-lg">
                    <AvatarImage src={avatarUrl} alt={user?.name || ''} />
                    <AvatarFallback className="bg-white/20 text-white font-bold text-2xl">
                      {user?.name?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                    <Crown className="w-3 h-3 text-amber-800" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{user?.name || 'Trexo User'}</h2>
                  <p className="text-emerald-100 mb-1">ID: {user?.id}</p>
                  <p className="text-emerald-200">{user?.phone}</p>
                </div>

                <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 h-12 w-12 p-0">
                  <Bell className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-600">Balance</span>
                  </div>
                  <button onClick={() => setHideBalance(!hideBalance)} className="p-1">
                    {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {hideBalance ? "••••••" : `₹${parseFloat(depositBalance.toString()).toLocaleString()}`}
                </p>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="font-semibold">Available</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-600">Profit</span>
                  </div>
                  <button onClick={() => setHideRevenue(!hideRevenue)} className="p-1">
                    {hideRevenue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {hideRevenue ? "••••••" : `₹${totalIncome.toLocaleString()}`}
                </p>
                <div className="flex items-center text-blue-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="font-semibold">Today: ₹{todayIncome}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-emerald-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(action.link)}
                    className="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md border border-gray-200/50"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto bg-gradient-to-r transition-all duration-300 group-hover:scale-110",
                      action.gradient
                    )}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors block text-center">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          {profileMenuItems.map((category, categoryIdx) => (
            <Card key={categoryIdx} className="bg-white shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-gray-700">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(item.link)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-200 group"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                        getColorClasses(item.color)
                      )}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors flex-1 text-left">
                        {item.label}
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Logout Button */}
          <Card className="bg-red-50 border-red-200 shadow-lg">
            <CardContent className="p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg"
              >
                <LogOut className="w-6 h-6" />
                <span className="font-semibold text-lg">Logout</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
