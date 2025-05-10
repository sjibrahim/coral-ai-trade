
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { Bell, IndianRupee, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createTopupOrder } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

const DepositPage = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("PAY1");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const paymentChannels = ["PAY1", "PAY2", "PAY3", "PAY4"];
  const isValidAmount = Number(amount) >= 600;
  
  const handleConfirm = async () => {
    if (!isValidAmount || !user?.token) return;
    
    setIsLoading(true);
    
    try {
      const response = await createTopupOrder(user.token, Number(amount));
      
      if (response.status) {
        if (response.data?.redirect_url) {
          setRedirectUrl(response.data.redirect_url);
        }
        
        // Show success modal
        setShowSuccessModal(true);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          setAmount("");
        }, 3000);
      } else {
        toast({
          title: "Payment Failed",
          description: response.msg || "No active gateway available",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Deposit error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MobileLayout 
      showBackButton 
      title="Deposit"
      rightActions={(
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      )}
      noScroll
    >
      <div className="flex flex-col h-full bg-background justify-between">
        
        {/* Top Section - Amount Display */}
        <div className="pt-8 px-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="relative flex items-center justify-center">
              <IndianRupee className="absolute -left-8 top-3 h-8 w-8 text-gray-300" />
              <span className="text-8xl font-bold text-gray-200">
                {amount ? amount : "0"}
              </span>
            </div>
          </div>
          
          <div className="mt-1 text-right">
            <p className="text-gray-400 text-base">Minimum Deposit <span className="text-primary">₹600</span></p>
          </div>
        </div>
        
        {/* Middle Section - Payment Channels */}
        <div className="px-4">
          <h3 className="text-center text-xl text-gray-300 mb-3">Payment Channels</h3>
          <div className="bg-[#1a1c25] rounded-full p-1 flex justify-between">
            {paymentChannels.map((channel) => (
              <button 
                key={channel}
                className={cn(
                  "py-3 px-4 rounded-full transition-all flex-1 text-center font-medium",
                  selectedChannel === channel 
                    ? 'bg-[#1e222e] text-white scale-105 shadow-lg' 
                    : 'text-gray-400'
                )}
                onClick={() => setSelectedChannel(channel)}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Section - Keypad */}
        <div className="pt-4 pb-6 flex flex-col">
          <div className="flex justify-center">
            <NumericKeypad 
              value={amount}
              onChange={setAmount}
              size="lg"
              deleteIcon="backspace"
              clearText="clr"
              className="mx-auto"
            />
          </div>

          <div className="px-4">
            <button 
              onClick={isValidAmount ? handleConfirm : undefined}
              disabled={!isValidAmount || isLoading}
              className={cn(
                "w-full py-4 rounded-lg text-white text-lg font-medium transition-all",
                isValidAmount && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]" 
                  : "bg-blue-600/50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Processing..." : "CONFIRM"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-card border-border/50 p-0 overflow-hidden">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse-glow">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">Deposit Successful!</h2>
            <p className="text-muted-foreground text-center">
              Your deposit of ₹{amount} has been initiated successfully.
              {redirectUrl ? " You will be redirected to the payment gateway." : " It will be credited to your account shortly."}
            </p>
            {redirectUrl ? (
              <Button 
                className="w-full" 
                onClick={() => {
                  window.location.href = redirectUrl;
                  setShowSuccessModal(false);
                }}
              >
                Go to Payment Gateway
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default DepositPage;
