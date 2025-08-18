import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { createTopupOrder } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wallet, DollarSign, Info } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <img 
          src="/uploads/out.gif" 
          alt="Loading" 
          className="w-16 h-16"
        />
      </div>
    );
  }
  
  return (
    <MobileLayout showBackButton title="Recharge Wallet" hideFooter>
      <div className="min-h-screen bg-gray-900">
        
        <div className="px-4 py-6 space-y-6">

          {/* Important Information */}
          <div className="bg-blue-800/30 rounded-xl border border-blue-700/50 p-4">
            <div className="flex items-center mb-3">
              <Info className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="text-white font-medium">Important Information</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>1. The minimum recharge is 600, and you can recharge unlimited times</p>
              <p>2. When you encounter payment failure, please change other recharge channels (PAY-1, PAY-2, PAY-3, PAY-4) to pay, or change other wallet software to pay, or adjust the recharge amount (such as 603, 1012, 2007) for payment</p>
              <p>3. If the payment is successful but the funds are not shown in your account, please provide a screenshot of the successful UTR payment and contact the website customer service to resolve the issue.</p>
            </div>
          </div>

          {/* Select Payment Channel */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-[#00e8be] mr-2" />
              <h3 className="text-white font-medium">Payment Channel</h3>
            </div>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-full bg-gray-700/50 border-gray-600/50 text-gray-200 h-12 rounded-lg focus:ring-white">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {paymentMethods.map(method => (
                  <SelectItem 
                    key={method.id} 
                    value={method.id} 
                    className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
                  >
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enter Amount */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-4">
              <Wallet className="w-5 h-5 text-[#00e8be] mr-2" />
              <h3 className="text-white font-medium">Deposit Amount</h3>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#00e8be] focus:outline-none focus:ring-white text-lg"
                placeholder={`Min ${minDepositAmount}`}
                maxLength={10}
              />
            </div>
            
            {/* Quick Amount Selection */}
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-3">Quick Select</p>
              <div className="grid grid-cols-4 gap-2">
                {[600, 1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000, 30000, 50000, 100000].map(quickAmount => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="py-2 px-3 bg-gray-700/30 hover:bg-[#00e8be]/20 border border-gray-600/30 hover:border-[#00e8be]/50 rounded-lg text-sm text-gray-300 hover:text-[#00e8be] transition-all duration-200"
                  >
                    ₹{quickAmount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Deposit Summary */}
          {amount && selectedChannel && (
            <div className="bg-gradient-to-r from-[#00e8be]/5 to-cyan-400/5 rounded-xl p-4 border border-[#00e8be]/20">
              <h4 className="text-white font-medium mb-3">Deposit Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-medium">₹{amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Channel:</span>
                  <span className="text-white">{paymentMethods.find(m => m.id === selectedChannel)?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processing:</span>
                  <span className="text-[#00e8be]">Instant</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount || !selectedChannel}
            className={`w-full h-14 rounded-xl font-semibold transition-all duration-300 text-lg flex items-center justify-center ${
              isValidAmount && selectedChannel
                ? "bg-[#00e8be] text-gray-900 hover:shadow-lg hover:shadow-[#00e8be]/25 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Confirm Deposit
              </>
            )}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
