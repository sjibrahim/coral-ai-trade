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
import { Wallet, DollarSign, Shield, Zap, TrendingUp, ArrowRight } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative px-6 py-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Recharge Wallet</h1>
              <p className="text-gray-300 text-sm max-w-sm mx-auto">
                Add funds to your trading wallet securely and instantly
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 space-y-6">

          {/* Select Payment Channel */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-blue-400 mr-3" />
              <h3 className="text-white font-semibold">Payment Channel</h3>
            </div>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-full bg-gray-700/30 border-gray-600/30 text-gray-200 h-14 rounded-xl hover:bg-gray-600/30 transition-colors">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600/50 rounded-xl">
                {paymentMethods.map(method => (
                  <SelectItem 
                    key={method.id} 
                    value={method.id} 
                    className="text-gray-200 hover:bg-gray-700/50 focus:bg-gray-700/50 rounded-lg m-1"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      {method.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enter Amount */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
            <div className="flex items-center mb-4">
              <Wallet className="w-5 h-5 text-blue-400 mr-3" />
              <h3 className="text-white font-semibold">Deposit Amount</h3>
            </div>
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-gray-700/30 border border-gray-600/30 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none text-xl font-medium"
                placeholder={`Min ₹${minDepositAmount}`}
                maxLength={10}
              />
            </div>
            
            {/* Quick Amount Selection */}
            <div>
              <p className="text-gray-400 text-sm mb-4">Quick Select</p>
              <div className="grid grid-cols-4 gap-3">
                {[100, 500, 1000, 5000].map(quickAmount => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="py-3 px-2 bg-gray-700/20 hover:bg-blue-500/20 border border-gray-600/20 hover:border-blue-400/50 rounded-xl text-sm text-gray-300 hover:text-blue-300 transition-all duration-200 font-medium"
                  >
                    ₹{quickAmount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/20">
              <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-gray-300">Secure</p>
            </div>
            <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/20">
              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-gray-300">Instant</p>
            </div>
            <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/20">
              <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-gray-300">Trading</p>
            </div>
          </div>

          {/* Deposit Summary */}
          {amount && selectedChannel && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <ArrowRight className="w-4 h-4 mr-2 text-blue-400" />
                Transaction Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Amount:</span>
                  <span className="text-white font-semibold text-lg">₹{amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Channel:</span>
                  <span className="text-blue-300 font-medium">{paymentMethods.find(m => m.id === selectedChannel)?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Processing:</span>
                  <span className="text-green-400 font-medium flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Instant
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount || !selectedChannel}
            className={`w-full h-16 rounded-2xl font-semibold transition-all duration-300 text-lg flex items-center justify-center relative overflow-hidden ${
              isValidAmount && selectedChannel
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-700/30 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-3" />
                Confirm Deposit
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
