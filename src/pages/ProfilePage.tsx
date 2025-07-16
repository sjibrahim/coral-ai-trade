import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, User, Settings, Bell, Shield, Star, 
  Wallet, ArrowUpRight, Send,
  CreditCard, FileText, LogOut,
  Eye, EyeOff, TrendingUp, Award, Zap,
  BarChart3, Target, Gift, DollarSign,
  IndianRupee, Activity, Sparkles, Copy, Check,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

const getRandomAvatarUrl = () => {
  const seed = Math.floor(Math.random() * 1000);
  return `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}`;
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
  const [hideRevenue, setHideRevenue] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
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

  const handleDownloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/uploads/trexo.apk';
    link.download = 'trexo.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalIncome = user?.total_income || user?.income || 0;
  const todayIncome = user?.today_income || 0;

  const walletAmount = user?.wallet ? parseFloat(user.wallet) : 0;
  const incomeAmount = user?.income ? parseFloat(user.income) : 0;
  const depositBalance = walletAmount + incomeAmount;

  // Generate invite link and code
  const inviteCode = user?.invite_code || user?.referral_code || user?.id || "TREXO";
  const baseUrl = window.location.origin;
  const inviteLink = `${baseUrl}/register?referral=${inviteCode}`;

  // Function to truncate URL for mobile display
  const getTruncatedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const path = urlObj.pathname + urlObj.search;
      
      if (path.length > 25) {
        return `${domain}/...${path.slice(-15)}`;
      }
      return `${domain}${path}`;
    } catch {
      return url.length > 30 ? `${url.slice(0, 20)}...${url.slice(-10)}` : url;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Get VIP badge variant based on rank
  const getVipBadge = () => {
    if (!user?.rank) return null;
    
    const rank = user.rank.toLowerCase();
    if (rank.includes('vip1')) {
      return (
        <div className="relative">
          <Badge 
            variant="default" 
            className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white border-0 shadow-lg px-3 py-1 text-xs font-bold tracking-wide animate-pulse-glow relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
            <Crown className="w-3 h-3 mr-1 relative z-10" />
            <span className="relative z-10">VIP1</span>
          </Badge>
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur opacity-30 animate-pulse"></div>
        </div>
      );
    }
    // Add more VIP levels as needed
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5">
        {user.rank}
      </Badge>
    );
  };

  const quickActions = [
    { icon: Wallet, label: "Deposit", gradient: "from-emerald-500 to-green-600", link: "/deposit" },
    { icon: Send, label: "Withdraw", gradient: "from-blue-500 to-indigo-600", link: "/withdraw" },
    { icon: BarChart3, label: "Trade", gradient: "from-purple-500 to-violet-600", link: "/market" }
  ];

  const profileMenuItems = [
    {
      category: "Trading & Records",
      items: [
        { icon: Activity, label: "Contract Records", link: "/contract-record", color: "emerald" },
        { icon: FileText, label: "Transaction Records", link: "/transactions", color: "blue" },
        { icon: IndianRupee, label: "Withdrawal Records", link: "/withdrawal-records", color: "pink" },
        { icon: User, label: "My Team", link: "/team", color: "purple" }
      ]
    },
    {
      category: "Account & Settings",
      items: [
        { icon: CreditCard, label: "Bank Details", link: "/bank", color: "green" },
        { icon: Shield, label: "Security", link: "/security", color: "red" },
        { icon: Settings, label: "Settings", link: "/settings", color: "gray" },
        { icon: Download, label: "Download APK", link: "#", color: "indigo", onClick: handleDownloadAPK }
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
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="px-4 py-4 space-y-4 relative z-10 pb-24">
          {/* Profile Header */}
          <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-14 h-14 border-3 border-white/30 shadow-lg">
                    <AvatarImage src={avatarUrl} alt={user?.name || ''} />
                    <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                      {user?.name?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                    <Crown className="w-2.5 h-2.5 text-amber-800" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold">{user?.name || 'Trexo User'}</h2>
                    {getVipBadge()}
                  </div>
                  <p className="text-emerald-100 text-xs mb-0.5">ID: {user?.id}</p>
                  <p className="text-emerald-200 text-xs">{user?.phone}</p>
                </div>

                <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 h-8 w-8 p-0">
                  <Bell className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invite Section */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-600" />
                Invite Friends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {/* Invite Code */}
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1 font-medium">Your Invite Code</p>
                      <p className="text-lg font-bold text-emerald-600 tracking-wider">{inviteCode}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyCode}
                      className="ml-3 h-8 px-3 bg-white hover:bg-emerald-50 border-emerald-300"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                          <span className="text-green-600 font-medium text-xs">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          <span className="font-medium text-xs">Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Invite Link */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-1 font-medium">Invite Link</p>
                      <p className="text-xs text-blue-600 font-mono bg-white px-2 py-1 rounded border truncate">
                        {getTruncatedUrl(inviteLink)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyLink}
                      className="ml-3 h-8 px-3 bg-white hover:bg-blue-50 border-blue-300"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                          <span className="text-green-600 font-medium text-xs">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          <span className="font-medium text-xs">Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Wallet className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">Balance</span>
                  </div>
                  <button onClick={() => setHideBalance(!hideBalance)} className="p-1">
                    {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-lg font-bold text-gray-900 mb-1.5">
                  {hideBalance ? "••••••" : `₹${parseFloat(depositBalance.toString()).toLocaleString()}`}
                </p>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span className="text-xs font-semibold">Available</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">Profit</span>
                  </div>
                  <button onClick={() => setHideRevenue(!hideRevenue)} className="p-1">
                    {hideRevenue ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-lg font-bold text-gray-900 mb-1.5">
                  {hideRevenue ? "••••••" : `₹${totalIncome.toLocaleString()}`}
                </p>
                <div className="flex items-center text-blue-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  <span className="text-xs font-semibold">Today: ₹{todayIncome}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - 3 in one row */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2.5">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(action.link)}
                    className="group p-2.5 rounded-lg bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md border border-gray-200/50"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 mx-auto bg-gradient-to-r transition-all duration-300 group-hover:scale-110",
                      action.gradient
                    )}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors block text-center">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          {profileMenuItems.map((category, categoryIdx) => (
            <Card key={categoryIdx} className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-700">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {category.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => item.onClick ? item.onClick() : navigate(item.link)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-200 group"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                        getColorClasses(item.color)
                      )}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors flex-1 text-left text-sm">
                        {item.label}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Logout Button */}
          <Card className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 shadow-lg">
            <CardContent className="p-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 p-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold text-sm">Logout</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
