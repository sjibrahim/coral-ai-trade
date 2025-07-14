
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
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 space-y-6">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Power Up Your Portfolio</h1>
            <p className="text-blue-200 text-sm">Instant deposits, endless possibilities</p>
            
            <div className="flex justify-center items-center mt-4 space-x-4 text-xs">
              <div className="flex items-center text-green-300">
                <Shield className="w-3 h-3 mr-1" />
                <span>Bank Grade Security</span>
              </div>
              <div className="flex items-center text-blue-300">
                <Zap className="w-3 h-3 mr-1" />
                <span>Instant Processing</span>
              </div>
            </div>
          </motion.div>

          {/* Amount Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Deposit Amount</h3>
                </div>
                
                <AmountInput
                  amount={amount}
                  onChange={setAmount}
                  minAmount={minDepositAmount}
                  quickAmounts={["1000", "2500", "5000", "10000"]}
                />
                
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                  <div className="flex items-center text-yellow-200 text-xs">
                    <Star className="w-3 h-3 mr-2" />
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
            <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">Payment Gateway</h3>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
                    <span className="text-green-300 text-xs font-medium">Secure</span>
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
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Zap, title: "Instant", desc: "Lightning fast deposits", color: "from-yellow-400 to-orange-500" },
              { icon: Shield, title: "Secure", desc: "256-bit encryption", color: "from-green-400 to-emerald-500" },
              { icon: Gift, title: "Rewards", desc: "Earn bonus points", color: "from-purple-400 to-pink-500" },
              { icon: Sparkles, title: "Premium", desc: "VIP treatment", color: "from-blue-400 to-cyan-500" }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-white/5 backdrop-blur-xl border-0">
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                  <p className="text-gray-300 text-xs">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4"
          >
            <ConfirmButton
              onClick={handleConfirm}
              disabled={!isValidAmount}
              isLoading={isLoading}
              text="FUND ACCOUNT NOW"
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-2xl border-0"
            />
            
            <div className="text-center mt-4">
              <p className="text-gray-300 text-xs">
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
