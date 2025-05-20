
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from "@/components/layout/MobileLayout";
import ProfileOption from "@/components/ProfileOption";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowUpCircle, ArrowDownCircle, FileText, LogOut, 
  Wallet, Star, ListTree, CreditCard, Settings, Eye, EyeOff,
  IndianRupee, BadgeIndianRupee, Download
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';

const getRandomAvatarUrl = () => {
  // Generate a random seed for the avatar
  const seed = Math.floor(Math.random() * 1000);
  return `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}`;
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.name || '');
  const [isLoading, setIsLoading] = useState(true);
  const [hideRevenue, setHideRevenue] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const navigate = useNavigate();

  // Only generate avatar once user data is available
  useEffect(() => {
    // Set loading state based on user availability
    if (!user) {
      setIsLoading(true);
      return;
    }
    
    setIsLoading(false);
    
    if (user.name) {
      // Get random avatar
      const newAvatarUrl = getRandomAvatarUrl();
      
      const img = new Image();
      img.src = newAvatarUrl;
      img.onload = () => {
        setAvatarUrl(newAvatarUrl);
      };
      img.onerror = () => {
        // Fallback to a default avatar
        setAvatarUrl('https://api.dicebear.com/6.x/avataaars/svg?seed=default');
      };
    }
  }, [user?.name]);

  const toggleRevenueVisibility = () => {
    setHideRevenue(!hideRevenue);
  };
  
  const toggleBalanceVisibility = () => {
    setHideBalance(!hideBalance);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Get today's income from API response
  const todayIncome = user?.today_income || 0; 
  // Get total income from API response
  const totalIncome = user?.total_income || user?.income || 0;
  // Get deposit balance
  const depositBalance = user?.wallet || 0;
  
  return (
    <MobileLayout>
      <div className="animate-fade-in space-y-4 pb-24">
        {/* User Profile Header */}
        <div className="relative px-5 pt-4 pb-2 flex items-center">
          {isLoading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-14 h-14 rounded-full bg-secondary/40"></div>
              <div>
                <div className="h-4 w-24 bg-secondary/40 rounded mb-2"></div>
                <div className="h-5 w-32 bg-secondary/40 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-14 h-14 border-2 border-primary/30">
                  <AvatarImage 
                    src={avatarUrl} 
                    alt={user?.name || ''} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/20">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Trader {user?.id}</span>
                    <span className="text-sm font-medium">{user?.phone}</span>
                  </div>
                  {user?.rank && (
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {user.rank}
                    </div>
                  )}
                </div>
                <h2 className="text-base font-bold">{user?.name || 'Nexbit User'}</h2>
              </div>
            </div>
          )}
          
          {/* Settings icon */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-primary bg-primary/10 border border-primary/20">
              <Settings size={18} />
            </div>
          </div>
        </div>
        
        {/* Available Balance Display with Deposit Balance */}
        <div className="px-4">
          <Card className="bg-gradient-to-br from-sky-50/5 to-blue-100/10 border border-blue-200/20 overflow-hidden">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 w-32 bg-secondary/40 rounded mb-2"></div>
                  <div className="h-8 w-40 bg-secondary/40 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
                    <button 
                      onClick={toggleBalanceVisibility}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-normal">₹</span>
                    <span className="text-3xl font-semibold ml-1 text-gradient">
                      {hideBalance ? "********" : user?.income ? parseFloat(user?.income).toLocaleString() : '0.00'}
                    </span>
                  </div>
                  
                  {/* Deposit Balance Card - Attractive Design */}
                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/20 border-2 border-blue-500/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <BadgeIndianRupee size={18} className="text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Deposit Balance</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                          {hideBalance ? "********" : `₹${parseFloat(depositBalance.toString()).toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="px-4 grid grid-cols-3 gap-2">
          <button 
            className="bg-primary text-white rounded-md py-3 font-medium text-sm shadow-lg shadow-primary/30"
            onClick={() => navigate('/deposit')}
          >
            Recharge
          </button>
          <button 
            className="bg-secondary border border-blue-300/20 rounded-md py-3 font-medium text-sm"
            onClick={() => navigate('/withdraw')}
          >
            Withdraw
          </button>
          <button 
            className="bg-secondary border border-blue-300/20 rounded-md py-3 font-medium text-sm"
            onClick={() => navigate('/transactions')}
          >
            Details
          </button>
        </div>
        
        {/* Revenue Stats with Eye Icon - Updated with today_income and total_income */}
        <div className="mx-4 mt-4 rounded-xl overflow-hidden bg-gradient-to-b from-blue-50/10 to-blue-100/20 border border-blue-200/30">
          {isLoading ? (
            <div className="p-4 pb-2 animate-pulse">
              <div className="h-4 w-32 bg-secondary/40 rounded mb-3"></div>
              <div className="h-8 w-40 bg-secondary/40 rounded mb-4"></div>
              <div className="grid grid-cols-3 gap-2 mt-3 border-t border-blue-200/20 pt-2">
                <div className="text-center">
                  <div className="h-3 w-20 bg-secondary/40 rounded mx-auto mb-2"></div>
                  <div className="h-4 w-16 bg-secondary/40 rounded mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-3 w-20 bg-secondary/40 rounded mx-auto mb-2"></div>
                  <div className="h-4 w-16 bg-secondary/40 rounded mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-3 w-20 bg-secondary/40 rounded mx-auto mb-2"></div>
                  <div className="h-4 w-16 bg-secondary/40 rounded mx-auto"></div>
                </div>
              </div>
            </div>
          ) : (
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
                {hideRevenue ? "******₹" : `${totalIncome}₹`}
              </h2>
              
              {/* Income Breakdown - Updated with today_income from API */}
              <div className="grid grid-cols-3 gap-2 mt-3 border-t border-blue-200/20 pt-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Yesterday's</p>
                  <p className="font-semibold">
                    {hideRevenue ? "****₹" : `${user?.yesterday_income || '0.00'}₹`}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Today's income</p>
                  <p className="font-semibold">
                    {hideRevenue ? "****₹" : `${todayIncome}₹`}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="font-semibold">
                    {hideRevenue ? "******₹" : `${user?.salary || '0.00'}₹`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Options */}
        <div className="px-4 space-y-2.5 mt-2">
          <h3 className="text-sm font-semibold text-muted-foreground ml-1 mb-1">Account</h3>
          
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
          
          <ProfileOption
            icon={<Wallet className="h-5 w-5 text-amber-400" />}
            label="USDT Withdrawal"
            to="/usdt-withdraw"
          />
          
          <h3 className="text-sm font-semibold text-muted-foreground ml-1 mt-4 mb-1">Records</h3>
          
          <ProfileOption
            icon={<IndianRupee className="h-5 w-5 text-teal-400" />}
            label="Salary Records"
            to="/salary-record"
          />
          
          <ProfileOption
            icon={<ListTree className="h-5 w-5 text-violet-400" />}
            label="Transaction Record"
            to="/transactions"
          />
          
          <ProfileOption
            icon={<FileText className="h-5 w-5 text-amber-400" />}
            label="Contract Record"
            to="/contract-record"
          />
          
          <ProfileOption
            icon={<CreditCard className="h-5 w-5 text-emerald-400" />}
            label="Bank info"
            to="/bank"
          />
          
          <ProfileOption
            icon={<ArrowDownCircle className="h-5 w-5 text-blue-400" />}
            label="Withdrawal History"
            to="/all-withdrawals"
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
          
          <div
            onClick={handleLogout}
            className="flex items-center p-3 rounded-xl bg-red-50/10 hover:bg-red-500/10 cursor-pointer transition-colors mt-4"
          >
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
              <LogOut className="h-5 w-5 text-red-400" />
            </div>
            <span>Log out</span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
