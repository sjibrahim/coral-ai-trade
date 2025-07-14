import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Share2, ChevronRight, Calendar } from "lucide-react";
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
    totalTeamSize, 
    totalActiveMembers, 
    isLoading, 
    fetchTeamDetails 
  } = useTeam();
  
  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);
  
  // Function to render team member card
  const renderMemberCard = (member: any) => {
    return (
      <Card key={member.id} className="mb-3 bg-gradient-to-r from-emerald-50/10 to-green-50/10 border border-emerald-500/20 rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mr-3 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-base">{member.phone}</p>
                <p className="text-xs text-muted-foreground">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    member.active_member === "1" 
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}>
                    {member.active_member === "1" ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Contribution</p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{parseFloat(member.total_deposit).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <MobileLayout title="Team" showBackButton>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-4 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Trexo Team</h1>
            <p className="text-muted-foreground">Build and grow your trading network</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              {/* Team Overview Card */}
              <Card className="mb-6 bg-gradient-to-br from-emerald-500 to-green-600 border-none shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center text-white">
                    <h2 className="text-xl font-bold mb-1">Team Overview</h2>
                    <p className="text-emerald-100 text-sm mb-6">Your Trexo Network Growth</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="bg-white/20 rounded-lg p-3 mb-2">
                          <p className="text-emerald-100 text-xs mb-1">Level 1</p>
                          <p className="text-2xl font-bold text-white">
                            <span className="text-yellow-300">{activeLevel1}</span>/{level1Members.length}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-white/20 rounded-lg p-3 mb-2">
                          <p className="text-emerald-100 text-xs mb-1">Level 2</p>
                          <p className="text-2xl font-bold text-white">
                            <span className="text-yellow-300">{activeLevel2}</span>/{level2Members.length}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-white/20 rounded-lg p-3 mb-2">
                          <p className="text-emerald-100 text-xs mb-1">Level 3</p>
                          <p className="text-2xl font-bold text-white">
                            <span className="text-yellow-300">{activeLevel3}</span>/{level3Members.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Tabs */}
              <Tabs defaultValue="level1" className="mb-6">
                <TabsList className="grid grid-cols-3 mb-4 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
                  <TabsTrigger value="level1" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Level 1</TabsTrigger>
                  <TabsTrigger value="level2" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Level 2</TabsTrigger>
                  <TabsTrigger value="level3" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Level 3</TabsTrigger>
                </TabsList>
                
                <TabsContent value="level1">
                  <Card className="mb-4 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">Level 1 Direct</h3>
                        <p className="text-sm text-muted-foreground">{generalSettings?.level_1_commission || '10'}% Commission Rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Active Members</p>
                        <p className="text-lg font-semibold">
                          <span className="text-emerald-600 dark:text-emerald-400">{activeLevel1}</span>/{level1Members.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {level1Members.length === 0 ? (
                    <div className="text-center py-10 px-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-10 w-10 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Start Building Your Network</h3>
                      <p className="text-sm text-muted-foreground mb-6">Invite friends to join Trexo and earn commissions</p>
                      <Button 
                        onClick={() => setInvitePopupOpen(true)}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                      >
                        <Share2 className="mr-2 h-4 w-4" /> Invite to Trexo
                      </Button>
                    </div>
                  ) : (
                    <>
                      {level1Members.map(renderMemberCard)}
                      <Button 
                        variant="outline" 
                        className="w-full mt-4 border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20" 
                        onClick={() => setInvitePopupOpen(true)}
                      >
                        <Share2 className="mr-2 h-4 w-4" /> Invite More to Trexo
                      </Button>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="level2">
                  <Card className="mb-4 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">Level 2 Network</h3>
                        <p className="text-sm text-muted-foreground">{generalSettings?.level_2_commission || '5'}% Commission Rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Active Members</p>
                        <p className="text-lg font-semibold">
                          <span className="text-emerald-600 dark:text-emerald-400">{activeLevel2}</span>/{level2Members.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {level2Members.length === 0 ? (
                    <div className="text-center py-10 px-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-10 w-10 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No level 2 members yet</h3>
                      <p className="text-sm text-muted-foreground mb-6">When your direct referrals invite others, they'll appear here</p>
                    </div>
                  ) : (
                    <>
                      {level2Members.map(renderMemberCard)}
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="level3">
                  <Card className="mb-4 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">Level 3 Extended</h3>
                        <p className="text-sm text-muted-foreground">{generalSettings?.level_3_commission || '2'}% Commission Rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Active Members</p>
                        <p className="text-lg font-semibold">
                          <span className="text-emerald-600 dark:text-emerald-400">{activeLevel3}</span>/{level3Members.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {level3Members.length === 0 ? (
                    <div className="text-center py-10 px-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-10 w-10 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No level 3 members yet</h3>
                      <p className="text-sm text-muted-foreground">These are members invited by your level 2 referrals</p>
                    </div>
                  ) : (
                    <>
                      {level3Members.map(renderMemberCard)}
                    </>
                  )}
                </TabsContent>
              </Tabs>
              
              {/* Referral Info */}
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 shadow-lg mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Your Trexo Referral Code</h3>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-700 mb-4">
                    <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{user?.referral_code || 'TREXO123'}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setInvitePopupOpen(true)}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-2 mt-4">
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      Level 1: {generalSettings?.level_1_commission || '10'}% commission on direct referrals
                    </p>
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Level 2: {generalSettings?.level_2_commission || '5'}% commission on network referrals
                    </p>
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-300 rounded-full mr-2"></span>
                      Level 3: {generalSettings?.level_3_commission || '2'}% commission on extended network
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Invite Button */}
              <Button 
                size="lg" 
                className="w-full mb-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg"
                onClick={() => setInvitePopupOpen(true)}
              >
                <Share2 className="mr-2 h-4 w-4" /> Grow Your Trexo Network
              </Button>
            </>
          )}
        </div>
      </div>
      
      <InvitePopup isOpen={invitePopupOpen} onClose={() => setInvitePopupOpen(false)} />
    </MobileLayout>
  );
};

export default TeamPage;