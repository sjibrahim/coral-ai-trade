
import MobileLayout from "@/components/layout/MobileLayout";
import { useState } from "react";
import { Users, UserPlus, Share2, ArrowRight, User, ArrowUpRight, Copy, ChevronRight, Share, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  // Handle share action
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join my team',
          text: 'Join my team using my referral code: 558544',
          url: window.location.origin
        });
        toast.success('Invitation shared successfully');
      } else {
        toast.info('Share functionality not supported on your device');
      }
    } catch (error) {
      toast.error('Failed to share invitation');
    }
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
      
      {/* Redesigned Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-sm mx-auto bg-gradient-to-b from-[#0d0f17]/95 to-[#0f1527]/95 border border-blue-500/30 backdrop-blur-xl rounded-xl p-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse-glow"></div>
            <div className="absolute top-1/2 -right-20 w-40 h-40 bg-blue-600/10 rounded-full blur-xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-12 left-12 w-36 h-36 bg-blue-400/10 rounded-full blur-xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
          </div>

          <DialogClose className="absolute right-3 top-3 z-10 rounded-full bg-blue-900/40 p-1.5 text-blue-400 hover:bg-blue-800/60 transition-colors">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </DialogClose>
          
          <div className="relative z-10 pt-7 px-4 pb-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 animate-bounce" style={{ animationDuration: '3s' }}>
                <Share2 size={32} className="text-blue-400" />
              </div>
              
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent pb-1">Invite Team Members</h2>
              
              <p className="text-center text-sm my-4 text-blue-300/90 max-w-[250px]">
                Share your referral code with friends and earn <span className="text-blue-400 font-medium">10% commission</span> on Level 1 members
              </p>
            </div>

            {/* Referral code section with animated glow */}
            <div className="relative mt-2 mb-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 animate-[shimmer_2s_infinite]"></div>
              <div className="relative bg-blue-900/30 p-4 rounded-xl flex justify-between items-center border border-blue-500/30">
                <div className="flex flex-col">
                  <span className="text-xs text-blue-400 mb-1">Your Referral Code</span>
                  <span className="text-xl font-bold text-white font-mono tracking-wider">558544</span>
                </div>
                <Button 
                  onClick={copyReferralCode} 
                  variant="outline" 
                  size="sm" 
                  className="h-9 border-blue-500/30 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-all duration-300"
                >
                  <Copy size={14} className="mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            <Separator className="my-5 bg-blue-500/20" />

            {/* Share options with improved styling */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              <Button 
                onClick={handleShare}
                className="flex flex-col items-center gap-1.5 h-auto py-3 px-0 bg-gradient-to-b from-blue-500/80 to-blue-600 hover:from-blue-500 hover:to-blue-600/90 shadow-md shadow-blue-900/30 border border-blue-400/30 transition-all duration-300"
              >
                <Share size={22} />
                <span className="text-xs">Share</span>
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    className="flex flex-col items-center gap-1.5 h-auto py-3 px-0 bg-gradient-to-b from-blue-900/60 to-blue-900/80 hover:brightness-125 shadow-md shadow-blue-900/20 border border-blue-500/20"
                  >
                    <Mail size={22} />
                    <span className="text-xs">Email</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-[#0d0f17]/95 border border-blue-500/30 backdrop-blur-xl">
                  <div className="p-2">
                    <h3 className="font-medium text-sm mb-2 text-blue-300">Send invitation via email</h3>
                    <p className="text-xs text-blue-400/80">Coming soon</p>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    className="flex flex-col items-center gap-1.5 h-auto py-3 px-0 bg-gradient-to-b from-blue-900/60 to-blue-900/80 hover:brightness-125 shadow-md shadow-blue-900/20 border border-blue-500/20"
                  >
                    <Users size={22} />
                    <span className="text-xs">Contacts</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-80 bg-[#0d0f17]/95 border-t border-blue-500/30 rounded-t-xl p-0">
                  <div className="p-4 h-full">
                    <h3 className="text-lg font-medium mb-2 text-blue-300">Select Contacts</h3>
                    <p className="text-sm text-blue-400/80">Contact integration coming soon</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Animated success indicator */}
            <div className="mt-6 bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                <p className="text-xs text-blue-400">
                  <span className="font-medium">55</span> members invited successfully
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default TeamPage;
