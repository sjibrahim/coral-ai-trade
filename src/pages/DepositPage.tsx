import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("PAY1");
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useGeneralSettings();
  
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
      title="Trexo Deposit"
    >
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Add Funds</h1>
            <p className="text-muted-foreground">Deposit to start trading on Trexo</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Clock className="h-4 w-4" />
              <span>Minimum ₹{minDepositAmount}</span>
            </div>
          </div>
          
          {/* Amount Input */}
          <AmountInput
            amount={amount}
            onChange={setAmount}
            minAmount={minDepositAmount}
            quickAmounts={["1000", "2000", "3000", "5000"]}
          />
          
          {/* Payment Options Card */}
          <Card className="mt-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">Payment Gateway</h3>
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">₹</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <PaymentMethodSelector
                  methods={paymentMethods}
                  selectedMethod={selectedChannel}
                  onSelect={setSelectedChannel}
                />
                
                <ConfirmButton
                  onClick={handleConfirm}
                  disabled={!isValidAmount}
                  isLoading={isLoading}
                  text="PROCEED TO PAYMENT"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                />
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Secure payment processing by Trexo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Why Choose Trexo */}
          <Card className="mt-6 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4">Why Choose Trexo?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                    <span className="text-lg font-bold">⚡</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Instant Processing</h4>
                    <p className="text-xs text-muted-foreground">Deposits credited immediately after confirmation</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                    <span className="text-lg font-bold">🔒</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Bank-Grade Security</h4>
                    <p className="text-xs text-muted-foreground">Your funds are protected with advanced encryption</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                    <span className="text-lg font-bold">📞</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">24/7 Support</h4>
                    <p className="text-xs text-muted-foreground">Our team is always here to help you</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
