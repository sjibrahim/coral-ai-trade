
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, CheckCircle, Clock, Coins, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const CheckinPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkedInDays, setCheckedInDays] = useState<number[]>([1, 2, 3]); // Mock checked days
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(3);

  // Daily rewards structure
  const dailyRewards = [
    { day: 1, reward: 10, type: 'coins', icon: Coins },
    { day: 2, reward: 15, type: 'coins', icon: Coins },
    { day: 3, reward: 20, type: 'coins', icon: Coins },
    { day: 4, reward: 25, type: 'coins', icon: Coins },
    { day: 5, reward: 30, type: 'coins', icon: Coins },
    { day: 6, reward: 50, type: 'coins', icon: Star },
    { day: 7, reward: 100, type: 'bonus', icon: Gift },
  ];

  const handleCheckin = () => {
    if (todayCheckedIn) return;

    const nextDay = currentStreak + 1;
    const reward = dailyRewards[nextDay - 1];
    
    setCheckedInDays(prev => [...prev, nextDay]);
    setTodayCheckedIn(true);
    setCurrentStreak(nextDay);

    toast({
      title: "Check-in Successful!",
      description: `You earned ${reward.reward} ${reward.type === 'bonus' ? 'bonus points' : 'coins'}!`,
    });

    // Reset streak if it's day 7
    if (nextDay === 7) {
      setTimeout(() => {
        setCurrentStreak(0);
        setCheckedInDays([]);
      }, 2000);
    }
  };

  const getNextReward = () => {
    const nextDay = currentStreak + 1;
    return dailyRewards[nextDay - 1] || dailyRewards[0];
  };

  const totalEarned = checkedInDays.reduce((total, day) => {
    return total + dailyRewards[day - 1].reward;
  }, 0);

  return (
    <MobileLayout showBackButton title="Daily Check-in" hideFooter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="p-4 space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 border-emerald-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-5 w-5 mr-2 text-emerald-400" />
                  <span className="text-emerald-300 text-sm">Current Streak</span>
                </div>
                <p className="text-2xl font-bold text-white">{currentStreak} days</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Coins className="h-5 w-5 mr-2 text-blue-400" />
                  <span className="text-blue-300 text-sm">Total Earned</span>
                </div>
                <p className="text-2xl font-bold text-white">{totalEarned}</p>
              </CardContent>
            </Card>
          </div>

          {/* Check-in Button */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <Calendar className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Daily Check-in</h2>
              <p className="text-gray-400 text-sm mb-6">
                Check in daily to earn rewards and maintain your streak!
              </p>
              
              <Button
                onClick={handleCheckin}
                disabled={todayCheckedIn}
                className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                  todayCheckedIn 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/25'
                }`}
              >
                {todayCheckedIn ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Checked In Today
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Gift className="w-5 h-5 mr-2" />
                    Check In (+{getNextReward().reward} {getNextReward().type === 'bonus' ? 'Bonus' : 'Coins'})
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Weekly Progress
              </h3>
              
              <div className="grid grid-cols-7 gap-2">
                {dailyRewards.map((reward, index) => {
                  const isChecked = checkedInDays.includes(reward.day);
                  const isCurrent = currentStreak === reward.day - 1 && !todayCheckedIn;
                  const Icon = reward.icon;
                  
                  return (
                    <div
                      key={reward.day}
                      className={`relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 transition-all duration-200 ${
                        isChecked 
                          ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/25' 
                          : isCurrent
                          ? 'bg-yellow-500/20 border-yellow-500 animate-pulse'
                          : 'bg-gray-700/50 border-gray-600'
                      }`}
                    >
                      {isChecked && (
                        <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-emerald-400 bg-gray-800 rounded-full" />
                      )}
                      <Icon className={`w-4 h-4 mb-1 ${
                        isChecked ? 'text-emerald-400' : isCurrent ? 'text-yellow-400' : 'text-gray-400'
                      }`} />
                      <span className={`text-xs font-semibold ${
                        isChecked ? 'text-emerald-400' : isCurrent ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {reward.reward}
                      </span>
                      <span className={`text-[10px] ${
                        isChecked ? 'text-emerald-300' : isCurrent ? 'text-yellow-300' : 'text-gray-500'
                      }`}>
                        Day {reward.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center text-blue-400 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Next reward: {getNextReward().reward} {getNextReward().type === 'bonus' ? 'bonus points' : 'coins'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Info */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-emerald-400 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Daily Check-in</p>
                    <p className="text-gray-400 text-xs">Check in every day to maintain your streak</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-400 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Earn Rewards</p>
                    <p className="text-gray-400 text-xs">Get increasing rewards each consecutive day</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Weekly Bonus</p>
                    <p className="text-gray-400 text-xs">Complete 7 days for a special bonus reward</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CheckinPage;
