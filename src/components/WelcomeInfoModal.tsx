
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { useToast } from "@/components/ui/use-toast";

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-none bg-gradient-to-br from-[#141824] to-[#0f1219] p-0 overflow-hidden shadow-xl">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white">!!Important!!</h2>
            <p className="text-gray-300 font-semibold">
              Nexbit Is A Crypto Trading Platform
            </p>
          </div>

          {/* Key Info */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-300">Minimum Deposit</p>
              <p className="font-bold text-white">₹{settings.min_deposit || "300"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-300">Minimum Withdrawal</p>
              <p className="font-bold text-white">₹{settings.min_withdrawal || "300"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-300">Daily Trade Profit</p>
              <p className="font-bold text-green-400">{settings.daily_profit || "1.5"}%</p>
            </div>
          </div>
          
          {/* Customer Support */}
          <div className="pt-1">
            <p className="text-gray-300">
              Customer Support:- {settings.customer_support || "Available 24/7 to help with any issues"}
            </p>
          </div>
          
          {/* Telegram Section */}
          <div className="pt-1 space-y-3">
            <p className="text-center text-gray-300">
              Follow Telegram Channel For Daily Trade Signals
            </p>
            
            <Button 
              onClick={openTelegramChannel} 
              className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white"
            >
              Join Telegram
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
