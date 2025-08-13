
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, Lock, Calendar, Gift,
  Home, Users, Monitor, TrendingUp, User,
  ArrowRight, Copy, Check, Star
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
    <div className="min-h-screen bg-[#1a1a2e] text-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)
          `
        }}></div>
      </div>

      <div className="relative z-10 p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">C</span>
            </div>
            <div>
              <div className="text-lg font-semibold">Hi, Coral</div>
              <div className="text-sm text-gray-400">Welcome back!</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{user?.id || '1789083144'}</div>
            <div className="text-xs text-gray-400">ID</div>
          </div>
        </div>

        {/* VIP Card */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold">VIP Member</div>
                <div className="text-white/80 text-sm">Exclusive benefits await</div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/vip')}
              className="bg-white text-amber-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 text-center border border-gray-700/30">
            <div className="text-2xl font-bold text-white mb-1">
              ${totalBalance.toLocaleString()}
            </div>
            <div className="text-gray-400 text-xs">Total Assets</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 text-center border border-gray-700/30">
            <div className="text-2xl font-bold text-white mb-1">$0</div>
            <div className="text-gray-400 text-xs">Today's Profit</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 text-center border border-gray-700/30">
            <div className="text-2xl font-bold text-white mb-1">$0</div>
            <div className="text-gray-400 text-xs">Total Profit</div>
          </div>
        </div>

        {/* Action Cards Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Invite Friends */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 relative">
            <div className="text-white font-bold text-lg mb-2">Invite Friends</div>
            <div className="text-white/90 text-sm mb-3">Share & Earn Rewards</div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/90 text-xs font-mono">{inviteCode}</span>
              <button 
                onClick={handleCopyCode} 
                className="text-white/80 hover:text-white transition-colors"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end">
              <ArrowRight className="w-5 h-5 text-white/70" />
            </div>
          </div>

          {/* Contest */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 relative">
            <div className="text-white font-bold text-lg mb-2">Contest</div>
            <div className="text-white/90 text-sm mb-3">Join trading contest</div>
            <div className="text-white/90 text-xs mb-3">Win amazing prizes</div>
            <div className="flex justify-end">
              <ArrowRight className="w-5 h-5 text-white/70" />
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/bank')}
            className="flex flex-col items-center p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:bg-gray-700/40 transition-all"
          >
            <CreditCard className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-xs text-gray-300 text-center">Bank Card</span>
          </button>

          <button 
            onClick={() => navigate('/security')}
            className="flex flex-col items-center p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:bg-gray-700/40 transition-all"
          >
            <Lock className="w-8 h-8 text-green-400 mb-2" />
            <span className="text-xs text-gray-300 text-center">Security</span>
          </button>

          <button 
            onClick={() => navigate('/checkin')}
            className="flex flex-col items-center p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:bg-gray-700/40 transition-all"
          >
            <Calendar className="w-8 h-8 text-orange-400 mb-2" />
            <span className="text-xs text-gray-300 text-center">Check-in</span>
          </button>

          <button 
            onClick={() => navigate('/gift-code')}
            className="flex flex-col items-center p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:bg-gray-700/40 transition-all"
          >
            <Gift className="w-8 h-8 text-pink-400 mb-2" />
            <span className="text-xs text-gray-300 text-center">Gift Code</span>
          </button>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-24"></div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e]/95 backdrop-blur-xl border-t border-gray-700/50">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 ${
                item.active ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {item.path === '/trade' ? (
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg -mt-4 mb-1">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <item.icon className={`w-5 h-5 mb-1 ${item.active ? 'text-blue-400' : 'text-gray-400'}`} />
              )}
              <span className={`text-xs font-medium ${
                item.path === '/trade' ? 'text-white' : 
                item.active ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
