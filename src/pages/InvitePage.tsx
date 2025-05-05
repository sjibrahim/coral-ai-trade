
import MobileLayout from "@/components/layout/MobileLayout";
import { mockReferralData } from "@/data/mockData";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Copy, Share2, Users, Mail, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
        
        {/* QR Code */}
        <Card className="mb-6">
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
          </CardContent>
        </Card>
        
        {/* Email Invite */}
        <Card>
          <CardContent className="p-4">
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
            
            <Separator className="my-4" />
            
            <div className="text-xs text-muted-foreground space-y-2">
              <p>• Earn 10% commission when your friends make trades</p>
              <p>• Get bonus rewards when they reach trading milestones</p>
              <p>• Unlock VIP benefits with more successful referrals</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default InvitePage;
