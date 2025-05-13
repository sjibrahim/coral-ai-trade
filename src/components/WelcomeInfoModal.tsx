
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";

export function WelcomeInfoModal() {
  const [open, setOpen] = useState(false);
  const { settings, loading } = useGeneralSettings();
  const { toast } = useToast();

  useEffect(() => {
    // Always show the modal when user visits homepage
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const openTelegramChannel = () => {
    window.open(settings.telegram_channel || "https://t.me/nexbit_official", "_blank");
  };

  const openCustomerSupport = () => {
    window.open(`https://t.me/${settings.customer_support}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-none bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-0 overflow-hidden shadow-xl rounded-xl">
        <div className="p-6 space-y-5">
          {/* Header with animated gradient border */}
          <div className="text-center space-y-1 relative">
            <div className="absolute inset-x-0 -top-6 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
            <h2 className="text-xl font-bold text-gradient bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">!!Important!!</h2>
            <p className="text-gray-300 font-medium">
              Nexbit Is A Crypto Trading Platform
            </p>
          </div>

          {/* Key Info with improved styling */}
          <div className="space-y-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center">
              <p className="text-gray-300">Minimum Deposit</p>
              <p className="font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-300 bg-clip-text text-transparent">₹{settings.min_deposit || "300"}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-300">Minimum Withdrawal</p>
              <p className="font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-300 bg-clip-text text-transparent">₹{settings.min_withdrawal || "300"}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-300">Daily Trade Profit</p>
              <p className="font-bold text-green-400">{settings.daily_profit || "1.5"}%</p>
            </div>
          </div>
          
          {/* Customer Support with clickable link */}
          <div 
            onClick={openCustomerSupport}
            className="pt-1 bg-white/5 rounded-lg p-3 border border-white/10 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors"
          >
            <p className="text-gray-300">
              Customer Support: <span className="text-blue-300">{settings.customer_support || "nexbit_support"}</span>
            </p>
            <ExternalLink size={16} className="text-blue-300" />
          </div>
          
          {/* Telegram Section with improved styling */}
          <div className="pt-1 space-y-3">
            <p className="text-center text-gray-300">
              Follow Telegram Channel For Daily Trade Signals
            </p>
            
            <Button 
              onClick={openTelegramChannel} 
              className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium flex items-center justify-center gap-2"
            >
              Join Telegram
              <ExternalLink size={16} />
            </Button>
            
            <Button 
              onClick={handleClose} 
              variant="outline"
              className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
