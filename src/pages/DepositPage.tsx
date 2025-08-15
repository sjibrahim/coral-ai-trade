
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Wallet, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    if (newValue.split('.').length > 2) return;
    setAmount(newValue);
  };

  const handleConfirm = async () => {
    if (!isValidAmount || !user?.token) return;
    
    setIsLoading(true);
    
    try {
      const response = await createTopupOrder(user.token, Number(amount), selectedChannel);
      
      if (response.status && response.data?.redirect_url) {
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
    <MobileLayout showBackButton title="Fund Account">
      <div 
        className="min-h-screen text-white relative overflow-hidden pb-20"
        style={{
          backgroundImage: "url('/uploads/assetsbg-BsWPbjIy.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm"></div>

        <div className="relative z-10 p-4 space-y-6">
          {/* Header */}
          <div className="text-center py-4">
            <Card className="bg-gray-800/80 border border-gray-700/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mr-3">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">Fund Your Account</h1>
                    <p className="text-sm text-gray-300">Quick & Secure Deposits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Channel Selection */}
          <Card className="bg-gray-800/80 border border-gray-700/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-teal-400 mr-2" />
                <h3 className="text-base font-semibold text-white">Select Payment Channel</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedChannel(method.id)}
                    className={`py-3 px-4 rounded-xl border-2 transition-all text-sm font-semibold ${
                      selectedChannel === method.id
                        ? "border-teal-400 bg-teal-400/20 text-teal-300"
                        : "border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {method.name}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <Card className="bg-gray-800/80 border border-gray-700/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <Wallet className="w-5 h-5 text-teal-400 mr-2" />
                <h3 className="text-base font-semibold text-white">Enter Amount</h3>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmountChange}
                    className="pl-8 text-lg font-semibold bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400"
                    placeholder="Enter amount"
                    maxLength={10}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {["1000", "2500", "5000", "10000"].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount)}
                      className={`py-2 rounded-lg text-xs font-medium transition-all ${
                        amount === quickAmount
                          ? "bg-teal-400 text-gray-900"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                      }`}
                    >
                      ₹{quickAmount}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-gray-400 text-center">
                  Minimum deposit: ₹{minDepositAmount.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 p-4 z-50">
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount || isLoading}
            className={`w-full h-12 rounded-xl font-bold text-base transition-all ${
              isValidAmount && !isLoading
                ? "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-gray-900"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                Processing...
              </div>
            ) : (
              "CONFIRM DEPOSIT"
            )}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
