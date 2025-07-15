import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Gift, Trophy, Star, Calendar } from "lucide-react";

const RewardsPage = () => {
  // Sample rewards data
  const rewards = [
    { id: 'RWD23456', name: 'Daily Check-In', amount: 5, date: '2023-05-04', type: 'Check-In' },
    { id: 'RWD23457', name: 'Invite Reward', amount: 50, date: '2023-05-02', type: 'Referral' },
    { id: 'RWD23458', name: 'Trading Bonus', amount: 25, date: '2023-04-30', type: 'Trading' },
    { id: 'RWD23459', name: 'Weekly Bonus', amount: 100, date: '2023-04-27', type: 'Bonus' },
    { id: 'RWD23460', name: 'Lucky Draw', amount: 200, date: '2023-04-25', type: 'Lucky Draw' },
  ];
  
  return (
    <MobileLayout showBackButton title="Rewards">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Total Rewards */}
        <div className="bg-card rounded-xl p-5 mb-4">
          <p className="text-center text-muted-foreground mb-1">Total Rewards</p>
          <p className="text-center text-4xl font-semibold">₹380</p>
        </div>
        
        {/* Rewards Records */}
        {rewards.map((reward) => (
          <div 
            key={reward.id}
            className="bg-card rounded-xl p-5 border border-border/40"
          >
            <div className="flex justify-between mb-2">
              <p className="text-lg font-medium">{reward.name}</p>
              <p className="text-primary font-medium">
                {reward.type}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-semibold text-market-increase">+₹{reward.amount}</p>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <div>
                <p>Reward ID</p>
                <p>{reward.id}</p>
              </div>
              <div className="text-right">
                <p>Date</p>
                <p>{reward.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default RewardsPage;
