
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Share2, ChevronRight, User, UserCheck, Copy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import InvitePopup from "@/components/InvitePopup";

const TeamPage = () => {
  const [invitePopupOpen, setInvitePopupOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <MobileLayout title="Team">
      <ScrollArea className="h-full">
        <div className="p-5 animate-fade-in space-y-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">My Team</h2>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-xs text-blue-100">Team Size</p>
                <p className="text-xl font-semibold">0</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-xs text-blue-100">Active</p>
                <p className="text-xl font-semibold">0</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-xs text-blue-100">Total Earn</p>
                <p className="text-xl font-semibold">$0</p>
              </div>
            </div>
            
            <Button 
              className="w-full bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => setInvitePopupOpen(true)}
            >
              <Share2 className="mr-2 h-4 w-4" /> Invite Friends
            </Button>
          </div>
          
          {/* Referral Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-primary" /> 
                Your Referral Code
              </h3>
              
              <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                <span className="font-mono font-medium">{user?.referral_code || "LOADING"}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(user?.referral_code || "");
                    toast({
                      title: "Copied to clipboard",
                      description: "Referral code copied to clipboard!",
                    });
                  }}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Team Levels with Cards */}
          <div className="space-y-5">
            {/* Level 1 */}
            <Card className="overflow-hidden">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Level 1 Team</h3>
                    <p className="text-xs text-muted-foreground">5% Commission</p>
                  </div>
                </div>
                <span className="text-xl font-bold">0</span>
              </div>
              
              <CardContent className="p-0">
                <div className="text-center py-10 text-muted-foreground">
                  <p>No members yet</p>
                  <p className="text-sm mt-1">Invite friends to grow your team</p>
                </div>
                
                {/* Uncomment and use this when you have team members
                <div className="divide-y">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <UserCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">User {index + 1}</p>
                          <p className="text-xs text-muted-foreground">Joined May 2025</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                */}
              </CardContent>
            </Card>
            
            {/* Level 2 */}
            <Card className="overflow-hidden">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Level 2 Team</h3>
                    <p className="text-xs text-muted-foreground">3% Commission</p>
                  </div>
                </div>
                <span className="text-xl font-bold">0</span>
              </div>
              
              <CardContent className="p-0">
                <div className="text-center py-10 text-muted-foreground">
                  <p>No members yet</p>
                  <p className="text-sm mt-1">Grow your Level 1 team to get Level 2 members</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Level 3 */}
            <Card className="overflow-hidden mb-6">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Level 3 Team</h3>
                    <p className="text-xs text-muted-foreground">1% Commission</p>
                  </div>
                </div>
                <span className="text-xl font-bold">0</span>
              </div>
              
              <CardContent className="p-0">
                <div className="text-center py-10 text-muted-foreground">
                  <p>No members yet</p>
                  <p className="text-sm mt-1">Grow your Level 2 team to get Level 3 members</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
      
      <InvitePopup isOpen={invitePopupOpen} onClose={() => setInvitePopupOpen(false)} />
    </MobileLayout>
  );
};

export default TeamPage;
