
import { useState, useEffect } from 'react';
import MobileLayout from "@/components/layout/MobileLayout";
import { mockUser } from "@/data/mockData";
import ProfileOption from "@/components/ProfileOption";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowUpCircle, ArrowDownCircle, FileText, LogOut, 
  Wallet, Star, User, FileCheck, ListTree, CreditCard
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
      <div className="animate-fade-in space-y-4 pb-24">
        {/* Profile Header with Logo and VIP Level */}
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
                <span className="text-sm font-medium">UID: {mockUser.id}</span>
                <div className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  VIP {mockUser.vipLevel}
                </div>
              </div>
              <h2 className="text-base font-bold">{mockUser.name}</h2>
            </div>
          </div>
          
          {/* Chat icon */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-primary bg-primary/10 border border-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Financial Summaries */}
        <div className="px-4">
          <Card className="bg-gradient-to-br from-sky-50/5 to-blue-100/10 border border-blue-200/20 overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Assets</p>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">6851.06₹</span>
                    <span className="text-xs text-muted-foreground ml-2">(USDT:81.56)</span>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-blue-200/20" />
              
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contract Amount</p>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">4046.00₹</span>
                    <span className="text-xs text-muted-foreground ml-2">(USDT:48.16)</span>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-blue-200/20" />
              
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total withdrawal</p>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">11396.00₹</span>
                    <span className="text-xs text-muted-foreground ml-2">(USDT:135.66)</span>
                  </div>
                </div>
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
        
        {/* Revenue Stats with Highlighted Area (Marked in Green) */}
        <div className="mx-4 mt-4 rounded-xl overflow-hidden bg-gradient-to-b from-blue-50/10 to-blue-100/20 border border-blue-200/30">
          {/* Total Revenue */}
          <div className="p-4 pb-2">
            <h3 className="text-sm text-muted-foreground mb-1">Total Revenue</h3>
            <h2 className="text-2xl font-bold">10221.26₹</h2>
            
            {/* Income Breakdown */}
            <div className="grid grid-cols-3 gap-2 mt-3 border-t border-blue-200/20 pt-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Yesterday's income</p>
                <p className="font-semibold">344.12₹</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Today's income</p>
                <p className="font-semibold">0.00₹</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Salary income</p>
                <p className="font-semibold">2300.00₹</p>
              </div>
            </div>
          </div>
          
          {/* Profit Margins Section - Highlighted in Green in the reference */}
          <div className="bg-gradient-to-br from-blue-400/20 to-blue-300/30 p-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-xs text-blue-100">Current Profit Margin</p>
                <p className="font-semibold text-lg">5.5%</p>
                <div className="h-1 bg-blue-200/30 rounded-full mt-2 w-3/4 mx-auto">
                  <div className="h-1 bg-blue-500 rounded-full w-[55%]"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-100">Next Profit Margin</p>
                <p className="font-semibold text-lg">6.0%</p>
                <div className="h-1 bg-blue-200/30 rounded-full mt-2 w-3/4 mx-auto">
                  <div className="h-1 bg-blue-500 rounded-full w-[60%]"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-100">Upgrade by valid invitation</p>
                <p className="font-semibold text-lg">13/20</p>
                <div className="h-1 bg-blue-200/30 rounded-full mt-2 w-3/4 mx-auto">
                  <div className="h-1 bg-blue-500 rounded-full w-[65%]"></div>
                </div>
              </div>
            </div>
            <div className="mt-2 h-0.5 bg-blue-300/30 w-full">
              <div className="bg-primary h-0.5 w-[65%] relative">
                <div className="absolute right-0 -bottom-1 h-2 w-2 rounded-full bg-primary"></div>
                <div className="absolute right-0 -top-6 text-xs font-medium bg-primary text-white px-1 rounded">
                  13/20
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Records Links */}
        <div className="px-4 space-y-2.5 mt-2">
          <ProfileOption
            icon={<FileCheck className="h-5 w-5 text-teal-400" />}
            label="Account change records"
            to="/account-records"
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
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
