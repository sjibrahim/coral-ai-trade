
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Users, Gift, ExternalLink, QrCode } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode.react";

const InvitePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inviteLink, setInviteLink] = useState("");
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    if (user) {
      const link = `${window.location.origin}/register?referral=${user.id}`;
      setInviteLink(link);
      setQrCode(link);
    }
  }, [user]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied",
      description: "Invite link copied to clipboard",
    });
  };
  
  return (
    <MobileLayout showBackButton title="Invite Friends">
      <div className="p-4 space-y-4 animate-fade-in">
        {/* Invite Card */}
        <Card className="bg-card rounded-xl border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Invite Friends</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Invite Link */}
              <div className="grid gap-2">
                <Label htmlFor="inviteLink">Your Invite Link</Label>
                <div className="flex items-center">
                  <Input 
                    id="inviteLink" 
                    value={inviteLink} 
                    readOnly 
                    className="bg-secondary/80 border-input text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyLink}
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              
              {/* QR Code */}
              <div className="flex justify-center">
                {qrCode ? (
                  <QRCode value={qrCode} size={128} bgColor="#f0f0f0" fgColor="#222" />
                ) : (
                  <p>Loading QR Code...</p>
                )}
              </div>
              
              {/* Invite Button */}
              <Button className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Invite via Contacts
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Rewards Card */}
        <Card className="bg-card rounded-xl border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Invite Rewards</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Invite friends and earn rewards for each successful referral.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Earn ₹100 for each friend who joins.</li>
                <li>Get 10% of their earnings for life.</li>
                <li>Unlock exclusive VIP benefits.</li>
              </ul>
              <Button variant="secondary" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default InvitePage;
