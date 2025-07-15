
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Users, Gift, Crown, Target, Zap, Star, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <MobileLayout showBackButton title="Invite & Earn">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 space-y-4">
          {/* Header Stats */}
          <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold mb-1">Build Your Network</h1>
                <p className="text-emerald-100 text-sm">Invite friends and earn lifetime commissions</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-emerald-200 text-sm">Total Invites</p>
                  <p className="text-2xl font-bold">{totalTeamSize || 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-emerald-200 text-sm">Active Members</p>
                  <p className="text-2xl font-bold">{totalActiveMembers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code & Referral Code */}
          <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Your Referral Code</h3>
                
                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
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
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mb-4 border border-emerald-200">
                  <p className="text-sm text-gray-600 mb-2">Share this code</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-bold text-emerald-700 tracking-wider">
                      {user?.referral_code || "LOADING"}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(user?.referral_code || "", "Referral code copied!")}
                      className="h-8 w-8 p-0 border-emerald-300 hover:bg-emerald-50"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => copyToClipboard(referralLink, "Invite link copied!")}
                    className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300"
                    variant="outline"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    onClick={shareInvite}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commission Rates */}
          <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                Commission Structure
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { level: "Level 1", rate: level1Commission, icon: Crown, color: "bg-gradient-to-br from-yellow-400 to-orange-500" },
                  { level: "Level 2", rate: level2Commission, icon: Star, color: "bg-gradient-to-br from-blue-400 to-indigo-500" },
                  { level: "Level 3", rate: level3Commission, icon: Gift, color: "bg-gradient-to-br from-purple-400 to-pink-500" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 text-center border border-gray-200">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${item.color}`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{item.level}</p>
                    <p className="text-xl font-bold text-gray-900">{item.rate}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Statistics */}
          <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 text-emerald-600 mr-2" />
                Your Team Stats
              </h3>
              
              <div className="space-y-3">
                {[
                  { level: "Level 1", active: activeLevel1, total: level1Members.length, color: "emerald" },
                  { level: "Level 2", active: activeLevel2, total: level2Members.length, color: "blue" },
                  { level: "Level 3", active: activeLevel3, total: level3Members.length, color: "purple" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{item.level}</p>
                      <p className="text-sm text-gray-600">Direct referrals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        <span className={`text-${item.color}-600`}>{item.active}</span>/{item.total}
                      </p>
                      <p className="text-sm text-gray-500">Active/Total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                Why Invite Friends?
              </h3>
              
              <div className="space-y-3">
                {[
                  "Earn commissions on every trade your referrals make",
                  "Build a passive income stream that grows over time",
                  "Help friends discover profitable trading opportunities",
                  "Unlock VIP benefits and higher commission rates"
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default InvitePage;
