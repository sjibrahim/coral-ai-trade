
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Share2, Target, Gift, Zap, TrendingUp, Award, Home, BarChart3, Wallet, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import InvitePopup from "@/components/InvitePopup";
import { useTeam } from "@/hooks/use-team";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamStatsCard from "@/components/team/TeamStatsCard";
import CommissionCard from "@/components/team/CommissionCard";
import MemberCard from "@/components/team/MemberCard";
import { Link } from "react-router-dom";

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
  
  return (
    <MobileLayout title="Team Network" hideFooter>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 space-y-4 pb-24">
          {/* Hero Stats */}
          <TeamStatsCard
            activeLevel1={activeLevel1}
            activeLevel2={activeLevel2}
            activeLevel3={activeLevel3}
            level1Total={level1Members.length}
            level2Total={level2Members.length}
            level3Total={level3Members.length}
          />

          {/* Commission Rates */}
          <CommissionCard
            level1Commission={generalSettings?.level_1_commission || '10'}
            level2Commission={generalSettings?.level_2_commission || '5'}
            level3Commission={generalSettings?.level_3_commission || '2'}
          />
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              {/* Team Members Tabs */}
              <Tabs defaultValue="level1" className="space-y-4">
                <TabsList className="grid grid-cols-3 bg-white/80 backdrop-blur-sm border-0 shadow-sm h-10">
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
                    <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-sm">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">{tab.title}</h3>
                        <p className="text-xs text-gray-600">{tab.description}</p>
                      </CardContent>
                    </Card>
                    
                    {tab.members.length === 0 ? (
                      <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-sm">
                        <CardContent className="p-6 text-center">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-3">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="font-medium text-gray-800 text-sm mb-1">No members yet</h3>
                          <p className="text-xs text-gray-600 mb-4">Start growing your network</p>
                          {idx === 0 && (
                            <Button 
                              onClick={() => setInvitePopupOpen(true)}
                              size="sm"
                              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs px-4 py-2 h-8"
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
                          {tab.members.map(member => (
                            <MemberCard key={member.id} member={member} level={idx + 1} />
                          ))}
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
              
              {/* Enhanced Referral Code Section */}
              <Card className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 border border-emerald-200/50 shadow-lg">
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
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs h-8"
                  >
                    <Target className="mr-1 h-3 w-3" />
                    Expand Network
                  </Button>
                </CardContent>
              </Card>

              {/* Benefits Section */}
              <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                    Network Benefits
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: TrendingUp, title: "Passive Income", desc: "Earn from every trade" },
                      { icon: Award, title: "VIP Rewards", desc: "Unlock special benefits" },
                      { icon: Users, title: "Team Growth", desc: "Build your empire" },
                      { icon: Gift, title: "Bonus Rates", desc: "Higher commissions" }
                    ].map((benefit, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 text-center border border-gray-200">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <benefit.icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-xs font-medium text-gray-800 mb-1">{benefit.title}</p>
                        <p className="text-xs text-gray-600">{benefit.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-2xl z-50">
          <div className="flex items-center justify-around py-2 px-4">
            {[
              { icon: Home, label: "Home", path: "/" },
              { icon: BarChart3, label: "Market", path: "/market" },
              { icon: Wallet, label: "Wallet", path: "/deposit" },
              { icon: Users, label: "Team", path: "/team", active: true },
              { icon: User, label: "Profile", path: "/profile" }
            ].map((item, idx) => (
              <Link 
                key={idx}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                  item.active 
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg" 
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? "text-white" : ""}`} />
                <span className={`text-xs font-medium ${item.active ? "text-white" : ""}`}>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <InvitePopup isOpen={invitePopupOpen} onClose={() => setInvitePopupOpen(false)} />
    </MobileLayout>
  );
};

export default TeamPage;
