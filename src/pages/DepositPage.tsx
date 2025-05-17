
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Bell, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createTopupOrder } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import AmountInput from "@/components/payments/AmountInput";
import PaymentMethodSelector from "@/components/payments/PaymentMethodSelector";
import ConfirmButton from "@/components/payments/ConfirmButton";

interface PaymentMethod {
  id: string;
  name: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: "PAY1", name: "PAY-1" },
  { id: "PAY2", name: "PAY-2" },
  { id: "PAY3", name: "PAY-3" },
  { id: "PAY4", name: "PAY-4" }
];

const DepositPage = () => {
  const { user, refreshUserData } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("PAY1");
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useGeneralSettings();
  
  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);
  
  const minDepositAmount = parseFloat(settings.min_deposit || "600");
  const isValidAmount = Number(amount) >= minDepositAmount;
  
  const handleConfirm = async () => {
    if (!isValidAmount || !user?.token) return;
    
    setIsLoading(true);
    
    try {
      const response = await createTopupOrder(user.token, Number(amount), selectedChannel);
      
      if (response.status && response.data?.redirect_url) {
        // Direct redirect to payment page
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
    >
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 pb-5">
          <div className="flex justify-end mb-2">
            <div className="flex items-center gap-1 text-sm text-gray-400 bg-[#1a1c25]/50 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4" />
              <span>Min ₹{minDepositAmount}</span>
            </div>
          </div>
          
          {/* Amount Input */}
          <AmountInput
            amount={amount}
            onChange={setAmount}
            minAmount={minDepositAmount}
            quickAmounts={["1000", "2000", "3000", "5000"]}
          />
          
          {/* Card with fancy background */}
          <div className="mt-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-5 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Payment Options</h3>
            </div>
            
            <div className="mt-4">
              <PaymentMethodSelector
                methods={paymentMethods}
                selectedMethod={selectedChannel}
                onSelect={setSelectedChannel}
              />
            </div>
            
            <div className="mt-6">
              <ConfirmButton
                onClick={handleConfirm}
                disabled={!isValidAmount}
                isLoading={isLoading}
                text="CONFIRM DEPOSIT"
              />
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                By proceeding, you agree to our terms and conditions for online payments
              </p>
            </div>
          </div>
          
          {/* Additional information card */}
          <div className="mt-6 bg-[#1a1c25] rounded-2xl p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Why deposit with us?</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mr-3">
                  <span className="text-lg">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Instant Processing</h4>
                  <p className="text-xs text-gray-400">Deposits are processed immediately after confirmation</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mr-3">
                  <span className="text-lg">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Secure Transactions</h4>
                  <p className="text-xs text-gray-400">All deposits are secured with industry-standard encryption</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mr-3">
                  <span className="text-lg">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">24/7 Support</h4>
                  <p className="text-xs text-gray-400">Our support team is available around the clock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
