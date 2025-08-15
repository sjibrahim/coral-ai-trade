
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { 
  CreditCard, Lock, Calendar, Gift,
  Copy, Check, ArrowRight, ScrollText, Banknote, CreditCard as CardIcon, TrendingDown
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
  const inviteCode = user?.invite_code || user?.referral_code || user?.id || "CORAL123";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <MobileLayout hideNavbar hideFooter>
      <div className="min-h-screen bg-gray-900 text-white relative pb-24">
        <div className="relative z-10 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">C</span>
              </div>
              <div>
                <div className="text-white font-medium">Coral</div>
                <div className="text-gray-400 text-sm">AI Trading Platform</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{user?.id || '123456'}</div>
              <div className="text-xs text-gray-400">ID</div>
            </div>
          </div>

          {/* VIP Card */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/40 rounded-full"></div>
                </div>
                <div>
                  <div className="text-white font-semibold">VIP Member</div>
                  <div className="text-white/80 text-sm">Premium Benefits</div>
                </div>
              </div>
              <Button 
                className="bg-white text-orange-500 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold"
                onClick={() => navigate('/vip')}
              >
                Upgrade
              </Button>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                ₹{totalBalance.toLocaleString()}
              </div>
              <div className="text-gray-400 text-xs">Total Assets</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">₹0</div>
              <div className="text-gray-400 text-xs">Recharge</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">₹0</div>
              <div className="text-gray-400 text-xs">Withdraw</div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Invite Friends Card */}
            <div className="bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-500 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="text-white font-bold text-base mb-2">Invite Friends</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white/90 text-sm font-mono bg-white/20 px-2 py-1 rounded">
                    {inviteCode}
                  </span>
                  <button 
                    onClick={handleCopyCode} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-white/80 text-xs">Share & Earn</div>
                  <ArrowRight className="w-4 h-4 text-white/60" />
                </div>
              </div>
            </div>

            {/* Contest Card */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <div className="relative">
                <div className="text-white font-bold text-base mb-2">Contest</div>
                <div className="text-white/80 text-xs mb-3">Win rewards daily</div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                    <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/60" />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Grid - Updated with background image */}
          <div 
            className="rounded-2xl p-6 mb-8 relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/uploads/assetsbg-BsWPbjIy.png')"
            }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
            
            <div className="relative z-10 grid grid-cols-4 gap-4">
              <button 
                onClick={() => navigate('/bank')}
                className="flex flex-col items-center p-3 transition-all hover:scale-105"
              >
                <img 
                  src="https://tnl-icons.duckdns.org/green/dash/upload/20241005/c34a3a2fd6b48b9b1b3a5032b50a7aaa.png" 
                  alt="Bank Card" 
                  className="w-8 h-8 mb-2"
                />
                <span className="text-xs text-white text-center font-medium">Bank Card</span>
              </button>

              <button 
                onClick={() => navigate('/security')}
                className="flex flex-col items-center p-3 transition-all hover:scale-105"
              >
                <Lock className="w-8 h-8 text-white mb-2" />
                <span className="text-xs text-white text-center font-medium">Security</span>
              </button>

              <button 
                onClick={() => navigate('/checkin')}
                className="flex flex-col items-center p-3 transition-all hover:scale-105"
              >
                <img 
                  src="https://tnl-icons.duckdns.org/green/dash/upload/20241016/aef64e6784fa317a3baee12d67337107.png" 
                  alt="Check-in" 
                  className="w-8 h-8 mb-2"
                />
                <span className="text-xs text-white text-center font-medium">Check-in</span>
              </button>

              <button 
                onClick={() => navigate('/gift-code')}
                className="flex flex-col items-center p-3 transition-all hover:scale-105"
              >
                <Gift className="w-8 h-8 text-white mb-2" />
                <span className="text-xs text-white text-center font-medium">Gift Code</span>
              </button>

              <button 
                onClick={() => navigate('/contract-records')}
                className="flex flex-col items-center p-3 transition-all hover:scale-105"
              >
                <ScrollText className="w-8 h-8 text-white mb-2" />
                <span className="text-xs text-white text-center font-medium">Contract Records</span>
              </button>

              <button 
                onClick={() => navigate('/salary-records')}
                className="flex flex-col items-center p-3 transition-all hover:scale-105"
              >
                <Banknote className="w-8 h-8 text-white mb-2" />
                <span className="text-xs text-white text-center font-medium">Salary Records</span>
              </button>

              <button 
                onClick={() => navigate('/transaction-records')}
                className="flex flex-col items-center p-3 transition-all hover:scale-105"
              >
                <CardIcon className="w-8 h-8 text-white mb-2" />
                <span className="text-xs text-white text-center font-medium">Transaction Records</span>
              </button>

              <button 
                onClick={() => navigate('/withdrawal-records')}
                className="flex flex-col items-center p-3 transition-all hover:scale-105"
              >
                <TrendingDown className="w-8 h-8 text-white mb-2" />
                <span className="text-xs text-white text-center font-medium">Withdrawal Records</span>
              </button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
