
import { useState, useEffect } from 'react';
import MobileLayout from "@/components/layout/MobileLayout";
import { mockUser } from "@/data/mockData";
import ProfileOption from "@/components/ProfileOption";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowUpCircle, ArrowDownCircle, Share2, Building, KeySquare, HelpCircle, 
  FileText, LogOut, Wallet, Star, Bell, Settings, Gift, Shield, User
} from "lucide-react";
import { cn } from "@/lib/utils";

const getRandomAvatarUrl = () => {
  // Generate a random seed for the avatar
  const seed = Math.floor(Math.random() * 1000);
  return `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}`;
};

const ProfilePage = () => {
  const [avatarUrl, setAvatarUrl] = useState(mockUser.avatar);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading the avatar
  useEffect(() => {
    setIsLoading(true);
    // Get random avatar
    const newAvatarUrl = getRandomAvatarUrl();
    
    const img = new Image();
    img.src = newAvatarUrl;
    img.onload = () => {
      setAvatarUrl(newAvatarUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      // Fallback to the original avatar
      setAvatarUrl(mockUser.avatar);
      setIsLoading(false);
    };
  }, []);
  
  return (
    <MobileLayout>
      <div className="animate-fade-in space-y-6 pb-24">
        {/* Profile Header - Modern Design */}
        <div className="bg-gradient-to-br from-primary/30 via-accent/40 to-blue-900/30 backdrop-blur-sm rounded-b-3xl overflow-hidden relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative p-6 pt-8">
            {/* VIP Badge - Top section */}
            <div className="flex justify-end mb-5">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" />
                VIP {mockUser.vipLevel}
              </div>
            </div>
            
            {/* User Info and Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-primary p-1 shadow-2xl shadow-primary/30">
                  <Avatar className="w-20 h-20 border-4 border-background">
                    {isLoading ? (
                      <div className="w-full h-full animate-pulse bg-secondary rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    ) : (
                      <AvatarImage src={avatarUrl} alt={mockUser.name} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-primary/20">{mockUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Online status indicator */}
                <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {mockUser.name}
                  </h1>
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                  <Bell className="h-3.5 w-3.5" />
                  {mockUser.phone}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {mockUser.email}
                </p>
              </div>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Trades</p>
                <p className="text-lg font-bold">324</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                <p className="text-lg font-bold text-green-400">68%</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Team</p>
                <p className="text-lg font-bold">12</p>
              </div>
            </div>
          </div>
          
          {/* Decoration Elements */}
          <div className="h-4 w-full bg-gradient-to-r from-blue-500/20 via-primary/20 to-purple-500/20"></div>
        </div>
        
        {/* Actions */}
        <div className="p-5 grid grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center gap-2 py-3.5 text-white shadow-lg shadow-blue-500/20">
            <ArrowDownCircle size={20} />
            <span className="font-medium">Deposit</span>
          </button>
          <button className="bg-card border border-primary/30 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 py-3.5 shadow-lg">
            <ArrowUpCircle size={20} className="text-primary" />
            <span className="font-medium">Withdrawal</span>
          </button>
        </div>
        
        {/* Account Section */}
        <div className="px-5 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Account Settings
            </span>
          </h2>
          <div className="space-y-3">
            <ProfileOption 
              icon={<Share2 className="h-5 w-5 text-purple-400" />}
              label="Share & Earn"
              to="/invite"
              badge="Earn 5%"
              className="hover:border-purple-400/30 hover:bg-purple-400/5"
            />
            <ProfileOption 
              icon={<Building className="h-5 w-5 text-blue-400" />}
              label="Bank Details"
              to="/bank"
              className="hover:border-blue-400/30 hover:bg-blue-400/5"
            />
            <ProfileOption 
              icon={<KeySquare className="h-5 w-5 text-amber-400" />}
              label="Security & Password"
              to="/change-password"
              className="hover:border-amber-400/30 hover:bg-amber-400/5"
            />
            <ProfileOption 
              icon={<Gift className="h-5 w-5 text-pink-400" />}
              label="Bonus & Rewards"
              to="/rewards"
              badge="New"
              className="hover:border-pink-400/30 hover:bg-pink-400/5"
            />
            <ProfileOption 
              icon={<Settings className="h-5 w-5 text-slate-400" />}
              label="Preferences"
              to="/settings"
              className="hover:border-slate-400/30 hover:bg-slate-400/5"
            />
            <ProfileOption 
              icon={<HelpCircle className="h-5 w-5 text-green-400" />}
              label="Customer Service"
              to="/support"
              badge="24/7"
              className="hover:border-green-400/30 hover:bg-green-400/5"
            />
          </div>
        </div>
        
        {/* Records Section */}
        <div className="px-5 pt-2">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-blue-400" />
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Transaction Records
            </span>
          </h2>
          <div className="space-y-3">
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-blue-300" />}
              label="Deposit Records"
              to="/deposit-records"
              className="hover:border-blue-300/30 hover:bg-blue-300/5"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-green-300" />}
              label="Withdrawal Records"
              to="/withdrawal-records"
              className="hover:border-green-300/30 hover:bg-green-300/5"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-purple-300" />}
              label="Contract Records"
              to="/contract-record"
              className="hover:border-purple-300/30 hover:bg-purple-300/5"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-amber-300" />}
              label="Commission Records"
              to="/commission-record"
              className="hover:border-amber-300/30 hover:bg-amber-300/5"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-red-300" />}
              label="Salary Records"
              to="/salary-record"
              className="hover:border-red-300/30 hover:bg-red-300/5"
            />
          </div>
          
          <button className="w-full mt-10 bg-gradient-to-r from-red-600/80 to-red-500/80 backdrop-blur-sm shadow-lg shadow-red-500/20 rounded-xl py-4 text-white flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">LOGOUT</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
