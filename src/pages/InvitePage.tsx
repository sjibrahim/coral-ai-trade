
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Users, Gift, Crown, Target, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
import QRCode from "qrcode.react";

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
  const level2Commission = generalSettings?.level_2_commission || "5";
  const level3Commission = generalSettings?.level_3_commission || "2";
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Invite & Earn</h1>
            <p className="text-sm text-gray-400">Build your network and earn commissions</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-white" />
            </div>
            <p className="text-gray-400 text-sm">Total Invites</p>
            <p className="text-2xl font-bold text-white">{totalTeamSize || 0}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-4 h-4 text-white" />
            </div>
            <p className="text-gray-400 text-sm">Active Members</p>
            <p className="text-2xl font-bold text-white">{totalActiveMembers || 0}</p>
          </div>
        </div>

        {/* QR Code & Referral Code */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Your Referral Code</h3>
          
          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-xl">
              <QRCode 
                value={referralLink} 
                size={120} 
                level="H"
                includeMargin
                renderAs="svg"
              />
            </div>
          </div>
          
          {/* Referral Code */}
          <div className="bg-gray-700/50 rounded-xl p-4 mb-4 text-center">
            <p className="text-gray-400 text-sm mb-2">Share this code</p>
            <div className="flex items-center justify-center gap-3">
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
              Share Now
            </Button>
          </div>
        </div>

        {/* Commission Rates */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Crown className="w-5 h-5 text-yellow-400 mr-2" />
            Commission Structure
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { level: "Level 1", rate: level1Commission, icon: Crown, color: "from-yellow-400 to-orange-500" },
              { level: "Level 2", rate: level2Commission, icon: Star, color: "from-blue-400 to-indigo-500" },
              { level: "Level 3", rate: level3Commission, icon: Gift, color: "from-purple-400 to-pink-500" }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-700/50 rounded-xl p-3 text-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 bg-gradient-to-r ${item.color}`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-1">{item.level}</p>
                <p className="text-xl font-bold text-white">{item.rate}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Statistics */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 text-teal-400 mr-2" />
            Your Team Stats
          </h3>
          
          <div className="space-y-3">
            {[
              { level: "Level 1", active: activeLevel1, total: level1Members.length, color: "teal" },
              { level: "Level 2", active: activeLevel2, total: level2Members.length, color: "blue" },
              { level: "Level 3", active: activeLevel3, total: level3Members.length, color: "purple" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{item.level}</p>
                  <p className="text-sm text-gray-400">Direct referrals</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    <span className="text-teal-400">{item.active}</span>/{item.total}
                  </p>
                  <p className="text-sm text-gray-400">Active/Total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Why Invite Friends?</h3>
          
          <div className="space-y-3">
            {[
              "Earn commissions on every trade your referrals make",
              "Build a passive income stream that grows over time",
              "Help friends discover profitable trading opportunities",
              "Unlock VIP benefits and higher commission rates"
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start">
                <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check className="w-3 h-3 text-teal-400" />
                </div>
                <p className="text-sm text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default InvitePage;
