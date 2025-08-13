
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
  Download, Users, Lock, Calendar
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
  const [copiedCode, setCopiedCode] = useState(false);
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

  const walletAmount = user?.wallet ? parseFloat(user.wallet) : 0;
  const incomeAmount = user?.income ? parseFloat(user.income) : 0;
  const totalBalance = walletAmount + incomeAmount;

  // Generate invite code
  const inviteCode = user?.invite_code || user?.referral_code || user?.id || "TREXO";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Get VIP badge
  const getVipBadge = () => {
    if (!user?.rank) return null;
    
    const rank = user.rank.toLowerCase();
    if (rank.includes('vip1')) {
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 text-xs">
          <Crown className="w-3 h-3 mr-1" />
          VIP1
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs">
        {user.rank}
      </Badge>
    );
  };

  return (
    <MobileLayout hideNavbar>
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px)`
          }}></div>
        </div>

        <div className="relative z-10 px-4 py-6 space-y-4 pb-24">
          {/* Header with ID */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">C</span>
              </div>
              <span className="text-xl font-bold">CORAL</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{user?.id || '1789083144'}</span>
              <div className="text-xs text-gray-400">™</div>
            </div>
          </div>

          {/* VIP Upgrade Banner */}
          <Card className="bg-gradient-to-r from-teal-500 to-green-500 border-0 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">VIP Member</h3>
                    <p className="text-teal-100 text-sm">Exclusive benefits</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full"
                  onClick={() => navigate('/vip')}
                >
                  Upgrade now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Balance Overview */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-bold">
                      {hideBalance ? "••••" : `$${totalBalance.toLocaleString()}`}
                    </span>
                    <button onClick={() => setHideBalance(!hideBalance)}>
                      {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm">Asset Overview</p>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">$0</div>
                  <p className="text-gray-400 text-sm">Recharge Funds</p>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">$0</div>
                  <p className="text-gray-400 text-sm">Withdraw Funds</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Cards Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Invite Friends */}
            <Card className="bg-gradient-to-r from-teal-500 to-cyan-500 border-0 overflow-hidden">
              <CardContent className="p-4 relative">
                <div className="absolute right-2 top-2">
                  <ArrowUpRight className="w-5 h-5 text-white/70" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-semibold">Invite Friends</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm font-mono">{inviteCode}</span>
                    <button onClick={handleCopyCode} className="text-white/80 hover:text-white">
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center mt-2">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wealth Contest */}
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 overflow-hidden">
              <CardContent className="p-4 relative">
                <div className="absolute right-2 top-2">
                  <ArrowUpRight className="w-5 h-5 text-white/70" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-semibold">Wealth Contest</h3>
                  <p className="text-white/80 text-xs">Participate in the event and get rewards</p>
                  <div className="flex items-center gap-1 mt-2">
                    <DollarSign className="w-4 h-4 text-white" />
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {/* Row 1 */}
            <button 
              onClick={() => navigate('/bank')}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-3">
                <CreditCard className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-sm text-gray-300">Bind Bank</span>
            </button>

            <button 
              onClick={() => navigate('/security')}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-sm text-gray-300">Login Password</span>
            </button>

            <button 
              onClick={() => navigate('/checkin')}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-sm text-gray-300">Checkin</span>
            </button>

            {/* Row 2 - Gift Code */}
            <button 
              onClick={() => navigate('/gift-code')}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors col-span-1"
            >
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-3">
                <Gift className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-sm text-gray-300">Gift Code</span>
            </button>
          </div>

          {/* Bottom Navigation Placeholder */}
          <div className="h-20"></div>
        </div>

        {/* Floating Profile Button */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
