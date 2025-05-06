
import MobileLayout from "@/components/layout/MobileLayout";
import { useState } from "react";
import { Users, UserPlus, Share2, ArrowRight, User, ArrowUpRight, Copy, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TeamPage = () => {
  const [activeLevel, setActiveLevel] = useState('Level 1');
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Sample stats data - replace with actual API calls in production
  const teamStats = {
    teamSize: 55,
    validUsers: 42,
    totalRecharge: 12500,
    todaysNewMembers: 3,
    validToday: 2,
    totalWithdrawal: 5800,
    commission: 150,
    levels: {
      'Level 1': 50,
      'Level 2': 3,
      'Level 3': 2
    },
    members: [
      {
        id: 1,
        name: 'Nikhil',
        avatar: '/lovable-uploads/96bbf5be-34b4-46fc-b37f-6e38b84f6772.png',
        joinDate: '4/12/2025',
        investment: 3750,
        status: 'Inactive'
      },
      {
        id: 2,
        name: 'Rahul',
        joinDate: '24/04/2025',
        investment: 5000,
        status: 'Active'
      },
      {
        id: 3,
        name: 'Priya',
        joinDate: '30/04/2025',
        investment: 2500,
        status: 'Active'
      }
    ]
  };
  
  // Copy referral code to clipboard
  const copyReferralCode = () => {
    navigator.clipboard.writeText("558544")
      .then(() => toast.success("Referral code copied to clipboard"))
      .catch(() => toast.error("Failed to copy referral code"));
  };
  
  // Get level colors
  const getLevelColor = (level: string) => {
    if (level === 'Level 1') return 'bg-blue-500';
    if (level === 'Level 2') return 'bg-blue-400';
    return 'bg-blue-300';
  };
  
  // Get status colors
  const getStatusColor = (status: string) => {
    return status.toLowerCase() === 'active' 
      ? 'text-green-500' 
      : 'text-amber-500';
  };
  
  // Get avatar fallback text from name
  const getAvatarText = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  
  // Get level progress percentage
  const getLevelProgressPercentage = (level: string) => {
    const memberCount = teamStats.levels[level as keyof typeof teamStats.levels];
    if (level === 'Level 1') return (memberCount / 100) * 100;
    if (level === 'Level 2') return (memberCount / 10) * 100;
    return (memberCount / 5) * 100;
  };

  return (
    <MobileLayout title="Team">
      <div className="p-4 space-y-5 pb-20">
        {/* Team Header */}
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/10 rounded-xl p-5">
          <h1 className="text-2xl font-bold text-gradient-primary">My Team</h1>
          <p className="text-sm text-blue-400">Manage your downline and track commissions</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-medium text-white/90">Team Size</h3>
              </div>
              <div className="text-3xl font-bold">{teamStats.teamSize}</div>
              <p className="text-xs text-white/80">Level 1: {teamStats.levels['Level 1']}</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowUpRight size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-medium text-white/90">Commission</h3>
              </div>
              <div className="text-3xl font-bold">₹{teamStats.commission}</div>
              <p className="text-xs text-white/80">Total earnings</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Stats Summary */}
        <Card className="border border-blue-500/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Valid Users</p>
                <p className="text-lg font-bold text-blue-500">{teamStats.validUsers}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Total Recharge</p>
                <p className="text-lg font-bold text-blue-500">₹{teamStats.totalRecharge}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Today's New Members</p>
                <p className="text-lg font-bold text-blue-500">{teamStats.todaysNewMembers}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Valid Today</p>
                <p className="text-lg font-bold text-blue-500">{teamStats.validToday}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Total Withdrawal</p>
                <p className="text-lg font-bold text-blue-500">₹{teamStats.totalWithdrawal}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Commission Note */}
        <div className="bg-blue-50/10 rounded-lg p-3.5 text-sm border border-blue-500/20 backdrop-blur-sm">
          <p className="text-blue-400">
            Team Commission: <span className="font-semibold text-blue-500">10%</span> on Level 1, 
            <span className="font-semibold text-blue-500"> 0%</span> on Level 2-3
          </p>
        </div>
        
        {/* Invite Button */}
        <Button 
          className="w-full h-14 text-base shadow-lg bg-blue-500 hover:bg-blue-600"
          onClick={() => setShowInviteDialog(true)}
        >
          <UserPlus size={20} className="mr-2" />
          Invite New Members
        </Button>
        
        {/* Level Tabs */}
        <div className="mt-6 space-y-2">
          <Tabs defaultValue="Level 1" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12 p-1 bg-blue-500/10 rounded-xl">
              {Object.keys(teamStats.levels).map((level) => (
                <TabsTrigger 
                  key={level} 
                  value={level}
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg font-medium"
                  onClick={() => setActiveLevel(level)}
                >
                  {level}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Progress bar row */}
            <div className="flex w-full mt-3">
              {Object.entries(teamStats.levels).map(([level, count]) => (
                <div key={level} className="flex-1 px-1">
                  <div className="h-1.5 w-full bg-blue-100/20 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", getLevelColor(level))}
                      style={{ width: `${getLevelProgressPercentage(level)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-400 text-center mt-1.5">
                    {count} members
                  </p>
                </div>
              ))}
            </div>
            
            {/* Level Content */}
            {Object.keys(teamStats.levels).map((level) => (
              <TabsContent key={level} value={level} className="mt-4 space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-500" />
                    <h3 className="text-blue-500 font-medium">{level} Members</h3>
                  </div>
                  <span className="text-sm text-blue-500 font-medium">
                    {teamStats.levels[level as keyof typeof teamStats.levels]} members
                  </span>
                </div>
                
                {/* Members List */}
                <div className="space-y-3 mt-3">
                  {teamStats.members.map((member) => (
                    <Card key={member.id} className="overflow-hidden border border-blue-500/20 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-13 w-13 bg-blue-100/20 border border-blue-500/30">
                              <AvatarFallback className="bg-blue-100/20 text-blue-500">
                                {getAvatarText(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <p className="font-medium text-blue-50">{member.name}</p>
                              <p className="text-xs text-blue-400">Joined: {member.joinDate}</p>
                              <div className="flex items-center mt-1">
                                <p className="text-xs text-blue-300">Investment: <span className="font-medium">₹{member.investment}</span></p>
                                <span className="mx-2 text-blue-500/30">•</span>
                                <p className={cn("text-xs font-medium", getStatusColor(member.status))}>
                                  {member.status}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <ChevronRight size={16} className="text-blue-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-sm mx-auto bg-[#0d0f17]/95 border border-blue-500/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-gradient-primary">Invite Team Members</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Share2 size={24} className="text-blue-500" />
            </div>
            
            <p className="text-center text-sm mb-4 text-blue-300">
              Share your referral code with friends and earn 10% commission on Level 1 members
            </p>
            
            <div className="bg-blue-900/20 p-3.5 rounded-lg flex justify-between items-center mb-4 border border-blue-500/20">
              <span className="text-base font-medium text-blue-200">558544</span>
              <Button variant="outline" size="sm" className="h-8 border-blue-500/30 text-blue-400 hover:bg-blue-500/20" onClick={copyReferralCode}>
                <Copy size={14} className="mr-1" />
                Copy
              </Button>
            </div>
            
            <Separator className="my-4 bg-blue-500/20" />
            
            <div className="flex justify-center gap-4">
              <Button className="flex flex-col h-auto py-2 px-4 gap-1 bg-blue-500 hover:bg-blue-600">
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
