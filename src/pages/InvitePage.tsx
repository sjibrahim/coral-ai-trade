
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Users, ArrowLeft, Check, Gift, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
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
          text: "Join me on Trexo and start earning with crypto trading!",
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
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Invite & Earn</h1>
            <p className="text-sm text-gray-400">Build your network, earn commissions</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent p-6 text-center border border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Earn {level1Commission}% Commission</h2>
            <p className="text-gray-400 text-sm mb-6">
              Invite friends and earn commission on every trade they make
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-teal-400 mr-2" />
                  <span className="text-sm text-gray-400">Total Team</span>
                </div>
                <p className="text-2xl font-bold text-teal-400">{totalTeamSize || 0}</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-sm text-gray-400">Active</span>
                </div>
                <p className="text-2xl font-bold text-green-400">{totalActiveMembers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2 text-white">Your Referral Code</h3>
            <p className="text-sm text-gray-400">Share this code with your friends</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-xl p-4 mb-4 border border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-teal-400 tracking-wider">
                {user?.referral_code || "LOADING"}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(user?.referral_code || "", "Referral code copied!")}
                className="h-10 w-10 p-0 bg-gray-600 border-gray-500 hover:bg-gray-500"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => copyToClipboard(referralLink, "Invite link copied!")}
              variant="outline"
              className="h-12 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              onClick={shareInvite}
              className="h-12 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white border-0"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Now
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              icon: Zap,
              title: "Instant Rewards",
              description: "Earn commission immediately when your referrals trade",
              color: "text-yellow-400"
            },
            {
              icon: TrendingUp,
              title: "Growing Income",
              description: "Build your network and watch your earnings grow",
              color: "text-green-400"
            },
            {
              icon: Users,
              title: "Team Building",
              description: "Create a strong trading community together",
              color: "text-blue-400"
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center ${benefit.color}`}>
                <benefit.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1 text-white">{benefit.title}</h4>
                <p className="text-xs text-gray-400">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <h3 className="font-semibold mb-3 text-center text-white">How it Works</h3>
          
          <div className="space-y-3">
            {[
              "Share your referral code with friends",
              "They register and start trading", 
              "You earn commission on their trades",
              "Build your team and multiply earnings"
            ].map((step, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-teal-400">{idx + 1}</span>
                </div>
                <p className="text-sm text-gray-400 flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
