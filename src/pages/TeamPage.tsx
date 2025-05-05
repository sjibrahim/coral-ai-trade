
import MobileLayout from "@/components/layout/MobileLayout";
import { mockTeamStats } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Users, UserPlus, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TeamPage = () => {
  const [activeLevel, setActiveLevel] = useState('Level 1');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  const levels = [
    'Level 1',
    'Level 2',
    'Level 3'
  ];
  
  const getLevelMembers = (level: string) => {
    // Return filtered members based on level
    return mockTeamStats.members;
  };

  const currentLevelMembers = getLevelMembers(activeLevel);
  const currentLevelData = mockTeamStats.levels.find(level => level.id === `L${activeLevel.charAt(6)}`);
  
  return (
    <MobileLayout title="Team">
      <div className="p-4 space-y-6 animate-fade-in pb-20">
        {/* Team Banner */}
        <div className="bg-primary/10 rounded-xl p-4 flex items-center">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mr-4">
            <Users size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">My Team</h3>
            <p className="text-sm text-muted-foreground">Build your network</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary/10 border-primary/20"
            onClick={() => setShowInviteDialog(true)}
          >
            <UserPlus size={16} className="mr-1" /> Invite
          </Button>
        </div>
        
        {/* Team Stats */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4">
            <h3 className="text-base font-medium mb-1">Team Overview</h3>
            <p className="text-xs text-muted-foreground">Track your team growth</p>
          </div>
          
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x divide-border">
              {mockTeamStats.levels.map((level) => (
                <div key={level.id} className="py-4 text-center">
                  <p className="text-sm mb-1 text-muted-foreground">{level.id}</p>
                  <p className="text-lg font-medium">
                    <span className="text-primary">{level.current}</span>
                    <span className="text-muted-foreground">/{level.total}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Level Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-border">
          {levels.map((level) => (
            <button
              key={level}
              className={cn(
                "flex-1 py-3 text-center transition-colors",
                activeLevel === level 
                  ? "bg-primary text-white" 
                  : "bg-card text-muted-foreground hover:bg-muted/50"
              )}
              onClick={() => setActiveLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
        
        {/* Current Level Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{activeLevel}</h3>
              <div className="text-sm">
                <span className="text-primary font-medium">{currentLevelData?.current || 0}</span>
                <span className="text-muted-foreground">/{currentLevelData?.total || 0} members</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Team Members */}
        <div className="space-y-4">
          {currentLevelMembers.length === 0 ? (
            <div className="bg-muted/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No team members found in this level</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setShowInviteDialog(true)}
              >
                <UserPlus size={16} className="mr-1" /> Invite New Members
              </Button>
            </div>
          ) : (
            currentLevelMembers.map((member) => (
              <div key={member.id} className="bg-card rounded-xl p-4 border border-border/40 flex justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                      <Users size={16} className="text-primary" />
                    </div>
                    <p className="font-medium">{member.id}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Joined on</p>
                  <p className="text-sm">{member.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Contribution</p>
                  <p className="text-lg font-medium">₹{member.amount}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Invite Team Members</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Share2 size={24} className="text-primary" />
            </div>
            
            <p className="text-center text-sm mb-4">
              Share your referral code with friends and earn rewards when they join
            </p>
            
            <div className="bg-muted p-3 rounded-lg flex justify-between items-center mb-4">
              <span className="text-base font-medium">558544</span>
              <Button variant="outline" size="sm" className="h-8">Copy</Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-center gap-4">
              <Button className="flex flex-col h-auto py-2 px-4 gap-1">
                <Share2 size={20} />
                <span className="text-xs">Share</span>
              </Button>
              <Button className="flex flex-col h-auto py-2 px-4 gap-1" variant="outline">
                <Users size={20} />
                <span className="text-xs">Contacts</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default TeamPage;
