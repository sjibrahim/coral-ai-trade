
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Bell, IndianRupee, Upload, Check, CreditCard, Wallet, Clock, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createTopupOrder } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { Input } from "@/components/ui/input";

interface PaymentMethod {
  id: string;
  name: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "PAY1",
    name: "PAY-1"
  },
  {
    id: "PAY2",
    name: "PAY-2"
  },
  {
    id: "PAY3",
    name: "PAY-3"
  },
  {
    id: "PAY4",
    name: "PAY-4"
  }
];

const DepositPage = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("PAY1");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const { settings } = useGeneralSettings();
  
  const minDepositAmount = parseFloat(settings.min_deposit || "600");
  const isValidAmount = Number(amount) >= minDepositAmount;
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Handle decimal point (only one allowed)
    if (newValue.split('.').length > 2) return;
    
    setAmount(newValue);
  };
  
  const handleConfirm = async () => {
    if (!isValidAmount || !user?.token) return;
    
    setIsLoading(true);
    
    try {
      const response = await createTopupOrder(user.token, Number(amount), selectedChannel);
      
      if (response.status && response.data?.redirect_url) {
        // Direct redirect to payment page instead of showing modal
        window.location.href = response.data.redirect_url;
        return;
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
        {/* Amount Card Section - Fixed at the top */}
        <div className="p-4 pb-2">
          <div className="bg-[#1a1c25] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-white/80">Amount</h3>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Min ₹{minDepositAmount}</span>
              </div>
            </div>
            
            <div className="relative mb-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <IndianRupee className="h-6 w-6 text-white/70 mr-1" />
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmountChange}
                    className="text-3xl font-bold text-white bg-transparent border-none p-0 h-auto w-36 text-center focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="0"
                    maxLength={10}
                  />
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

            <div className="grid grid-cols-4 gap-2 mb-1">
              {["1000", "2000", "3000", "5000"].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className={cn(
                    "py-1.5 rounded-full border text-center text-sm",
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
        <div className="px-4 pb-3">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Payment Channel</h3>
          <div className="grid grid-cols-4 gap-2">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedChannel(method.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all",
                  selectedChannel === method.id
                    ? "border-blue-600 bg-blue-600/10 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-600"
                )}
              >
                <span className="text-sm whitespace-nowrap">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Button Section */}
        <div className="flex-1 flex flex-col items-center justify-end pb-5 px-4">
          <div className="w-full max-w-xs">
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
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                By proceeding, you agree to our terms and conditions for online payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
