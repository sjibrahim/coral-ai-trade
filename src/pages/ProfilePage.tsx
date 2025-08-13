
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, Lock, Calendar, Gift,
  Home, Users, Monitor, TrendingUp, User,
  ArrowRight, Copy, Check
} from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState(false);
  const navigate = useNavigate();

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

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Users, label: "Team", path: "/team" },
    { icon: Monitor, label: "Trade", path: "/trade" },
    { icon: TrendingUp, label: "Invest", path: "/market" },
    { icon: User, label: "Profile", path: "/profile", active: true }
  ];

  return (
    <MobileLayout hideNavbar hideFooter>
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Background with geometric pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(135deg, transparent 25%, rgba(20, 184, 166, 0.05) 25%, rgba(20, 184, 166, 0.05) 50%, transparent 50%, transparent 75%, rgba(20, 184, 166, 0.05) 75%),
              linear-gradient(45deg, transparent 25%, rgba(20, 184, 166, 0.03) 25%, rgba(20, 184, 166, 0.03) 50%, transparent 50%, transparent 75%, rgba(20, 184, 166, 0.03) 75%)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 p-4 space-y-4">
          {/* Header with logo and ID */}
          <div className="flex items-center justify-between mb-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center border-2 border-teal-300/30">
                <span className="text-lg font-bold text-white">C</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{user?.id || '1789083144'}</div>
              <div className="text-xs text-gray-400 font-medium">™</div>
            </div>
          </div>

          {/* VIP Upgrade Card */}
          <div className="bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/90 to-cyan-400/90"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">VIP Member</div>
                  <div className="text-teal-100 text-xs">Exclusive benefits</div>
                </div>
              </div>
              <Button 
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-medium shadow-lg"
                onClick={() => navigate('/vip')}
              >
                Upgrade now
              </Button>
            </div>
          </div>

          {/* Balance Overview */}
          <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-400/30 rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  ${totalBalance.toLocaleString()}
                </div>
                <div className="text-gray-300 text-sm font-medium">Asset Overview</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">$0</div>
                <div className="text-gray-300 text-sm font-medium">Recharge Funds</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">$0</div>
                <div className="text-gray-300 text-sm font-medium">Withdraw Funds</div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Invite Friends Card */}
            <div className="bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl p-4 relative overflow-hidden">
              <div className="relative">
                <div className="text-black font-bold text-base mb-2">Invite Friends</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-black/80 text-sm font-mono font-medium">{inviteCode}</span>
                  <button 
                    onClick={handleCopyCode} 
                    className="text-black/70 hover:text-black transition-colors"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-16 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-6 bg-white/40 rounded"></div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-black/60" />
                </div>
              </div>
            </div>

            {/* Wealth Contest Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 relative overflow-hidden">
              <div className="relative">
                <div className="text-white font-bold text-base mb-2">Wealth Contest</div>
                <div className="text-white/80 text-xs mb-3 leading-tight">
                  Participate in the event and get rewards
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">$</span>
                    </div>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">₿</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/60" />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <button 
              onClick={() => navigate('/bank')}
              className="flex flex-col items-center p-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:bg-gray-700/40 transition-all"
            >
              <CreditCard className="w-8 h-8 text-gray-300 mb-3" />
              <span className="text-sm text-gray-300 font-medium">Bind Bank</span>
            </button>

            <button 
              onClick={() => navigate('/security')}
              className="flex flex-col items-center p-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:bg-gray-700/40 transition-all"
            >
              <Lock className="w-8 h-8 text-gray-300 mb-3" />
              <span className="text-sm text-gray-300 font-medium">Login Password</span>
            </button>

            <button 
              onClick={() => navigate('/checkin')}
              className="flex flex-col items-center p-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:bg-gray-700/40 transition-all"
            >
              <Calendar className="w-8 h-8 text-gray-300 mb-3" />
              <span className="text-sm text-gray-300 font-medium">Checkin</span>
            </button>

            <button 
              onClick={() => navigate('/gift-code')}
              className="flex flex-col items-center p-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:bg-gray-700/40 transition-all"
            >
              <Gift className="w-8 h-8 text-gray-300 mb-3" />
              <span className="text-sm text-gray-300 font-medium">Gift Code</span>
            </button>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50">
            <div className="flex items-center justify-around py-3 px-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 ${
                    item.active ? 'text-teal-400' : 'text-gray-400'
                  }`}
                >
                  {item.path === '/trade' ? (
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg -mt-6 mb-1">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <item.icon className={`w-6 h-6 mb-1 ${item.active ? 'text-teal-400' : 'text-gray-400'}`} />
                  )}
                  <span className={`text-xs font-medium ${
                    item.path === '/trade' ? 'text-white' : 
                    item.active ? 'text-teal-400' : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom spacing for navigation */}
          <div className="h-20"></div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
