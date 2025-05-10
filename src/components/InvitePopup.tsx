
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Copy, Share2, Send, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface InvitePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitePopup = ({ isOpen, onClose }: InvitePopupProps) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');

  // Generate referral link based on current domain and user's referral code
  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?referral_code=${user?.referral_code || ""}`;
  };

  const referralLink = getReferralLink();

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: message,
          duration: 3000,
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Invite & Earn
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Referral Code */}
          <div className="text-center">
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
          
          <Separator />
          
          {/* Share Link */}
          <div className="bg-muted/40 rounded-lg p-3 flex justify-between items-center">
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
          
          {/* Email Invite */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2" /> Invite by Email
            </h3>
            
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button 
                disabled={!email} 
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
          
          <div className="mt-4">
            <Button 
              className="w-full" 
              onClick={() => {
                copyToClipboard(referralLink, "Invite link copied to clipboard!");
                onClose();
              }}
            >
              <Share2 size={16} className="mr-2" /> Share Invite Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePopup;
