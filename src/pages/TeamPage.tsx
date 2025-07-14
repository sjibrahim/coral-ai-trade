import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Share2, Trophy, Target, Star, Gift, Crown, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import InvitePopup from "@/components/InvitePopup";
import { useTeam } from "@/hooks/use-team";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TeamPage = () => {
  const [invitePopupOpen, setInvitePopupOpen] = useState(false);
  const { user, generalSettings } = useAuth();
  const { 
    level1Members, 
    level2Members, 
    level3Members, 
    activeLevel1,
    activeLevel2,
    activeLevel3,
    isLoading, 
    fetchTeamDetails 
  } = useTeam();
  
  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);
  
  // Function to render team member card with unique design
  const renderMemberCard = (member: any, level: number) => {
    const levelColors = {
      1: "from-emerald-400 to-teal-500",
      2: "from-blue-400 to-cyan-500", 
      3: "from-purple-400 to-pink-500"
    };
    
    const levelBadges = {
      1: <Crown className="h-3 w-3" />,
      2: <Trophy className="h-3 w-3" />,
      3: <Star className="h-3 w-3" />
    };

    return (
      <Card key={member.id} className="mb-2 bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${levelColors[level]} flex items-center justify-center shadow-sm`}>
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <p className="font-medium text-gray-800 text-xs">{member.phone}</p>
                  <div className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    member.active_member === "1" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {levelBadges[level]}
                    <span className="ml-1 text-xs">{member.active_member === "1" ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">Contribution</p>
              <p className="font-bold text-emerald-600 text-sm">₹{parseFloat(member.total_deposit).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <MobileLayout title="Team Network" showBackButton>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
        <div className="px-3 py-4">
          {/* Hero Section */}
          <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-4 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-white/10 transform -translate-x-4 translate-y-4"></div>
            
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                  <Zap className="h-4 w-4" />
                </div>
                <h1 className="text-lg font-bold">Trexo Network</h1>
              </div>
              <p className="text-emerald-100 text-xs mb-4">Build your trading empire</p>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Level 1", active: activeLevel1, total: level1Members.length, color: "bg-yellow-400" },
                  { label: "Level 2", active: activeLevel2, total: level2Members.length, color: "bg-blue-400" },
                  { label: "Level 3", active: activeLevel3, total: level3Members.length, color: "bg-purple-400" }
                ].map((level, idx) => (
                  <div key={idx} className="bg-white/15 rounded-xl p-2 backdrop-blur-sm">
                    <div className={`h-2 w-2 rounded-full ${level.color} mx-auto mb-1`}></div>
                    <p className="text-white/90 text-xs font-medium">{level.label}</p>
                    <p className="text-white text-lg font-bold">{level.active}/{level.total}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commission Cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { level: "L1", rate: generalSettings?.level_1_commission || '10', color: "from-emerald-400 to-teal-500", icon: Crown },
              { level: "L2", rate: generalSettings?.level_2_commission || '5', color: "from-blue-400 to-cyan-500", icon: Trophy },
              { level: "L3", rate: generalSettings?.level_3_commission || '2', color: "from-purple-400 to-pink-500", icon: Star }
            ].map((item, idx) => (
              <Card key={idx} className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-3 text-center">
                  <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-1`}>
                    <item.icon className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{item.level} Commission</p>
                  <p className="text-sm font-bold text-gray-800">{item.rate}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              {/* Team Members Tabs */}
              <Tabs defaultValue="level1" className="space-y-3">
                <TabsList className="grid grid-cols-3 bg-white/80 backdrop-blur-sm border-0 shadow-sm h-9">
                  <TabsTrigger value="level1" className="text-xs data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-md">
                    Direct ({level1Members.length})
                  </TabsTrigger>
                  <TabsTrigger value="level2" className="text-xs data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md">
                    Network ({level2Members.length})
                  </TabsTrigger>
                  <TabsTrigger value="level3" className="text-xs data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-md">
                    Extended ({level3Members.length})
                  </TabsTrigger>
                </TabsList>
                
                {[
                  { value: "level1", members: level1Members, title: "Direct Referrals", description: "Your personally invited members" },
                  { value: "level2", members: level2Members, title: "Network Referrals", description: "Members invited by your direct referrals" },
                  { value: "level3", members: level3Members, title: "Extended Network", description: "Third level network members" }
                ].map((tab, idx) => (
                  <TabsContent key={idx} value={tab.value} className="space-y-3">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border-0 shadow-sm">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">{tab.title}</h3>
                      <p className="text-xs text-gray-600">{tab.description}</p>
                    </div>
                    
                    {tab.members.length === 0 ? (
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                        <CardContent className="p-6 text-center">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-3">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="font-medium text-gray-800 text-sm mb-1">No members yet</h3>
                          <p className="text-xs text-gray-600 mb-4">Start growing your Trexo network</p>
                          {idx === 0 && (
                            <Button 
                              onClick={() => setInvitePopupOpen(true)}
                              size="sm"
                              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs px-4 py-2 h-8"
                            >
                              <Share2 className="mr-1 h-3 w-3" />
                              Invite Now
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        <div className="space-y-2">
                          {tab.members.map(member => renderMemberCard(member, idx + 1))}
                        </div>
                        {idx === 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-xs h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50" 
                            onClick={() => setInvitePopupOpen(true)}
                          >
                            <Share2 className="mr-1 h-3 w-3" />
                            Invite More
                          </Button>
                        )}
                      </>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
              
              {/* Referral Code Section */}
              <Card className="mt-4 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-2">
                      <Gift className="h-3 w-3 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">Your Referral Code</h3>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-emerald-100 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-bold text-emerald-600">{user?.referral_code || 'TREXO123'}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setInvitePopupOpen(true)}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 w-8 p-0"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setInvitePopupOpen(true)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs h-8"
                  >
                    <Target className="mr-1 h-3 w-3" />
                    Expand Network
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      
      <InvitePopup isOpen={invitePopupOpen} onClose={() => setInvitePopupOpen(false)} />
    </MobileLayout>
  );
};

export default TeamPage;