import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Users, Mail, Send, Info, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTeam } from "@/hooks/use-team";

// VIP level data based on the reference image
const vipLevels = [
  { level: "VIP1", l1: 2, totalRefs: 15, salary: 200, newQuantity: 2 },
  { level: "VIP2", l1: 5, totalRefs: 25, salary: 800, newQuantity: 5 },
  { level: "VIP3", l1: 10, totalRefs: 50, salary: 2000, newQuantity: 8 },
  { level: "VIP4", l1: 30, totalRefs: 150, salary: 5000, newQuantity: 15 },
  { level: "VIP5", l1: 80, totalRefs: 500, salary: 10000, newQuantity: 30 },
  { level: "VIP6", l1: 200, totalRefs: 2000, salary: 30000, newQuantity: 100 },
  { level: "VIP7", l1: 500, totalRefs: 5000, salary: 100000, newQuantity: 300 },
  { level: "VIP8", l1: 1000, totalRefs: 10000, salary: 200000, newQuantity: "caly" },
];

const InvitePage = () => {
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
  
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);
  
  // Generate referral link based on current domain and user's referral code
  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?referral_code=${user?.referral_code || ""}`;
  };

  const referralLink = getReferralLink();
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: message,
          duration: 3000,
        });
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  return (
    <MobileLayout showBackButton title="Invite & Earn">
      <div className="flex flex-col pb-safe animate-fade-in">
        {/* Stats Card - Always visible on top */}
        <div className="p-4 pb-0">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-2">
                <div className="text-center border-r border-border p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Users size={18} className="text-primary" />
                  </div>
                  <p className="text-muted-foreground text-xs mb-1">Total Invitations</p>
                  <p className="text-2xl font-semibold">{totalTeamSize || 0}</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                    <Users size={18} className="text-green-500" />
                  </div>
                  <p className="text-muted-foreground text-xs mb-1">Valid Invitations</p>
                  <p className="text-2xl font-semibold">{totalActiveMembers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="px-4 py-3 flex-1">
          {/* Tabs with Referral Info as the default/primary tab */}
          <Tabs defaultValue="referral" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="referral" className="text-sm">Referral Info</TabsTrigger>
              <TabsTrigger value="vip" className="text-sm">VIP Schedule</TabsTrigger>
            </TabsList>
            
            {/* Referral Info Tab (Primary) */}
            <TabsContent value="referral" className="mt-0 space-y-4">
              {/* Share Invite Card */}
              <Card className="invite-info-card overflow-hidden">
                <CardContent className="p-4">
                  {/* Hero Banner */}
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 mb-4 text-center">
                    <h2 className="text-lg font-medium mb-2">Invite Friends & Earn</h2>
                    <p className="text-xs text-muted-foreground mb-4">Get rewards when your friends join and trade</p>
                    <Button 
                      className="w-full text-sm py-2 h-auto" 
                      onClick={() => copyToClipboard(referralLink, "Invite link copied to clipboard!")}
                    >
                      <Share2 size={16} className="mr-2" /> Share Invite Link
                    </Button>
                  </div>
                  
                  {/* Referral Code */}
                  <div className="text-center mb-4">
                    <p className="text-muted-foreground text-xs mb-1">Your Referral Code</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl font-semibold tracking-wider">{user?.referral_code || "LOADING"}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(user?.referral_code || "", "Referral code copied to clipboard!")}
                        className="h-7 w-7 p-0"
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Share Link */}
                  <div className="bg-muted/40 rounded-lg p-3 flex justify-between items-center mb-4">
                    <div className="overflow-hidden">
                      <p className="text-xs text-muted-foreground mb-1">Share Link</p>
                      <p className="text-xs truncate max-w-[200px]">{referralLink}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 shrink-0"
                      onClick={() => copyToClipboard(referralLink, "Referral link copied to clipboard!")}
                    >
                      <Copy size={14} className="mr-1" /> Copy
                    </Button>
                  </div>
                  
                  {/* Team Stats Section */}
                  <div className="bg-muted/40 rounded-lg p-3 mb-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" /> Your Team
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-blue-500/10 p-2 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Level 1</p>
                        <p className="font-medium">
                          <span className="text-blue-400">{activeLevel1}</span>/{level1Members.length}
                        </p>
                      </div>
                      <div className="bg-blue-500/10 p-2 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Level 2</p>
                        <p className="font-medium">
                          <span className="text-blue-400">{activeLevel2}</span>/{level2Members.length}
                        </p>
                      </div>
                      <div className="bg-blue-500/10 p-2 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Level 3</p>
                        <p className="font-medium">
                          <span className="text-blue-400">{activeLevel3}</span>/{level3Members.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email Invite */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Mail className="w-4 h-4 mr-2" /> Invite by Email
                    </h3>
                    
                    <div className="flex gap-2">
                      <Input 
                        type="email" 
                        placeholder="Enter email address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 text-sm h-9"
                      />
                      <Button 
                        disabled={!email} 
                        className="shrink-0 h-9"
                        onClick={() => {
                          toast({
                            title: "Invitation sent",
                            description: `Invitation sent to ${email}`,
                          });
                          setEmail('');
                        }}
                      >
                        <Send size={14} className="mr-2" /> Send
                      </Button>
                    </div>
                  </div>
                  
                  {/* Reward Information Card */}
                  <div className="mt-6">
                    <h3 className="text-base font-medium mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-primary" /> Referral Benefits
                    </h3>
                    
                    <Separator className="my-3" />
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center mr-3 shrink-0">
                          <Check size={14} className="text-green-500" />
                        </div>
                        <p className="text-sm">Earn {generalSettings?.level_1_commission || '10'}% when your friends make trades</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center mr-3 shrink-0">
                          <Check size={14} className="text-green-500" />
                        </div>
                        <p className="text-sm">Get {generalSettings?.level_2_commission || '5'}% from your Level 2 referrals</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center mr-3 shrink-0">
                          <Check size={14} className="text-green-500" />
                        </div>
                        <p className="text-sm">Earn {generalSettings?.level_3_commission || '2'}% from your Level 3 referrals</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* VIP Schedule Tab (Secondary) */}
            <TabsContent value="vip" className="mt-0 space-y-4">
              {/* VIP Schedule Section */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg text-center w-full">
                      <h3 className="text-base font-bold">Broker Salary Schedule</h3>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto styled-scrollbar -mx-2">
                    <Table className="w-full text-xs">
                      <TableHeader>
                        <TableRow className="bg-primary/10">
                          <TableHead className="text-center font-semibold">VIP</TableHead>
                          <TableHead className="text-center font-semibold">L1</TableHead>
                          <TableHead className="text-center font-semibold">L1+L2+L3</TableHead>
                          <TableHead className="text-center font-semibold">Salary</TableHead>
                          <TableHead className="text-center font-semibold">New</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vipLevels.map((level, index) => (
                          <TableRow key={level.level} className={index % 2 === 0 ? "bg-green-500/10" : "bg-green-500/5"}>
                            <TableCell className="text-center font-medium p-2">{level.level}</TableCell>
                            <TableCell className="text-center p-2">{level.l1}</TableCell>
                            <TableCell className="text-center p-2">{level.totalRefs}</TableCell>
                            <TableCell className="text-center p-2">{level.salary}</TableCell>
                            <TableCell className="text-center p-2">{level.newQuantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4 text-sm border border-border/40 rounded-lg p-3 bg-muted/20">
                    <h4 className="font-medium flex items-center mb-2">
                      <Info size={16} className="mr-2 text-primary shrink-0" /> What are L1, L2, and L3?
                    </h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start">
                        <Check size={14} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                        <span>L1 is a user who registered directly using your referral code.</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={14} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                        <span>L2 is a user who registered using the L1 member referral code.</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={14} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                        <span>L3 is a user who registered using the L2 member referral code.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Agent Rules Card */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium flex items-center mb-3">
                    <Info size={16} className="mr-2 text-primary shrink-0" /> Agent Rules & Requirements
                  </h3>
                  
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                      <span>Agents should guide new users to use the APP correctly and clarify transaction rules, recharge methods and withdrawal requirements.</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                      <span>Actively promote the platform through various online and offline promotion activities.</span>
                    </li>
                  </ul>
                  
                  <div className="mt-3 text-xs p-3 bg-red-500/10 text-red-500 rounded-lg">
                    <p className="font-medium mb-1">Disclaimer:</p>
                    <p>Each person, each mobile phone, each IP address, and each bank account can only have one account. If the system audit finds malicious use of multiple accounts to defraud rewards, all accounts will be frozen.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MobileLayout>
  );
};

export default InvitePage;
