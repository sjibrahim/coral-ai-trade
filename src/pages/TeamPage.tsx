
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
      <Card key={member.id} className="mb-3 bg-[#1A1F2C] border-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-base">{member.phone}</p>
                <p className="text-xs text-muted-foreground">
                  {member.active_member === "1" ? "Active" : "Inactive"} member
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Contribution</p>
              <p className="font-medium">₹{parseFloat(member.total_deposit).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <MobileLayout title="Team">
      <div className="p-4 animate-fade-in">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Team Overview Card */}
            <Card className="mb-6 bg-[#1A1F2C] border-none shadow-lg overflow-hidden">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-1">Team Overview</h2>
                <p className="text-sm text-muted-foreground mb-4">Track your team growth</p>
                
                <div className="grid grid-cols-3 gap-1 mt-4">
                  <div className="text-center p-3 border-r border-white/10">
                    <p className="text-sm text-muted-foreground mb-2">L1</p>
                    <p className="text-xl font-bold">
                      <span className="text-blue-400">{activeLevel1}</span>/{level1Members.length}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 border-r border-white/10">
                    <p className="text-sm text-muted-foreground mb-2">L2</p>
                    <p className="text-xl font-bold">
                      <span className="text-blue-400">{activeLevel2}</span>/{level2Members.length}
                    </p>
                  </div>
                  
                  <div className="text-center p-3">
                    <p className="text-sm text-muted-foreground mb-2">L3</p>
                    <p className="text-xl font-bold">
                      <span className="text-blue-400">{activeLevel3}</span>/{level3Members.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Team Tabs */}
            <Tabs defaultValue="level1" className="mb-6">
              <TabsList className="grid grid-cols-3 mb-4 bg-[#1A1F2C]">
                <TabsTrigger value="level1" className="data-[state=active]:bg-blue-500">Level 1</TabsTrigger>
                <TabsTrigger value="level2" className="data-[state=active]:bg-blue-500">Level 2</TabsTrigger>
                <TabsTrigger value="level3" className="data-[state=active]:bg-blue-500">Level 3</TabsTrigger>
              </TabsList>
              
              <TabsContent value="level1">
                <Card className="mb-4 bg-[#1A1F2C] border-none">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Level 1</h3>
                      <p className="text-sm text-muted-foreground">{generalSettings?.level_1_commission || '10'}% Commission</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Members</p>
                      <p className="text-lg font-semibold">
                        <span className="text-blue-400">{activeLevel1}</span>/{level1Members.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {level1Members.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-blue-400/70" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No members yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">Invite friends to build your team</p>
                    <Button onClick={() => setInvitePopupOpen(true)}>
                      <Share2 className="mr-2 h-4 w-4" /> Invite Friends
                    </Button>
                  </div>
                ) : (
                  <>
                    {level1Members.map(renderMemberCard)}
                    <Button 
                      variant="outline" 
                      className="w-full mt-2" 
                      onClick={() => setInvitePopupOpen(true)}
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Invite More Friends
                    </Button>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="level2">
                <Card className="mb-4 bg-[#1A1F2C] border-none">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Level 2</h3>
                      <p className="text-sm text-muted-foreground">{generalSettings?.level_2_commission || '5'}% Commission</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Members</p>
                      <p className="text-lg font-semibold">
                        <span className="text-blue-400">{activeLevel2}</span>/{level2Members.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {level2Members.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-blue-400/70" />
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
                <Card className="mb-4 bg-[#1A1F2C] border-none">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Level 3</h3>
                      <p className="text-sm text-muted-foreground">{generalSettings?.level_3_commission || '2'}% Commission</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Members</p>
                      <p className="text-lg font-semibold">
                        <span className="text-blue-400">{activeLevel3}</span>/{level3Members.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {level3Members.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-blue-400/70" />
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
            <Card className="bg-[#1A1F2C] border-none shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Referral Code</h3>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-md mb-4">
                  <p className="font-medium">{user?.referral_code || 'INVITE123'}</p>
                  <Button variant="ghost" size="sm" onClick={() => setInvitePopupOpen(true)}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p className="mb-2">• {generalSettings?.level_1_commission || '10'}% commission on level 1 referrals</p>
                  <p className="mb-2">• {generalSettings?.level_2_commission || '5'}% commission on level 2 referrals</p>
                  <p className="mb-2">• {generalSettings?.level_3_commission || '2'}% commission on level 3 referrals</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <InvitePopup isOpen={invitePopupOpen} onClose={() => setInvitePopupOpen(false)} />
    </MobileLayout>
  );
};

export default TeamPage;
