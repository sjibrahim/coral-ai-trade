
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
      <div className="min-h-screen bg-background relative pb-24">
        <div className="relative z-10 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">C</span>
              </div>
              <div>
                <div className="text-foreground font-medium">Coral</div>
                <div className="text-muted-foreground text-sm">AI Trading Platform</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{user?.id || '123456'}</div>
              <div className="text-xs text-muted-foreground">ID</div>
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
            <div className="bg-card rounded-xl p-4 text-center border">
              <div className="text-2xl font-bold text-foreground mb-1">
                ₹{totalBalance.toLocaleString()}
              </div>
              <div className="text-muted-foreground text-xs">Total Assets</div>
            </div>
            <div className="bg-card rounded-xl p-4 text-center border">
              <div className="text-2xl font-bold text-foreground mb-1">₹0</div>
              <div className="text-muted-foreground text-xs">Recharge</div>
            </div>
            <div className="bg-card rounded-xl p-4 text-center border">
              <div className="text-2xl font-bold text-foreground mb-1">₹0</div>
              <div className="text-muted-foreground text-xs">Withdraw</div>
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

          {/* Compact Menu Grid with Background */}
          <div 
            className="rounded-xl p-4 mb-8 relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/uploads/assetsbg-BsWPbjIy.png')"
            }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 rounded-xl"></div>
            
            <div className="relative z-10 grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/bank')}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
              >
                <img 
                  src="https://tnl-icons.duckdns.org/green/dash/upload/20241005/c34a3a2fd6b48b9b1b3a5032b50a7aaa.png" 
                  alt="Bank Card" 
                  className="w-6 h-6"
                />
                <span className="text-sm text-white font-medium">Bank Card</span>
              </button>

              <button 
                onClick={() => navigate('/security')}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
              >
                <Lock className="w-6 h-6 text-white" />
                <span className="text-sm text-white font-medium">Security</span>
              </button>

              <button 
                onClick={() => navigate('/checkin')}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
              >
                <img 
                  src="https://tnl-icons.duckdns.org/green/dash/upload/20241016/aef64e6784fa317a3baee12d67337107.png" 
                  alt="Check-in" 
                  className="w-6 h-6"
                />
                <span className="text-sm text-white font-medium">Check-in</span>
              </button>

              <button 
                onClick={() => navigate('/gift-code')}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
              >
                <Gift className="w-6 h-6 text-white" />
                <span className="text-sm text-white font-medium">Gift Code</span>
              </button>

              <button 
                onClick={() => navigate('/contract-records')}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
              >
                <ScrollText className="w-6 h-6 text-white" />
                <span className="text-sm text-white font-medium">Contract Records</span>
              </button>

              <button 
                onClick={() => navigate('/salary-records')}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
              >
                <Banknote className="w-6 h-6 text-white" />
                <span className="text-sm text-white font-medium">Salary Records</span>
              </button>

              <button 
                onClick={() => navigate('/transaction-records')}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
              >
                <CardIcon className="w-6 h-6 text-white" />
                <span className="text-sm text-white font-medium">Transaction Records</span>
              </button>

              <button 
                onClick={() => navigate('/withdrawal-records')}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
              >
                <TrendingDown className="w-6 h-6 text-white" />
                <span className="text-sm text-white font-medium">Withdrawal Records</span>
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
