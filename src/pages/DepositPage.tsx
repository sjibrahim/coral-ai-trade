
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
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
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Main Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Header Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
            <h1 className="text-xl font-medium text-white">Recharge Wallet</h1>
          </div>

          {/* Select Channel Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
            <h2 className="text-white font-medium mb-4">Select Channel</h2>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-full bg-white/95 border-0 text-gray-900 h-14 rounded-xl font-medium">
                <SelectValue placeholder="Select Channel" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-xl">
                {paymentMethods.map(method => (
                  <SelectItem 
                    key={method.id} 
                    value={method.id} 
                    className="text-gray-900 hover:bg-gray-100 rounded-lg mx-1 my-0.5"
                  >
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enter Amount Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
            <h2 className="text-white font-medium mb-4">Enter Amount</h2>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 focus:outline-none transition-colors text-lg"
                placeholder={`Enter Amount Min ${minDepositAmount}$`}
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* Fixed Bottom Confirm Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm p-6 z-50">
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount || !selectedChannel || isLoading}
            className={`w-full h-14 rounded-2xl font-semibold text-lg transition-all ${
              isValidAmount && selectedChannel && !isLoading
                ? "bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-gray-900 shadow-lg"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <img 
                  src="/uploads/out.gif" 
                  alt="Loading" 
                  className="w-6 h-6 mr-2"
                />
                Processing...
              </div>
            ) : (
              "Confirm"
            )}
          </button>
        </div>

        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
