
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Copy, Share2, Send, Mail, Gift, Sparkles, Users, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface InvitePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitePopup = ({ isOpen, onClose }: InvitePopupProps) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

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
        });
        
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  const shareContent = async () => {
    try {
      setSharing(true);
      if (navigator.share) {
        await navigator.share({
          title: 'Join Nexbit',
          text: `Join Nexbit with my referral code: ${user?.referral_code}`,
          url: referralLink
        });
      } else {
        copyToClipboard(referralLink, "Referral link copied. You can now share it manually.");
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
          <DialogTitle className="flex flex-col items-center text-center">
            <Sparkles className="h-10 w-10 mb-2" />
            <span className="text-2xl font-bold">Invite & Earn</span>
            <p className="text-sm font-normal text-blue-100 mt-2">
              Share your referral code and both of you get rewards
            </p>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="p-6 max-h-[60vh]">
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium flex items-center mb-3 text-blue-700 dark:text-blue-300">
                <Gift className="h-4 w-4 mr-2" />
                Referral Benefits
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Earn 5% commission from your direct referrals</span>
                </li>
                <li className="flex items-start text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Earn 3% from second-level referrals</span>
                </li>
                <li className="flex items-start text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Earn 1% from third-level referrals</span>
                </li>
              </ul>
            </div>
            
            {/* Referral Code */}
            <div className="text-center">
              <p className="text-muted-foreground text-xs mb-2">Your Referral Code</p>
              <div className="inline-flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-950/40 py-3 px-5 rounded-lg">
                <span className="text-xl font-semibold tracking-wider text-blue-800 dark:text-blue-300">
                  {user?.referral_code || "LOADING"}
                </span>
                <Button 
                  size="sm" 
                  variant={copied ? "outline" : "default"}
                  onClick={() => copyToClipboard(user?.referral_code || "", "Referral code copied to clipboard!")}
                  className={`h-7 w-7 p-0 ${copied ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
                >
                  {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Share Link */}
            <div className="bg-muted/40 rounded-lg p-4">
              <h3 className="text-sm font-medium flex items-center mb-3">
                <Share2 className="w-4 h-4 mr-2 text-blue-600" /> 
                Share Your Referral Link
              </h3>
              <div className="bg-background rounded-lg border p-3 flex justify-between items-center">
                <div className="overflow-hidden">
                  <p className="text-xs truncate max-w-[180px]">{referralLink}</p>
                </div>
                <Button 
                  variant={copied ? "outline" : "default"}
                  size="sm"
                  className={`h-8 shrink-0 ${copied ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
                  onClick={() => copyToClipboard(referralLink, "Referral link copied to clipboard!")}
                >
                  {copied ? <CheckCircle2 size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            
            {/* Email Invite */}
            <div>
              <h3 className="text-sm font-medium flex items-center mb-3">
                <Mail className="w-4 h-4 mr-2 text-blue-600" /> 
                Invite by Email
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
            
            {/* Team Counters */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-muted/40 rounded-lg flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs text-muted-foreground">Team Size</span>
                <span className="text-lg font-semibold">0</span>
              </div>
              
              <div className="p-3 bg-muted/40 rounded-lg flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-1">
                  <UserPlus className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-xs text-muted-foreground">Level 1</span>
                <span className="text-lg font-semibold">0</span>
              </div>
              
              <div className="p-3 bg-muted/40 rounded-lg flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-1">
                  <Gift className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-xs text-muted-foreground">Rewards</span>
                <span className="text-lg font-semibold">0</span>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <Button 
            className="w-full" 
            onClick={shareContent}
            disabled={sharing}
          >
            {sharing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Sharing...
              </>
            ) : (
              <>
                <Share2 size={16} className="mr-2" /> 
                Share Invite Link
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePopup;
