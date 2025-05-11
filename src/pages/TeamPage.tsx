
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Share2, Phone, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import InvitePopup from "@/components/InvitePopup";
import { useTeam } from "@/hooks/use-team";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TeamPage = () => {
  const [invitePopupOpen, setInvitePopupOpen] = useState(false);
  const { user, generalSettings } = useAuth();
  const { 
    level1Members, 
    level2Members, 
    level3Members, 
    totalTeamSize, 
    totalActiveMembers, 
    isLoading, 
    fetchTeamDetails 
  } = useTeam();
  
  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);
  
  // Function to render team members table
  const renderMembersTable = (members: any[]) => {
    if (members.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          <p>No members yet</p>
          <p className="text-sm mt-1">Invite friends to grow your team</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Deposit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="py-2">{member.name || 'User'}</TableCell>
                <TableCell className="py-2">{member.phone}</TableCell>
                <TableCell className="py-2">{member.active_member === "1" ? "Yes" : "No"}</TableCell>
                <TableCell className="py-2">₹{parseFloat(member.total_deposit).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
            {/* Team Stats Card */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="text-2xl font-semibold">{totalTeamSize}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Active Members</p>
                    <p className="text-2xl font-semibold">{totalActiveMembers}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setInvitePopupOpen(true)}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Invite Friends
                </Button>
              </CardContent>
            </Card>
            
            {/* Team Levels */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" /> Level 1 Members
                    <span className="ml-auto text-xs text-primary font-normal">
                      Commission: {generalSettings?.level_1_commission || '10'}%
                    </span>
                  </h3>
                  
                  {renderMembersTable(level1Members)}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" /> Level 2 Members
                    <span className="ml-auto text-xs text-primary font-normal">
                      Commission: {generalSettings?.level_2_commission || '5'}%
                    </span>
                  </h3>
                  
                  {renderMembersTable(level2Members)}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" /> Level 3 Members
                    <span className="ml-auto text-xs text-primary font-normal">
                      Commission: {generalSettings?.level_3_commission || '2'}%
                    </span>
                  </h3>
                  
                  {renderMembersTable(level3Members)}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      
      <InvitePopup isOpen={invitePopupOpen} onClose={() => setInvitePopupOpen(false)} />
    </MobileLayout>
  );
};

export default TeamPage;
