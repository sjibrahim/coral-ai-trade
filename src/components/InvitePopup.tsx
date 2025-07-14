
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, User, Users, Gift, Crown, Star, Zap, Target } from "lucide-react";
import QRCode from "qrcode.react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface InvitePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitePopup = ({ isOpen, onClose }: InvitePopupProps) => {
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const { user, generalSettings } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (isOpen && user) {
      const baseUrl = window.location.origin;
      const referralCode = user.invite_code || user.referral_code || user.id || "TREXO";
      setInviteLink(`${baseUrl}/register?referral=${referralCode}`);
    }
  }, [isOpen, user]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Trexo Trading",
          text: "Join Trexo and start earning with crypto trading!",
          url: inviteLink,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      handleCopy();
    }
  };
  
  const referralCode = user?.invite_code || user?.referral_code || "TREXO";
  const level1Commission = generalSettings?.level_1_commission || "10";
  const level2Commission = generalSettings?.level_2_commission || "5";
  const level3Commission = generalSettings?.level_3_commission || "2";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto w-[90%] bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 border-0 p-0 overflow-hidden rounded-2xl">
        <div className="relative p-5">
          <DialogHeader className="text-center mb-4">
            <DialogTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              Invite & Earn
            </DialogTitle>
            <p className="text-emerald-100 text-xs">
              Build your Trexo network and earn commissions
            </p>
          </DialogHeader>
          
          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-xl">
              <QRCode 
                value={inviteLink} 
                size={120} 
                level="H"
                includeMargin
                renderAs="svg"
              />
            </div>
          </div>
          
          {/* Referral Code */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-4 w-4 text-white mr-2" />
                <span className="text-white text-sm font-medium">Your Code:</span>
              </div>
              <span className="font-bold text-white text-lg">{referralCode}</span>
            </div>
          </div>
          
          {/* Commission Rates */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { level: "L1", rate: level1Commission, icon: Crown, color: "bg-yellow-400/20" },
              { level: "L2", rate: level2Commission, icon: Star, color: "bg-blue-400/20" },
              { level: "L3", rate: level3Commission, icon: Gift, color: "bg-purple-400/20" }
            ].map((item, idx) => (
              <div key={idx} className={`${item.color} rounded-lg p-2 text-center`}>
                <div className="flex items-center justify-center mb-1">
                  <item.icon className="h-3 w-3 text-white mr-1" />
                  <span className="text-white text-xs">{item.level}</span>
                </div>
                <p className="text-white font-bold text-sm">{item.rate}%</p>
              </div>
            ))}
          </div>
          
          {/* Invite Link */}
          <div className="relative mb-4">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-3 pr-10 text-white text-xs placeholder-white/60"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-white hover:bg-white/10"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs h-9"
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy Link
            </Button>
            <Button
              onClick={shareInvite}
              className="bg-white text-emerald-700 hover:bg-gray-100 text-xs h-9"
            >
              <Share2 className="mr-1 h-3 w-3" />
              Share Now
            </Button>
          </div>
          
          {/* Benefits */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center text-white/90 text-xs">
              <Zap className="h-3 w-3 mr-1" />
              <span>Earn lifetime commissions from your network</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePopup;
