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
    <MobileLayout showBackButton title="VIP Benfit">
      <div className="flex flex-col pb-safe animate-fade-in">
        
        {/* Main Content Area */}
        <div className="px-4 py-3 flex-1">
         
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
        </div>
      </div>
    </MobileLayout>
  );
};

export default VipPage;
