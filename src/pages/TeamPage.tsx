import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getTeamDetails } from "@/services/api";
import { 
  Users, Share2, Copy, Crown, Star, 
  TrendingUp, Award, DollarSign, UserPlus,
  ChevronRight, Gift, Target, Zap, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNavigation from "@/components/BottomNavigation";

interface TeamMember {
  id: number;
  username: string;
  email: string;
  level: number;
  total_income: string;
  registration_date: string;
}

interface TeamData {
  total_members: number;
  direct_members: number;
  total_commission: string;
  referral_code: string;
  team_members: TeamMember[];
}

const TeamPage = () => {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await getTeamDetails(token);
        if (response.status && response.data) {
          setTeamData(response.data);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch team details.",
          });
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
        toast({
          title: "Error",
          description: "Failed to connect to the server.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [toast]);

  const copyReferralCode = () => {
    if (teamData?.referral_code) {
      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${teamData.referral_code}`);
      toast({
        title: "Success",
        description: "Referral link copied to clipboard!",
      });
    }
  };

  const shareReferralCode = () => {
    if (teamData?.referral_code && navigator.share) {
      navigator.share({
        title: 'Join my trading team',
        text: 'Start trading crypto with my referral link!',
        url: `${window.location.origin}/register?ref=${teamData.referral_code}`,
      });
    } else {
      copyReferralCode();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="text-lg font-bold text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Team Network</span>
              <p className="text-xs text-gray-400">Build Your Community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pb-28 min-h-0 flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10"></div>
          <div className="relative px-4 py-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Build Your Empire</h1>
              <p className="text-gray-300 text-sm">Invite friends and earn commissions together</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{teamData?.total_members || 0}</p>
                    <p className="text-xs text-gray-400">Total Members</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">₹{teamData?.total_commission || 0}</p>
                    <p className="text-xs text-gray-400">Total Earned</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Code Section */}
            {teamData?.referral_code && (
              <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl p-4 border border-teal-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-teal-400" />
                    <span className="font-semibold text-white">Your Referral Code</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyReferralCode}
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600 text-white border-0 h-8 px-3"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      onClick={shareReferralCode}
                      size="sm"
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 h-8 px-3"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-center">
                  <span className="text-teal-400 font-bold text-lg tracking-wider">{teamData.referral_code}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Team Levels Section */}
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Crown className="w-6 h-6 text-yellow-400 mr-2" />
            Team Levels
          </h2>
          
          <div className="space-y-3">
            {[
              { level: 1, members: teamData?.direct_members || 0, commission: "10%", color: "from-yellow-400 to-orange-500" },
              { level: 2, members: Math.max(0, (teamData?.total_members || 0) - (teamData?.direct_members || 0)), commission: "5%", color: "from-blue-400 to-purple-500" },
              { level: 3, members: 0, commission: "3%", color: "from-green-400 to-teal-500" },
            ].map((item) => (
              <Card key={item.level} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r", item.color)}>
                        <span className="text-white font-bold">{item.level}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Level {item.level}</h3>
                        <p className="text-sm text-gray-400">{item.members} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{item.commission}</div>
                      <div className="text-xs text-gray-400">Commission</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Members List */}
        {teamData?.team_members && teamData.team_members.length > 0 && (
          <div className="px-4 pb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <UserPlus className="w-6 h-6 text-teal-400 mr-2" />
              Recent Members
            </h2>
            
            <div className="space-y-2">
              {teamData.team_members.slice(0, 5).map((member) => (
                <Card key={member.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {member.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm">{member.username}</h4>
                          <p className="text-xs text-gray-400">Level {member.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-400">₹{member.total_income}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(member.registration_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="px-4 pb-12">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Gift className="w-5 h-5 text-purple-400 mr-2" />
                Referral Benefits
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Target, text: "Earn up to 10% commission on direct referrals", color: "text-green-400" },
                  { icon: Zap, text: "Get bonus rewards for active team members", color: "text-yellow-400" },
                  { icon: Award, text: "Unlock VIP status with team milestones", color: "text-purple-400" },
                  { icon: TrendingUp, text: "Build passive income with your network", color: "text-blue-400" },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <benefit.icon className={cn("w-5 h-5", benefit.color)} />
                    <span className="text-gray-300 text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TeamPage;
