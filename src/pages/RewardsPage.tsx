
import { useState } from "react";
import { Award, Check, ChevronRight } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";

const RewardsPage = () => {
  const [activeTab, setActiveTab] = useState<"available" | "claimed">("available");
  
  return (
    <MobileLayout showBackButton title="Rewards">
      <div className="flex flex-col h-full p-4 max-w-md mx-auto">
        {/* Rewards Header */}
        <div className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 rounded-xl p-6 mb-6 shadow-lg border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Award className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-gradient">My Rewards</h1>
          </div>
          <p className="text-center text-sm text-gray-300 mb-3">Complete tasks to earn rewards</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-gray-300">Available</p>
              <p className="text-xl font-bold">₹1,200</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-gray-300">Claimed</p>
              <p className="text-xl font-bold">₹5,500</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex rounded-lg bg-secondary/50 p-1 mb-6">
          <button
            className={cn(
              "flex-1 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "available" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("available")}
          >
            Available
          </button>
          <button
            className={cn(
              "flex-1 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "claimed" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("claimed")}
          >
            Claimed
          </button>
        </div>
        
        {/* Rewards List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "available" ? (
            <>
              <RewardItem 
                title="Complete KYC" 
                amount={500} 
                status="ready" 
                description="Verify your identity to unlock trading features"
              />
              <RewardItem 
                title="Make First Deposit" 
                amount={300} 
                status="ready" 
                description="Deposit minimum ₹600 to receive bonus"
              />
              <RewardItem 
                title="7-Day Login Streak" 
                amount={200} 
                status="progress" 
                description="Login everyday for 7 days" 
                progress={5}
                progressMax={7}
              />
              <RewardItem 
                title="Refer 3 Friends" 
                amount={500} 
                status="progress" 
                description="Get ₹500 when 3 friends join" 
                progress={1}
                progressMax={3}
              />
            </>
          ) : (
            <>
              <RewardItem 
                title="Welcome Bonus" 
                amount={100} 
                status="claimed" 
                description="Sign-up bonus"
                claimedDate="2025-05-01"
              />
              <RewardItem 
                title="First Trade Bonus" 
                amount={200} 
                status="claimed" 
                description="Reward for first trade"
                claimedDate="2025-05-02"
              />
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

interface RewardItemProps {
  title: string;
  amount: number;
  status: 'ready' | 'progress' | 'claimed';
  description: string;
  progress?: number;
  progressMax?: number;
  claimedDate?: string;
}

const RewardItem = ({ title, amount, status, description, progress, progressMax, claimedDate }: RewardItemProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 mb-3 border border-border/40 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-full">
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-gradient-primary">₹{amount}</p>
        </div>
      </div>
      
      {status === 'progress' && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span>{progress}/{progressMax}</span>
          </div>
          <div className="w-full bg-secondary/40 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(progress! / progressMax!) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {status === 'ready' && (
        <button className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 text-white">
          Claim Now
        </button>
      )}
      
      {status === 'claimed' && (
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-1 text-green-400">
            <Check className="w-4 h-4" />
            <span>Claimed</span>
          </div>
          <span className="text-muted-foreground">{claimedDate}</span>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;
