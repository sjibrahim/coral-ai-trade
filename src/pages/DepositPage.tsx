
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { Bell, IndianRupee, Upload, Check, CreditCard, Copy, Wallet, Clock, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createTopupOrder } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { useGeneralSettings } from "@/hooks/use-general-settings";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "PAY1",
    name: "UPI Pay",
    icon: Wallet
  },
  {
    id: "PAY2",
    name: "Card Pay",
    icon: CreditCard
  },
  {
    id: "PAY3",
    name: "E-Wallet",
    icon: Upload
  },
  {
    id: "PAY4",
    name: "Net Banking",
    icon: Wallet
  }
];

const DepositPage = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("PAY1");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useGeneralSettings();
  
  const minDepositAmount = parseFloat(settings.min_deposit || "600");
  const isValidAmount = Number(amount) >= minDepositAmount;
  
  const handleConfirm = async () => {
    if (!isValidAmount || !user?.token) return;
    
    setIsLoading(true);
    
    try {
      const response = await createTopupOrder(user.token, Number(amount), selectedChannel);
      
      if (response.status) {
        if (response.data?.redirect_url) {
          setRedirectUrl(response.data.redirect_url);
        }
        
        setShowSuccessModal(true);
        
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

  const getStatusIcon = () => {
    if (isValidAmount) return <Check className="h-5 w-5 text-green-500" />;
    return <Ban className="h-5 w-5 text-red-500" />;
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
      <div className="flex flex-col h-full bg-background">
        {/* Amount Card Section */}
        <div className="p-4">
          <div className="bg-[#1a1c25] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white/80">Amount</h3>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Min ₹{minDepositAmount}</span>
              </div>
            </div>
            
            <div className="relative mb-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <IndianRupee className="h-6 w-6 text-white/70 mr-1" />
                  <span className="text-5xl font-bold text-white">
                    {amount ? amount : "0"}
                  </span>
                </div>
              </div>

              <div className="absolute right-0 top-0 flex items-center gap-2">
                {getStatusIcon()}
                {isValidAmount ? 
                  <span className="text-xs text-green-500">Valid amount</span> : 
                  <span className="text-xs text-red-500">Below minimum</span>
                }
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-2">
              {["1000", "2000", "3000", "5000"].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className={cn(
                    "py-2 rounded-full border text-center",
                    amount === quickAmount
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-gray-700 text-gray-400 hover:border-gray-600"
                  )}
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="px-4 mb-4">
          <h3 className="text-base font-medium text-gray-200 mb-3">Payment Channel</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedChannel(method.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                  selectedChannel === method.id
                    ? "border-blue-600 bg-blue-600/10 text-white shadow-sm"
                    : "border-gray-700 text-gray-400 hover:border-gray-600"
                )}
              >
                <method.icon className={cn(
                  "h-6 w-6 mb-2",
                  selectedChannel === method.id ? "text-blue-400" : "text-gray-500"
                )} />
                <span className="text-sm">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Keypad Section */}
        <div className="mt-auto pt-2 pb-6">
          <div className="flex justify-center mb-5">
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
                "w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center",
                isValidAmount && !isLoading
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg active:scale-[0.98]" 
                  : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
              )}
            >
              {isLoading ? "Processing..." : "CONFIRM DEPOSIT"}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By proceeding, you agree to our terms and conditions for online payments
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md border-border/30 p-0 overflow-hidden bg-[#1a1c25]">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-green-600/20 flex items-center justify-center animate-pulse-glow">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Deposit Initiated!</h2>
            <p className="text-gray-400 text-center">
              Your deposit of <span className="text-blue-400 font-medium">₹{amount}</span> has been initiated successfully.
              {redirectUrl ? " You will now be redirected to complete the payment." : " It will be credited to your account shortly."}
            </p>
            {redirectUrl ? (
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600"
                onClick={() => {
                  window.location.href = redirectUrl;
                  setShowSuccessModal(false);
                }}
              >
                Proceed to Payment
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
