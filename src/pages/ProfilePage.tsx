
import { useState, useEffect } from 'react';
import MobileLayout from "@/components/layout/MobileLayout";
import { mockUser, mockBalances } from "@/data/mockData";
import ProfileOption from "@/components/ProfileOption";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowUpCircle, ArrowDownCircle, FileText, LogOut, 
  Wallet, Star, User, FileCheck, ListTree, CreditCard, Settings, Eye, EyeOff
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import BalanceSummary from "@/components/BalanceSummary";
import { cn } from "@/lib/utils";

const getRandomAvatarUrl = () => {
  // Generate a random seed for the avatar
  const seed = Math.floor(Math.random() * 1000);
  return `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}`;
};

const ProfilePage = () => {
  const [avatarUrl, setAvatarUrl] = useState(mockUser.avatar);
  const [isLoading, setIsLoading] = useState(true);
  const [hideRevenue, setHideRevenue] = useState(false);

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

  const toggleRevenueVisibility = () => {
    setHideRevenue(!hideRevenue);
  };
  
  return (
    <MobileLayout>
      <div className="animate-fade-in space-y-4 pb-24">
        {/* User Profile Header */}
        <div className="relative px-5 pt-4 pb-2 flex items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-14 h-14 border-2 border-primary/30">
                {isLoading ? (
                  <div className="w-full h-full animate-pulse bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                ) : (
                  <AvatarImage 
                    src={avatarUrl} 
                    alt={mockUser.name} 
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-primary/20">
                  {mockUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">UID: 5839521</span>
                <div className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {mockUser.vipLevel}
                </div>
              </div>
              <h2 className="text-base font-bold">{mockUser.name}</h2>
            </div>
          </div>
          
          {/* Settings icon */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-primary bg-primary/10 border border-primary/20">
              <Settings size={18} />
            </div>
          </div>
        </div>
        
        {/* Simple Balance Display instead of detailed breakdown */}
        <div className="px-4">
          <Card className="bg-gradient-to-br from-sky-50/5 to-blue-100/10 border border-blue-200/20 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-normal">₹</span>
                <span className="text-3xl font-semibold ml-1 text-gradient">{mockBalances.availableBalance.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="px-4 grid grid-cols-3 gap-2">
          <button className="bg-primary text-white rounded-md py-3 font-medium text-sm shadow-lg shadow-primary/30">
            Recharge
          </button>
          <button className="bg-secondary border border-blue-300/20 rounded-md py-3 font-medium text-sm">
            Withdraw
          </button>
          <button className="bg-secondary border border-blue-300/20 rounded-md py-3 font-medium text-sm">
            Details
          </button>
        </div>
        
        {/* Revenue Stats with Eye Icon */}
        <div className="mx-4 mt-4 rounded-xl overflow-hidden bg-gradient-to-b from-blue-50/10 to-blue-100/20 border border-blue-200/30">
          {/* Total Revenue with Eye Icon */}
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm text-muted-foreground">Total Revenue</h3>
              <button 
                onClick={toggleRevenueVisibility}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                {hideRevenue ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <h2 className="text-2xl font-bold">
              {hideRevenue ? "****.**₹" : "10221.26₹"}
            </h2>
            
            {/* Income Breakdown */}
            <div className="grid grid-cols-3 gap-2 mt-3 border-t border-blue-200/20 pt-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Yesterday's income</p>
                <p className="font-semibold">
                  {hideRevenue ? "**.**₹" : "344.12₹"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Today's income</p>
                <p className="font-semibold">
                  {hideRevenue ? "0.00₹" : "0.00₹"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Salary income</p>
                <p className="font-semibold">
                  {hideRevenue ? "****.**₹" : "2300.00₹"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Options */}
        <div className="px-4 space-y-2.5 mt-2">
          <h3 className="text-sm font-semibold text-muted-foreground ml-1 mb-1">Account</h3>
          
          <ProfileOption
            icon={<Wallet className="h-5 w-5 text-blue-400" />}
            label="Assets"
            to="/assets"
          />
          
          <ProfileOption
            icon={<ArrowUpCircle className="h-5 w-5 text-teal-400" />}
            label="Recharge"
            to="/deposit"
          />
          
          <ProfileOption
            icon={<ArrowDownCircle className="h-5 w-5 text-pink-400" />}
            label="Withdraw"
            to="/withdraw"
          />
          
          <h3 className="text-sm font-semibold text-muted-foreground ml-1 mt-4 mb-1">Records</h3>
          
          <ProfileOption
            icon={<FileCheck className="h-5 w-5 text-teal-400" />}
            label="Account change records"
            to="/account-records"
            badge="3"
          />
          
          <ProfileOption
            icon={<ListTree className="h-5 w-5 text-violet-400" />}
            label="Transaction Record"
            to="/transaction-record"
          />
          
          <ProfileOption
            icon={<CreditCard className="h-5 w-5 text-emerald-400" />}
            label="Bank info"
            to="/bank"
          />
          
          <h3 className="text-sm font-semibold text-muted-foreground ml-1 mt-4 mb-1">Other</h3>
          
          <ProfileOption
            icon={<Star className="h-5 w-5 text-amber-400" />}
            label="VIP benefits"
            to="/vip"
          />
          
          <ProfileOption
            icon={<FileText className="h-5 w-5 text-blue-400" />}
            label="Support & Help"
            to="/support"
          />
          
          <ProfileOption
            icon={<LogOut className="h-5 w-5 text-red-400" />}
            label="Log out"
            to="/logout"
            className="mt-4"
          />
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
