
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Users, ArrowLeft, Check, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
import QRCode from "qrcode.react";
import { useNavigate } from "react-router-dom";

const InvitePage = () => {
  const navigate = useNavigate();
  const { user, generalSettings } = useAuth();
  const { 
    totalTeamSize, 
    totalActiveMembers, 
    fetchTeamDetails 
  } = useTeam();
  
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);
  
  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?referral=${user?.referral_code || ""}`;
  };

  const referralLink = getReferralLink();
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied!",
          description: message,
          duration: 2000,
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Trexo Trading",
          text: "Join Trexo and start earning with crypto trading!",
          url: referralLink,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      copyToClipboard(referralLink, "Invite link copied to clipboard!");
    }
  };

  const level1Commission = generalSettings?.level_1_commission || "10";
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Invite Friends</h1>
            <p className="text-sm text-gray-400">Earn {level1Commission}% commission on every trade</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Team Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-white" />
            </div>
            <p className="text-gray-400 text-sm">Total Team</p>
            <p className="text-2xl font-bold text-white">{totalTeamSize || 0}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Check className="w-4 h-4 text-white" />
            </div>
            <p className="text-gray-400 text-sm">Active Members</p>
            <p className="text-2xl font-bold text-white">{totalActiveMembers || 0}</p>
          </div>
        </div>

        {/* Referral Code & QR */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Your Referral Code</h3>
            <div className="bg-gray-700/50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-2xl font-bold text-teal-400 tracking-wider">
                  {user?.referral_code || "LOADING"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(user?.referral_code || "", "Referral code copied!")}
                  className="h-8 w-8 p-0 bg-gray-600 border-gray-500 hover:bg-gray-500 text-white"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-xl">
              <QRCode 
                value={referralLink} 
                size={140} 
                level="H"
                includeMargin
                renderAs="svg"
              />
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => copyToClipboard(referralLink, "Invite link copied!")}
              className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              onClick={shareInvite}
              className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Commission Info */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3 text-center">Earn Commission</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-400 mb-2">{level1Commission}%</div>
            <p className="text-gray-400 text-sm">on every trade your referrals make</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">How it Works</h3>
          
          <div className="space-y-3">
            {[
              "Share your referral code or QR code with friends",
              "They register using your code and start trading", 
              "You earn commission on every trade they make",
              "Build your team and increase your earnings"
            ].map((step, idx) => (
              <div key={idx} className="flex items-start">
                <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-teal-400">{idx + 1}</span>
                </div>
                <p className="text-sm text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
