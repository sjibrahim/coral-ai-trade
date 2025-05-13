
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { useToast } from "@/hooks/use-toast";

export function WelcomeInfoModal() {
  const [open, setOpen] = useState(false);
  const { settings, loading } = useGeneralSettings();
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("nexbit_welcome_seen");
    
    if (!hasSeenModal) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("nexbit_welcome_seen", "true");
    setOpen(false);
  };

  const openTelegramChannel = () => {
    window.open(settings.telegram_channel || "https://t.me/nexbit_official", "_blank");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-blue-500/20 bg-gradient-to-br from-background to-blue-950/20 p-0 overflow-hidden">
        <div className="p-5 space-y-4">
          <div className="text-center space-y-2">
            <div className="px-4 py-1 mx-auto rounded-full bg-blue-500/10 text-blue-400 text-sm w-fit font-medium">
              !! Important !!
            </div>
            <h2 className="text-xl font-bold text-gradient">Nexbit Is A Crypto Trading Platform</h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Minimum Deposit</p>
                  <p className="font-semibold">₹{settings.min_deposit || "300"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Minimum Withdrawal</p>
                  <p className="font-semibold">₹{settings.min_withdrawal || "300"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Daily Trade Profit</p>
                  <p className="font-semibold text-market-increase">
                    {settings.daily_profit || "1.5"}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">USDT Price</p>
                  <p className="font-semibold">₹{settings.usdt_price || "85"}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm">
              <p className="font-medium mb-1">Customer Support:</p>
              <p className="text-primary">support@nexbit.com</p>
            </div>
            
            <div className="text-center pt-2">
              <p className="text-sm mb-3">Follow Telegram Channel For Daily Trade Signals</p>
              <Button 
                onClick={openTelegramChannel} 
                className="bg-[#0088cc] hover:bg-[#0077b5] transition-all w-full"
              >
                Join Telegram
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
