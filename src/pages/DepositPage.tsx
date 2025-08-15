
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createTopupOrder } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedChannel, setSelectedChannel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useGeneralSettings();
  
  const minDepositAmount = parseFloat(settings.min_deposit || "10");
  const isValidAmount = Number(amount) >= minDepositAmount;
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    if (newValue.split('.').length > 2) return;
    setAmount(newValue);
  };

  const handleConfirm = async () => {
    if (!isValidAmount || !selectedChannel || !user?.token) return;
    
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
    <MobileLayout showBackButton title="Recharge Wallet" hideFooter>
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 p-6 space-y-8">
          {/* Header Section */}
          <div className="pt-8 pb-4">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h1 className="text-xl font-semibold text-white mb-2">Recharge Wallet</h1>
              <p className="text-gray-400 text-sm">Quick and secure deposits</p>
            </div>
          </div>

          {/* Select Channel Section */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-white font-medium mb-4">Select Channel</h2>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white h-14 rounded-xl">
                <SelectValue placeholder="Select Channel" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {paymentMethods.map(method => (
                  <SelectItem key={method.id} value={method.id} className="text-white hover:bg-gray-700">
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enter Amount Section */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-white font-medium mb-4">Enter Amount</h2>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 focus:outline-none transition-colors text-lg"
                placeholder={`Enter Amount Min ${minDepositAmount}$`}
                maxLength={10}
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {["100", "500", "1000", "5000"].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className={`py-3 rounded-lg text-sm font-medium transition-all ${
                    amount === quickAmount
                      ? "bg-teal-400 text-gray-900"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600"
                  }`}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Confirm Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 p-6 z-50">
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount || !selectedChannel || isLoading}
            className={`w-full h-14 rounded-2xl font-semibold text-lg transition-all ${
              isValidAmount && selectedChannel && !isLoading
                ? "bg-gradient-to-r from-teal-400 to-green-400 hover:from-teal-500 hover:to-green-500 text-gray-900 shadow-lg"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                Processing...
              </div>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
