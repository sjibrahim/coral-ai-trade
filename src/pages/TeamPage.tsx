
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import InvitePopup from "@/components/InvitePopup";

const TeamPage = () => {
  const [invitePopupOpen, setInvitePopupOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <MobileLayout title="Team">
      <div className="p-4 animate-fade-in">
        {/* Team Stats Card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-semibold">0</p>
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
              </h3>
              
              <div className="text-center py-10 text-muted-foreground">
                <p>No members yet</p>
                <p className="text-sm mt-1">Invite friends to grow your team</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" /> Level 2 Members
              </h3>
              
              <div className="text-center py-10 text-muted-foreground">
                <p>No members yet</p>
                <p className="text-sm mt-1">Grow your Level 1 team to get Level 2 members</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" /> Level 3 Members
              </h3>
              
              <div className="text-center py-10 text-muted-foreground">
                <p>No members yet</p>
                <p className="text-sm mt-1">Grow your Level 2 team to get Level 3 members</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <InvitePopup isOpen={invitePopupOpen} onClose={() => setInvitePopupOpen(false)} />
    </MobileLayout>
  );
};

export default TeamPage;
