import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Check, Wallet, ArrowDown, CreditCard, Clock, Shield, Banknote, TrendingDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createWithdrawOrder, getGeneralSettings } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AmountInput from "@/components/payments/AmountInput";
import ConfirmButton from "@/components/payments/ConfirmButton";
import { motion } from "framer-motion";
import { useGeneralSettings } from "@/hooks/use-general-settings";

interface GeneralSettings {
  min_withdrawal: string;
}

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<GeneralSettings>({ min_withdrawal: "300" });
  
  const navigate = useNavigate();
  const { user, updateProfile, refreshUserData } = useAuth();
  const { toast } = useToast();
  
  const { settings: generalSettings } = useGeneralSettings();
  
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        
        const response = await getGeneralSettings(token);
        if (response.status && response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch general settings:", error);
      }
    };
    
    fetchSettings();
  }, []);

  useEffect(() => {
    if (user) {
      const isBankNotSet = !user.account_number || !user.account_ifsc;
      
      if (isBankNotSet) {
        toast({
          title: "Bank Details Required",
          description: "Please set up your bank details before making a withdrawal.",
          variant: "destructive",
        });
        navigate("/bank");
      }
    }
  }, [user, navigate, toast]);
  
  const availableBalance = user?.wallet ? parseFloat(user.income) : 0;
  const bankAccount = user?.account_number || "Not set";
  const ifscCode = user?.account_ifsc || "Not set";
  const bankName = user ? (user as any).bank_name || "Not set" : "Not set";
  const accountName = user?.account_holder_name || user?.name || "Account Holder";

  const minWithdrawal = parseInt(settings.min_withdrawal) || 300;
  const withdrawalFeePercentage = parseFloat(generalSettings.withdrawal_fee) || 2;
  const isValidAmount = Number(amount) >= minWithdrawal && Number(amount) <= availableBalance;
  
  const withdrawalFeeAmount = amount ? (parseFloat(amount) * withdrawalFeePercentage / 100) : 0;
  const netAmount = amount ? parseFloat(amount) - withdrawalFeeAmount : 0;
  
  const handleConfirm = async () => {
    if (!isValidAmount) {
      setError(`Please enter a valid amount (minimum ₹${minWithdrawal} and not exceeding your balance)`);
      return;
    }
    
    setIsProcessing(true);
    setError("");
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await createWithdrawOrder(token, Number(amount));
      
      if (response.status) {
        setShowSuccessModal(true);
        await updateProfile();
        
        setTimeout(() => {
          setShowSuccessModal(false);
          setAmount("");
        }, 3000);
      } else {
        setError(response.msg || "Failed to process withdrawal");
        toast({
          title: "Withdrawal Failed",
          description: response.msg || "Failed to process withdrawal",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      setError("Something went wrong. Please try again later.");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <MobileLayout showBackButton title="Withdraw">
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50">
        <div className="px-3 py-4">
          {/* Hero Header */}
          <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 via-pink-600 to-orange-600 p-4 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 transform translate-x-6 -translate-y-6"></div>
            <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-white/10 transform -translate-x-4 translate-y-4"></div>
            
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <h1 className="text-lg font-bold">Withdraw Funds</h1>
              </div>
              <p className="text-rose-100 text-xs mb-3">Transfer your earnings instantly</p>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-center mb-1">
                  <Wallet className="h-4 w-4 mr-1" />
                  <span className="text-white/90 text-xs">Available Balance</span>
                </div>
                <p className="text-white text-xl font-bold">₹{availableBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: Clock, title: "24hrs", desc: "Processing", color: "from-blue-400 to-cyan-500" },
              { icon: Shield, title: "Secure", desc: "Transfer", color: "from-green-400 to-emerald-500" },
              { icon: Banknote, title: `${withdrawalFeePercentage}%`, desc: "Fee", color: "from-orange-400 to-red-500" }
            ].map((stat, idx) => (
              <Card key={idx} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-3 text-center">
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-1`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-gray-800">{stat.title}</p>
                  <p className="text-xs text-gray-600">{stat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <Card className="mb-4 bg-red-50 border border-red-200 shadow-sm">
              <CardContent className="p-3">
                <p className="text-red-600 text-xs">{error}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Amount Input */}
          <Card className="mb-4 bg-white/90 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center mr-2">
                  <ArrowDown className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Withdrawal Amount</h3>
              </div>
              
              <AmountInput
                amount={amount}
                onChange={setAmount}
                minAmount={minWithdrawal}
                maxAmount={availableBalance}
                quickAmounts={["500", "1000", "2000", "5000"]}
              />
            </CardContent>
          </Card>
          
          {/* Withdrawal Summary */}
          <Card className="mb-4 bg-gradient-to-br from-white via-rose-50/30 to-orange-50/30 border-0 shadow-lg">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Withdrawal Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Withdrawal Amount</span>
                  <span className="font-medium text-gray-800">₹{amount || '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Processing Fee ({withdrawalFeePercentage}%)</span>
                  <span className="font-medium text-red-600">₹{withdrawalFeeAmount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">Net Amount</span>
                  <span className="font-bold text-green-600">₹{netAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="mb-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2">
                  <CreditCard className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Bank Account</h3>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                {[
                  { label: "Account Holder", value: accountName },
                  { label: "Account Number", value: bankAccount },
                  { label: "IFSC Code", value: ifscCode },
                  { label: "Bank Name", value: bankName }
                ].map((detail, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">{detail.label}</span>
                    <span className="text-xs font-medium text-gray-800">{detail.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Submit Button */}
          <ConfirmButton
            onClick={handleConfirm}
            disabled={!isValidAmount || bankAccount === "Not set" || ifscCode === "Not set"}
            isLoading={isProcessing}
            text="SUBMIT WITHDRAWAL"
            className="w-full mb-4 bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-xs h-10"
          />
          
          <p className="text-xs text-center text-gray-500">
            Withdrawals are processed within 24 hours on business days
          </p>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl p-0 overflow-hidden">
          <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col items-center text-white">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3"
              >
                <Check className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-lg font-bold mb-2"
              >
                Withdrawal Submitted!
              </motion.h2>
            </div>
          </div>
          
          <div className="p-6">
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-gray-600 text-xs text-center mb-4"
            >
              Your withdrawal request for ₹{amount} has been submitted. After deducting the {withdrawalFeePercentage}% processing fee, you will receive ₹{netAmount.toFixed(2)} in your bank account within 24 hours.
            </motion.p>
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs h-9" 
              onClick={() => setShowSuccessModal(false)}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default WithdrawPage;