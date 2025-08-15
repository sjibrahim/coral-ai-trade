
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Invite & Earn</h1>
            <p className="text-sm text-muted-foreground">Build your network, earn commissions</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Earn {level1Commission}% Commission</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Invite friends and earn commission on every trade they make
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Total Team</span>
                </div>
                <p className="text-2xl font-bold text-primary">{totalTeamSize || 0}</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <p className="text-2xl font-bold text-green-500">{totalActiveMembers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Your Referral Code</h3>
            <p className="text-sm text-muted-foreground">Share this code with your friends</p>
          </div>
          
          <div className="bg-muted/50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-primary tracking-wider">
                {user?.referral_code || "LOADING"}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(user?.referral_code || "", "Referral code copied!")}
                className="h-10 w-10 p-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => copyToClipboard(referralLink, "Invite link copied!")}
              variant="outline"
              className="h-12"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              onClick={shareInvite}
              className="h-12 bg-primary hover:bg-primary/90"
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
              color: "text-yellow-500"
            },
            {
              icon: TrendingUp,
              title: "Growing Income",
              description: "Build your network and watch your earnings grow",
              color: "text-green-500"
            },
            {
              icon: Users,
              title: "Team Building",
              description: "Create a strong trading community together",
              color: "text-blue-500"
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-card/50 rounded-xl p-4 border border-border/50 flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center ${benefit.color}`}>
                <benefit.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="bg-card/30 rounded-xl p-4 border border-border/30">
          <h3 className="font-semibold mb-3 text-center">How it Works</h3>
          
          <div className="space-y-3">
            {[
              "Share your referral code with friends",
              "They register and start trading", 
              "You earn commission on their trades",
              "Build your team and multiply earnings"
            ].map((step, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{idx + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
