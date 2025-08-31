
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";

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

// New interface for the API response format you showed
interface ApiTeamMember {
  id: string;
  name: string;
  phone: string;
  invited_by: string;
  level: string;
  active_member: string;
  total_deposit: string;
  total_withdraw: string;
}

const TeamPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [apiTeamMembers, setApiTeamMembers] = useState<ApiTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await getTeamDetails(token);
        if (response.status && response.data) {
          // Check if response.data is an array (new format) or object (old format)
          if (Array.isArray(response.data)) {
            setApiTeamMembers(response.data);
            // Create summary data from the array
            const total_members = response.data.length;
            const direct_members = response.data.filter(member => member.level === "1").length;
            const total_commission = response.data.reduce((sum, member) => 
              sum + parseFloat(member.total_deposit || "0"), 0
            ).toString();
            
            setTeamData({
              total_members,
              direct_members,
              total_commission,
              referral_code: user?.referral_code || "REF12345",
              team_members: []
            });
          } else {
            setTeamData(response.data);
            setApiTeamMembers([]);
          }
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
  }, [toast, user]);

  const copyReferralCode = () => {
    const referralCode = user?.referral_code || teamData?.referral_code;
    if (referralCode) {
      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${referralCode}`);
      toast({
        title: "Success",
        description: "Referral link copied to clipboard!",
      });
    }
  };

  const shareReferralCode = () => {
    const referralCode = user?.referral_code || teamData?.referral_code;
    if (referralCode && navigator.share) {
      navigator.share({
        title: 'Join my trading team',
        text: 'Start trading crypto with my referral link!',
        url: `${window.location.origin}/register?ref=${referralCode}`,
      });
    } else {
      copyReferralCode();
    }
  };

  // Calculate level statistics from API data
  const level1Members = apiTeamMembers.filter(member => member.level === "1");
  const level2Members = apiTeamMembers.filter(member => member.level === "2");
  const level3Members = apiTeamMembers.filter(member => member.level === "3");

  const handleLevelClick = (level: number) => {
    navigate(`/team-level/${level}`);
  };

  const referralCode = user?.referral_code || teamData?.referral_code;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Team Network</span>
              <p className="text-xs text-gray-400">Build Your Community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="pb-32">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10"></div>
            <div className="relative px-4 py-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">{teamData?.total_members || apiTeamMembers.length || 0}</p>
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
                      <p className="text-xl font-bold text-white">₹{teamData?.total_commission || 0}</p>
                      <p className="text-xs text-gray-400">Total Earned</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Code Section */}
              {referralCode && (
                <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl p-4 border border-teal-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-teal-400" />
                      <span className="font-semibold text-white text-sm">Your Referral Code</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyReferralCode}
                        size="sm"
                        className="bg-gray-700 hover:bg-gray-600 text-white border-0 h-8 px-3 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        onClick={shareReferralCode}
                        size="sm"
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 h-8 px-3 text-xs"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-center">
                    <span className="text-teal-400 font-bold text-base tracking-wider break-all">{referralCode}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team Levels Section */}
          <div className="px-4 py-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <Crown className="w-5 h-5 text-yellow-400 mr-2" />
              Team Levels
            </h2>
            
            <div className="space-y-3">
              {[
                { 
                  level: 1, 
                  members: level1Members.length, 
                  commission: "10%", 
                  color: "from-yellow-400 to-orange-500",
                  activeMembers: level1Members.filter(m => m.active_member === "1").length
                },
                { 
                  level: 2, 
                  members: level2Members.length, 
                  commission: "0%", 
                  color: "from-blue-400 to-purple-500",
                  activeMembers: level2Members.filter(m => m.active_member === "1").length
                },
                { 
                  level: 3, 
                  members: level3Members.length, 
                  commission: "0%", 
                  color: "from-green-400 to-teal-500",
                  activeMembers: level3Members.filter(m => m.active_member === "1").length
                },
              ].map((item) => (
                <Card 
                  key={item.level} 
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer"
                  onClick={() => handleLevelClick(item.level)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r", item.color)}>
                          <span className="text-white font-bold text-sm">{item.level}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">Level {item.level}</h3>
                          <p className="text-xs text-gray-400">{item.members} members ({item.activeMembers} active)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-base font-bold text-white">{item.commission}</div>
                          <div className="text-xs text-gray-400">Commission</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Members List */}
          {apiTeamMembers.length > 0 && (
            <div className="px-4 pb-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <UserPlus className="w-5 h-5 text-teal-400 mr-2" />
                Recent Members
              </h2>
              
              <div className="space-y-2">
                {apiTeamMembers.slice(0, 5).map((member) => (
                  <Card key={member.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-xs">
                              {member.phone.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-white text-sm truncate">{member.phone}</h4>
                            <p className="text-xs text-gray-400">Level {member.level}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-semibold text-green-400">₹{member.total_deposit}</div>
                          <div className="text-xs text-gray-500">
                            {member.active_member === "1" ? "Active" : "Inactive"}
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
          <div className="px-4 pb-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
              <CardContent className="p-4">
                <h3 className="text-base font-bold text-white mb-4 flex items-center">
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
                    <div key={index} className="flex items-start gap-3">
                      <benefit.icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", benefit.color)} />
                      <span className="text-gray-300 text-sm leading-relaxed">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default TeamPage;
