
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Share2, Target, Gift, Zap, TrendingUp, Award, Crown, Trophy, Star, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import InvitePopup from "@/components/InvitePopup";
import { useTeam } from "@/hooks/use-team";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/BottomNavigation";

const TeamPage = () => {
  const [invitePopupOpen, setInvitePopupOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, generalSettings } = useAuth();
  const { 
    level1Members, 
    level2Members, 
    level3Members, 
    activeLevel1,
    activeLevel2,
    activeLevel3,
    totalTeamSize,
    totalActiveMembers,
    isLoading, 
    fetchTeamDetails 
  } = useTeam();
  
  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  const handleCopyCode = async () => {
    const referralCode = user?.referral_code || 'TREXO123';
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const levelConfig = [
    { 
      level: 1, 
      members: level1Members, 
      active: activeLevel1,
      title: "Direct Team", 
      description: "Your personally invited members",
      icon: Crown,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      commission: generalSettings?.level_1_commission || '10'
    },
    { 
      level: 2, 
      members: level2Members, 
      active: activeLevel2,
      title: "Network Team", 
      description: "Second level referrals",
      icon: Trophy,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      commission: generalSettings?.level_2_commission || '5'
    },
    { 
      level: 3, 
      members: level3Members, 
      active: activeLevel3,
      title: "Extended Network", 
      description: "Third level network",
      icon: Star,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      commission: generalSettings?.level_3_commission || '2'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <MobileLayout title="Team Network" hideFooter>
        {/* Content with proper bottom spacing */}
        <div className="pb-32">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10"></div>
            <div className="relative p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">My Network Empire</h1>
              <p className="text-gray-400 text-sm mb-6">Build your trading community and earn together</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
                  <p className="text-2xl font-bold text-teal-400">{totalTeamSize}</p>
                  <p className="text-xs text-gray-400">Total Members</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
                  <p className="text-2xl font-bold text-emerald-400">{totalActiveMembers}</p>
                  <p className="text-xs text-gray-400">Active Members</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
                  <p className="text-2xl font-bold text-yellow-400">3</p>
                  <p className="text-xs text-gray-400">Network Levels</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="p-4">
            <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Your Referral Code</h3>
                      <p className="text-xs text-gray-400">Share and earn rewards</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4 border border-gray-600/50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-bold text-teal-400">
                      {user?.referral_code || 'TREXO123'}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCopyCode}
                      className="text-gray-300 hover:text-white hover:bg-gray-600/50 h-8 w-8 p-0"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setInvitePopupOpen(true)}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white h-10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Invite & Earn
                </Button>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <>
              {/* Team Levels */}
              <div className="px-4 space-y-4">
                <h2 className="text-lg font-bold text-white mb-4">Network Levels</h2>
                
                {levelConfig.map((config) => (
                  <Card key={config.level} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center mr-3`}>
                            <config.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{config.title}</h3>
                            <p className="text-xs text-gray-400">{config.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-teal-400">{config.commission}%</p>
                          <p className="text-xs text-gray-400">Commission</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                          <p className="text-lg font-bold text-white">{config.members.length}</p>
                          <p className="text-xs text-gray-400">Total</p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                          <p className="text-lg font-bold text-emerald-400">{config.active}</p>
                          <p className="text-xs text-gray-400">Active</p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                          <p className="text-lg font-bold text-gray-300">
                            ₹{config.members.reduce((sum, member) => sum + parseFloat(member.total_deposit || '0'), 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">Volume</p>
                        </div>
                      </div>
                      
                      {config.members.length === 0 ? (
                        <div className="mt-4 text-center py-4">
                          <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Users className="w-6 h-6 text-gray-500" />
                          </div>
                          <p className="text-sm text-gray-400 mb-3">No members yet</p>
                          {config.level === 1 && (
                            <Button 
                              onClick={() => setInvitePopupOpen(true)}
                              size="sm"
                              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                            >
                              <Target className="mr-1 h-3 w-3" />
                              Start Inviting
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4">
                          <p className="text-xs text-gray-400 mb-2">Recent Members</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {config.members.slice(0, 3).map((member) => (
                              <div key={member.id} className="flex items-center justify-between bg-gray-700/20 rounded-lg p-2">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                                    <Users className="w-3 h-3 text-gray-300" />
                                  </div>
                                  <span className="text-sm text-gray-300">{member.phone}</span>
                                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                                    member.active_member === "1" 
                                      ? "bg-emerald-500/20 text-emerald-400" 
                                      : "bg-gray-500/20 text-gray-400"
                                  }`}>
                                    {member.active_member === "1" ? "Active" : "Inactive"}
                                  </span>
                                </div>
                                <span className="text-xs text-teal-400">
                                  ₹{parseFloat(member.total_deposit).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Benefits Section */}
              <div className="p-4 pb-8">
                <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                      Network Benefits
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: TrendingUp, title: "Passive Income", desc: "Earn from every trade", color: "text-emerald-400" },
                        { icon: Award, title: "VIP Status", desc: "Unlock special perks", color: "text-yellow-400" },
                        { icon: Users, title: "Team Building", desc: "Grow your network", color: "text-blue-400" },
                        { icon: Gift, title: "Bonus Rewards", desc: "Extra commissions", color: "text-purple-400" }
                      ].map((benefit, idx) => (
                        <div key={idx} className="bg-gray-700/30 rounded-lg p-3 text-center">
                          <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                          </div>
                          <p className="text-sm font-medium text-white mb-1">{benefit.title}</p>
                          <p className="text-xs text-gray-400">{benefit.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </MobileLayout>
      
      <BottomNavigation />
      <InvitePopup isOpen={invitePopupOpen} onClose={() => setInvitePopupOpen(false)} />
    </div>
  );
};

export default TeamPage;
