import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Crown, Shield, TrendingUp, Users, Clock, Sparkles } from "lucide-react";

export function WelcomeInfoModal() {
  const [open, setOpen] = useState(false);
  const { settings, loading } = useGeneralSettings();
  const { toast } = useToast();

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const openTelegramChannel = () => {
    window.open(settings.telegram_channel || "https://t.me/trexosupport", "_blank");
  };

  const features = [
    { icon: Crown, title: "Premium Trading", desc: "Advanced crypto trading platform" },
    { icon: Shield, title: "Secure", desc: "Bank-grade security protection" },
    { icon: TrendingUp, title: "High Returns", desc: `${settings.daily_profit || "1.5"}% daily profit` },
    { icon: Users, title: "Expert Support", desc: "24/7 customer assistance" }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-0 overflow-hidden shadow-2xl rounded-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="p-6 space-y-6 relative z-10">
          {/* Premium Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent font-trading">
                Trexo
              </h1>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Premium Crypto Platform</span>
            </div>
            <p className="text-gray-600 text-sm">
              Welcome to the future of cryptocurrency trading
            </p>
          </div>

          {/* Trading Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 shadow-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Trading Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Minimum Deposit</span>
                <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  ₹{settings.min_deposit || "300"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Minimum Withdrawal</span>
                <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  ₹{settings.min_withdrawal || "300"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Daily Profit Rate</span>
                <span className="text-sm font-bold text-green-600">{settings.daily_profit || "1.5"}%</span>
              </div>
            </div>
          </div>

          {/* Premium Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mb-2">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-xs font-bold text-gray-800">{feature.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Customer Support */}
          <div 
            onClick={openTelegramChannel}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50 cursor-pointer hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Customer Support</p>
                  <p className="text-xs text-blue-600">@{settings.customer_support || "trexosupport"}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={openTelegramChannel} 
              className="w-full bg-gradient-to-r from-[#0088cc] to-[#0077b5] hover:from-[#0077b5] hover:to-[#006ba1] text-white font-semibold rounded-xl py-2.5 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Join Telegram Channel
              </div>
            </Button>
            
            <Button 
              onClick={handleClose} 
              variant="outline"
              className="w-full bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-2.5 font-medium"
            >
              Start Trading
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}