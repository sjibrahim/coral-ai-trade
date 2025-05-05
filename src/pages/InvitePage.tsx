
import MobileLayout from "@/components/layout/MobileLayout";
import { mockReferralData } from "@/data/mockData";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

const InvitePage = () => {
  const { totalInvitations, validInvitations, referralCode, referralLink, qrCode } = mockReferralData;
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Referral link has been copied to your clipboard",
          duration: 3000,
        });
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  return (
    <MobileLayout showBackButton title="Invite">
      <div className="p-4 flex flex-col h-full animate-fade-in">
        {/* Stats */}
        <div className="bg-card rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2">
            <div className="text-center border-r border-border pb-4">
              <p className="text-muted-foreground mb-2">Total Invitation</p>
              <p className="text-3xl font-semibold">{totalInvitations}</p>
            </div>
            <div className="text-center pb-4">
              <p className="text-muted-foreground mb-2">Valid Invitations</p>
              <p className="text-3xl font-semibold">{validInvitations}</p>
            </div>
          </div>
        </div>
        
        {/* QR Code */}
        <div className="bg-card rounded-xl p-6 flex flex-col items-center mb-8">
          <div className="bg-white p-4 rounded-md mb-6">
            <img src={qrCode} alt="Referral QR Code" className="w-48 h-48" />
          </div>
          
          <p className="text-2xl mb-6">{referralCode}</p>
          
          <div className="w-full mb-6">
            <p className="text-muted-foreground text-center mb-2 break-all">
              {referralLink}
            </p>
          </div>
          
          <button 
            className="flex items-center justify-center gap-2 border border-muted rounded-full py-3 px-8 transition-colors hover:bg-muted"
            onClick={copyToClipboard}
          >
            <Copy size={18} />
            <span>Copy Link</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default InvitePage;
