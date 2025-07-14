
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Check, Wallet, ArrowDown, CreditCard, Clock, Shield, Banknote, TrendingDown, Target, Zap } from "lucide-react";
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
    <MobileLayout showBackButton title="Withdraw Funds" hideNavbar>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 space-y-6">
          {/* Balance Hero */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
              <TrendingDown className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Withdraw Earnings</h1>
            <p className="text-purple-200 text-sm mb-6">Transfer your profits instantly</p>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Wallet className="w-5 h-5 text-emerald-300 mr-2" />
                <span className="text-gray-300 text-sm">Available Balance</span>
              </div>
              <p className="text-3xl font-bold text-white">₹{availableBalance.toLocaleString()}</p>
              
              <div className="flex justify-center space-x-6 mt-4 text-xs">
                <div className="flex items-center text-green-300">
                  <Target className="w-3 h-3 mr-1" />
                  <span>Min: ₹{minWithdrawal}</span>
                </div>
                <div className="flex items-center text-orange-300">
                  <Banknote className="w-3 h-3 mr-1" />
                  <span>Fee: {withdrawalFeePercentage}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-red-500/20 border border-red-400/30">
                <CardContent className="p-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Amount Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <ArrowDown className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Withdrawal Amount</h3>
                </div>
                
                <AmountInput
                  amount={amount}
                  onChange={setAmount}
                  minAmount={minWithdrawal}
                  maxAmount={availableBalance}
                  quickAmounts={["1000", "2500", "5000", "10000"]}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Calculation Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4">Transaction Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Withdrawal Amount</span>
                    <span className="text-white font-medium">₹{amount || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Processing Fee ({withdrawalFeePercentage}%)</span>
                    <span className="text-red-300 font-medium">-₹{withdrawalFeeAmount.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Net Amount</span>
                    <span className="text-emerald-300 font-bold text-lg">₹{netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bank Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Destination Bank</h3>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  {[
                    { label: "Account Holder", value: accountName },
                    { label: "Account Number", value: bankAccount },
                    { label: "IFSC Code", value: ifscCode },
                    { label: "Bank Name", value: bankName }
                  ].map((detail, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">{detail.label}</span>
                      <span className="text-white font-medium">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4"
          >
            <ConfirmButton
              onClick={handleConfirm}
              disabled={!isValidAmount || bankAccount === "Not set" || ifscCode === "Not set"}
              isLoading={isProcessing}
              text="PROCESS WITHDRAWAL"
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm rounded-2xl shadow-2xl border-0"
            />
            
            <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-2" />
              <span>Processed within 24 hours on business days</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-900 to-emerald-900 border-0 shadow-2xl p-0 overflow-hidden">
          <div className="relative p-8">
            <div className="flex flex-col items-center text-white">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4"
              >
                <Check className="h-10 w-10 text-white" />
              </motion.div>
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-xl font-bold mb-2"
              >
                Withdrawal Submitted!
              </motion.h2>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-green-100 text-sm text-center mb-6"
              >
                Your withdrawal request for ₹{amount} has been submitted. You will receive ₹{netAmount.toFixed(2)} after processing fee deduction.
              </motion.p>
              <Button 
                className="w-full bg-white text-green-900 hover:bg-gray-100 font-bold rounded-xl" 
                onClick={() => setShowSuccessModal(false)}
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default WithdrawPage;
