
import MobileLayout from "@/components/layout/MobileLayout";
import { mockTeamStats } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Users, UserPlus, Share2, ArrowRight, TrendingUp, DollarSign, User, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  
  // Get level colors
  const getLevelColor = (level: string) => {
    if (level === 'Level 1') return 'bg-emerald-500';
    if (level === 'Level 2') return 'bg-sky-500';
    return 'bg-violet-500';
  };
  
  // Get status colors
  const getStatusColor = (status: string) => {
    return status.toLowerCase() === 'active' 
      ? 'text-emerald-500' 
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
      <div className="p-4 space-y-5 animate-fade-in pb-20 bg-[#f8f9fa]/50">
        {/* Team Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-5">
          <h1 className="text-2xl font-bold text-emerald-800">My Team</h1>
          <p className="text-sm text-emerald-600">Manage your downline and track commissions</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-500 border-0 text-white shadow-lg shadow-emerald-500/30">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-medium text-white/90">Team Size</h3>
              </div>
              <div className="text-3xl font-bold">{teamStats.teamSize}</div>
              <p className="text-xs text-white/90">Level 1: {teamStats.levels['Level 1']}</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-500 border-0 text-white shadow-lg shadow-emerald-500/30">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <DollarSign size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-medium text-white/90">Commission</h3>
              </div>
              <div className="text-3xl font-bold">₹{teamStats.commission}</div>
              <p className="text-xs text-white/90">Total earnings</p>
            </CardContent>
          </Card>
        </div>
        
        {/* More Stats Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Valid Users</p>
                <p className="text-lg font-medium">{teamStats.validUsers}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Recharge</p>
                <p className="text-lg font-medium">₹{teamStats.totalRecharge}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Today's New Members</p>
                <p className="text-lg font-medium">{teamStats.todaysNewMembers}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Valid Today</p>
                <p className="text-lg font-medium">{teamStats.validToday}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Total Withdrawal</p>
                <p className="text-lg font-medium">₹{teamStats.totalWithdrawal}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Commission Note */}
        <div className="bg-blue-50 rounded-lg p-3 text-sm border border-blue-100">
          <p className="text-blue-800">
            Team Commission: <span className="font-medium">10%</span> on Level 1, 
            <span className="font-medium"> 0%</span> on Level 2-3
          </p>
        </div>
        
        {/* Invite Button */}
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 h-14 text-base shadow-lg shadow-emerald-500/20"
          onClick={() => setShowInviteDialog(true)}
        >
          <UserPlus size={20} className="mr-2" />
          Invite New Members
        </Button>
        
        {/* Level Tabs */}
        <div className="mt-6 space-y-2">
          <Tabs defaultValue="Level 1" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-10">
              {Object.keys(teamStats.levels).map((level) => (
                <TabsTrigger 
                  key={level} 
                  value={level}
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  onClick={() => setActiveLevel(level)}
                >
                  {level}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Progress bar row */}
            <div className="flex w-full mt-2">
              {Object.entries(teamStats.levels).map(([level, count]) => (
                <div key={level} className="flex-1 px-1">
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", getLevelColor(level))}
                      style={{ width: `${getLevelProgressPercentage(level)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-emerald-600 text-center mt-1">
                    {count} members
                  </p>
                </div>
              ))}
            </div>
            
            {/* Level Content */}
            {Object.keys(teamStats.levels).map((level) => (
              <TabsContent key={level} value={level} className="mt-4 space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-emerald-600" />
                    <h3 className="text-emerald-800 font-medium">{level} Members</h3>
                  </div>
                  <span className="text-sm text-emerald-600 font-medium">
                    {teamStats.levels[level as keyof typeof teamStats.levels]} members
                  </span>
                </div>
                
                {/* Members List */}
                <div className="space-y-3 mt-3">
                  {teamStats.members.map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 bg-emerald-100">
                              <AvatarFallback className="bg-emerald-100 text-emerald-800">
                                {getAvatarText(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-xs text-emerald-600">Joined: {member.joinDate}</p>
                              <div className="flex items-center mt-1">
                                <p className="text-xs text-gray-500">Investment: <span className="font-medium">₹{member.investment}</span></p>
                                <span className="mx-2 text-gray-300">•</span>
                                <p className={cn("text-xs font-medium", getStatusColor(member.status))}>
                                  {member.status}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                            <ArrowRight size={16} className="text-emerald-500" />
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
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Invite Team Members</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Share2 size={24} className="text-emerald-600" />
            </div>
            
            <p className="text-center text-sm mb-4">
              Share your referral code with friends and earn 10% commission on Level 1 members
            </p>
            
            <div className="bg-muted p-3 rounded-lg flex justify-between items-center mb-4">
              <span className="text-base font-medium">558544</span>
              <Button variant="outline" size="sm" className="h-8">Copy</Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-center gap-4">
              <Button className="flex flex-col h-auto py-2 px-4 gap-1 bg-emerald-500 hover:bg-emerald-600">
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
