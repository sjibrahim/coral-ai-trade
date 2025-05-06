
import MobileLayout from "@/components/layout/MobileLayout";
import { mockReferralData } from "@/data/mockData";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Copy, Share2, Users, Mail, Send, Info, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { totalInvitations, validInvitations, referralCode, referralLink, qrCode } = mockReferralData;
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  
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
      <div className="p-4 flex flex-col h-full animate-fade-in pb-20">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 size={24} className="text-primary" />
          </div>
          <h2 className="text-xl font-medium mb-2">Invite Friends & Earn</h2>
          <p className="text-sm text-muted-foreground mb-4">Get rewards when your friends join and make trades</p>
          <Button className="w-full" onClick={() => copyToClipboard(referralLink, "Invite link copied to clipboard!")}>
            <Share2 size={18} className="mr-2" /> Share Invite Link
          </Button>
        </div>
        
        {/* Stats */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="grid grid-cols-2">
              <div className="text-center border-r border-border p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Users size={18} className="text-primary" />
                </div>
                <p className="text-muted-foreground text-xs mb-1">Total Invitations</p>
                <p className="text-2xl font-semibold">{totalInvitations}</p>
              </div>
              <div className="text-center p-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                  <Users size={18} className="text-green-500" />
                </div>
                <p className="text-muted-foreground text-xs mb-1">Valid Invitations</p>
                <p className="text-2xl font-semibold">{validInvitations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Referral Info and VIP Schedule */}
        <Tabs defaultValue="referral" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="referral">Referral Info</TabsTrigger>
            <TabsTrigger value="vip">VIP Schedule</TabsTrigger>
          </TabsList>
          
          {/* Referral Info Tab */}
          <TabsContent value="referral" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-6">
                  <img src={qrCode} alt="Referral QR Code" className="w-48 h-48" />
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-muted-foreground text-xs mb-1">Your Referral Code</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-semibold letter-spacing-1">{referralCode}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(referralCode, "Referral code copied to clipboard!")}
                      className="h-8"
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-3 flex justify-between items-center mb-4">
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground mb-1">Share Link</p>
                    <p className="text-sm truncate-text pr-2">{referralLink}</p>
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
                
                {/* Email Invite */}
                <div className="mt-6">
                  <h3 className="text-base font-medium mb-4 flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> Invite by Email
                  </h3>
                  
                  <div className="flex gap-2 mb-4">
                    <Input 
                      type="email" 
                      placeholder="Enter email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      disabled={!email} 
                      className="shrink-0"
                      onClick={() => {
                        toast({
                          title: "Invitation sent",
                          description: `Invitation sent to ${email}`,
                        });
                        setEmail('');
                      }}
                    >
                      <Send size={16} className="mr-2" /> Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* VIP Schedule Tab */}
          <TabsContent value="vip" className="mt-0">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg">
                    <h3 className="text-lg font-bold">Broker Salary Schedule</h3>
                  </div>
                </div>
                
                <div className="overflow-x-auto styled-scrollbar">
                  <Table className="w-full text-sm">
                    <TableHeader className="bg-primary/10">
                      <TableRow>
                        <TableHead className="text-center font-semibold">VIP</TableHead>
                        <TableHead className="text-center font-semibold">L1</TableHead>
                        <TableHead className="text-center font-semibold">L1+L2+L3</TableHead>
                        <TableHead className="text-center font-semibold">Salary</TableHead>
                        <TableHead className="text-center font-semibold">New Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vipLevels.map((level, index) => (
                        <TableRow key={level.level} className={index % 2 === 0 ? "bg-green-500/10" : "bg-green-500/20"}>
                          <TableCell className="text-center font-medium">{level.level}</TableCell>
                          <TableCell className="text-center">{level.l1}</TableCell>
                          <TableCell className="text-center">{level.totalRefs}</TableCell>
                          <TableCell className="text-center">{level.salary}</TableCell>
                          <TableCell className="text-center">{level.newQuantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 text-sm border border-border/40 rounded-lg p-4 bg-muted/20">
                  <h4 className="font-medium flex items-center mb-2">
                    <Info size={16} className="mr-2 text-primary" /> What are L1, L2, and L3?
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                      <span>L1 is a user who registered directly using your referral code.</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                      <span>L2 is a user who registered using the L1 member referral code.</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                      <span>L3 is a user who registered using the L2 member referral code.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 text-sm border border-border/40 rounded-lg p-4 bg-muted/20">
                  <h4 className="font-medium flex items-center mb-2">
                    <Info size={16} className="mr-2 text-primary" /> Agent Rules & Requirements
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                      <span>Agents should guide new users to use the APP correctly and clarify transaction rules, recharge methods and withdrawal requirements.</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                      <span>Actively promote the platform through various online and offline promotion activities, and encourage users to share your invitation link.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 text-xs p-4 bg-red-500/10 text-red-500 rounded-lg">
                  <p className="font-medium mb-1">Disclaimer:</p>
                  <p>Each person, each mobile phone, each IP address, and each bank account can only have one account. If the system audit finds malicious use of multiple accounts to defraud rewards, all accounts will be frozen and the principal will be confiscated.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Reward Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2 text-primary" /> Referral Benefits
            </h3>
            
            <Separator className="my-4" />
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3 shrink-0">
                  <Check size={16} className="text-green-500" />
                </div>
                <p>Earn 10% commission when your friends make trades</p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3 shrink-0">
                  <Check size={16} className="text-green-500" />
                </div>
                <p>Get bonus rewards when they reach trading milestones</p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3 shrink-0">
                  <Check size={16} className="text-green-500" />
                </div>
                <p>Unlock VIP benefits with more successful referrals</p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3 shrink-0">
                  <Check size={16} className="text-green-500" />
                </div>
                <p>Earn continuous income from multi-level referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default InvitePage;
