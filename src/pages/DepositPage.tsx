import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Clock, Zap, Shield, Sparkles, CreditCard, ArrowUp, CheckCircle, Gift } from "lucide-react";
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
    <MobileLayout showBackButton title="Add Funds">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="px-3 py-4">
          {/* Hero Header */}
          <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 p-4 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-white/10 transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-white/10 transform -translate-x-6 translate-y-6"></div>
            
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h1 className="text-lg font-bold">Fund Your Account</h1>
              </div>
              <p className="text-indigo-100 text-xs mb-3">Start your trading journey with Trexo</p>
              
              <div className="flex items-center justify-center space-x-1 text-xs">
                <Clock className="h-3 w-3" />
                <span className="text-white/90">Minimum ₹{minDepositAmount}</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: Zap, title: "Instant", desc: "Credit", color: "from-yellow-400 to-orange-500" },
              { icon: Shield, title: "Secure", desc: "Payment", color: "from-green-400 to-emerald-500" },
              { icon: Gift, title: "Bonus", desc: "Rewards", color: "from-pink-400 to-rose-500" }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-3 text-center">
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-1`}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-gray-800">{feature.title}</p>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Amount Input */}
          <Card className="mb-4 bg-white/90 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2">
                  <ArrowUp className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Deposit Amount</h3>
              </div>
              
              <AmountInput
                amount={amount}
                onChange={setAmount}
                minAmount={minDepositAmount}
                quickAmounts={["1000", "2000", "3000", "5000"]}
              />
            </CardContent>
          </Card>

          {/* Payment Gateway */}
          <Card className="mb-4 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2">
                    <CreditCard className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Payment Gateway</h3>
                </div>
                <div className="px-2 py-1 bg-green-100 rounded-full">
                  <span className="text-xs font-medium text-green-700">Secure</span>
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
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-xs h-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Why Choose Trexo Payments?</h3>
              <div className="space-y-2">
                {[
                  { icon: "⚡", title: "Lightning Fast", desc: "Deposits credited within seconds" },
                  { icon: "🔒", title: "Bank-Grade Security", desc: "Advanced encryption & fraud protection" },
                  { icon: "📞", title: "24/7 Support", desc: "Round-the-clock assistance available" },
                  { icon: "🎁", title: "Welcome Bonus", desc: "Extra rewards for new deposits" }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-sm">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800">{benefit.title}</p>
                      <p className="text-xs text-gray-600">{benefit.desc}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;