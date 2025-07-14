
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Wallet, TrendingUp, Shield, Zap, Gift, Star, CreditCard, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { createTopupOrder } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import AmountInput from "@/components/payments/AmountInput";
import PaymentMethodSelector from "@/components/payments/PaymentMethodSelector";
import ConfirmButton from "@/components/payments/ConfirmButton";
import { motion } from "framer-motion";

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
    <MobileLayout showBackButton title="Fund Account" hideNavbar>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 space-y-4">
          {/* Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white border-0 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">Fund Your Account</h1>
                    <p className="text-xs text-emerald-100">Instant deposits, secure payments</p>
                  </div>
                </div>
                
                <div className="flex justify-center items-center gap-4 text-xs">
                  <div className="flex items-center text-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    <span>Bank Grade Security</span>
                  </div>
                  <div className="flex items-center text-emerald-200">
                    <Zap className="w-3 h-3 mr-1" />
                    <span>Instant Processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Amount Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">Deposit Amount</h3>
                </div>
                
                <AmountInput
                  amount={amount}
                  onChange={setAmount}
                  minAmount={minDepositAmount}
                  quickAmounts={["1000", "2500", "5000", "10000"]}
                />
                
                <div className="mt-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center text-yellow-700 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    <span>Minimum deposit: ₹{minDepositAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Gateway */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-2">
                      <CreditCard className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800">Payment Gateway</h3>
                  </div>
                  <div className="px-2 py-1 bg-green-100 rounded-full border border-green-200">
                    <span className="text-green-700 text-xs font-medium">Secure</span>
                  </div>
                </div>
                
                <PaymentMethodSelector
                  methods={paymentMethods}
                  selectedMethod={selectedChannel}
                  onSelect={setSelectedChannel}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { icon: Zap, title: "Instant", desc: "Lightning fast", color: "from-yellow-400 to-orange-500" },
              { icon: Shield, title: "Secure", desc: "256-bit encryption", color: "from-green-400 to-emerald-500" },
              { icon: Gift, title: "Rewards", desc: "Earn bonus points", color: "from-purple-400 to-pink-500" },
              { icon: Sparkles, title: "Premium", desc: "VIP treatment", color: "from-blue-400 to-cyan-500" }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
                <CardContent className="p-3 text-center">
                  <div className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}>
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-gray-900 font-medium text-xs">{feature.title}</h4>
                  <p className="text-gray-600 text-xs">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <ConfirmButton
              onClick={handleConfirm}
              disabled={!isValidAmount}
              isLoading={isLoading}
              text="FUND ACCOUNT NOW"
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm rounded-xl shadow-lg border-0"
            />
            
            <div className="text-center mt-3">
              <p className="text-gray-500 text-xs">
                Funds will be credited instantly upon successful payment
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
