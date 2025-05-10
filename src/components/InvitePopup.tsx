
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, User, Users } from "lucide-react";
import QRCode from "qrcode.react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface InvitePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitePopup = ({ isOpen, onClose }: InvitePopupProps) => {
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (isOpen && user) {
      // Create invite link based on user details
      const baseUrl = window.location.origin;
      const referralCode = user.invite_code || user.id || "NEXBIT";
      setInviteLink(`${baseUrl}/register?ref=${referralCode}`);
    }
  }, [isOpen, user]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Invite link has been copied to your clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Nexbit Trading Platform",
          text: "Join Nexbit using my referral link and get exciting rewards!",
          url: inviteLink,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Web Share API is not supported in your browser.",
        variant: "destructive",
      });
    }
  };
  
  const referralCode = user?.invite_code || "NEXBIT";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-background to-blue-900/10 backdrop-blur-sm border-blue-200/20 p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gradient-primary flex items-center justify-center gap-2 mb-1">
            <Users className="h-5 w-5" />
            Invite Friends
          </DialogTitle>
          <p className="text-sm text-muted-foreground mb-4">
            Share this link with your friends and earn rewards
          </p>
        </DialogHeader>
        
        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-xl">
            <QRCode 
              value={inviteLink} 
              size={180} 
              level="H"
              includeMargin
              renderAs="svg"
              imageSettings={{
                src: "https://ik.imagekit.io/spmcumfu9/nexbit_logo.jpeg",
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
        </div>
        
        {/* Referral Info */}
        <div className="space-y-4">
          {/* User's Referral Code */}
          <div className="flex items-center justify-between border border-blue-200/30 rounded-lg p-3 bg-blue-50/5">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">Your Code:</span>
            </div>
            <span className="font-bold text-primary">
              {referralCode}
            </span>
          </div>
          
          {/* Referral Link */}
          <div className="relative">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="w-full bg-blue-50/5 border border-blue-200/30 rounded-lg py-3 pl-4 pr-12 text-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:text-primary/90"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={handleCopy}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button
              className="w-full"
              onClick={shareInvite}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          
          {/* Reward Info */}
          <div className="mt-4 text-center">
            <h3 className="font-medium text-sm bg-gradient-to-r from-primary to-blue-200 bg-clip-text text-transparent">
              Earn commission from every friend's trade
            </h3>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-blue-50/5 rounded-lg p-2 border border-blue-200/20">
                <p className="text-xs text-muted-foreground">Level 1</p>
                <p className="text-lg font-bold text-primary">10%</p>
              </div>
              <div className="bg-blue-50/5 rounded-lg p-2 border border-blue-200/20">
                <p className="text-xs text-muted-foreground">Level 2</p>
                <p className="text-lg font-bold text-primary">5%</p>
              </div>
              <div className="bg-blue-50/5 rounded-lg p-2 border border-blue-200/20">
                <p className="text-xs text-muted-foreground">Level 3</p>
                <p className="text-lg font-bold text-primary">2%</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePopup;
