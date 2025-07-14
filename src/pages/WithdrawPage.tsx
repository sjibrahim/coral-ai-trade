
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 space-y-4">
          {/* Balance Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">Withdraw Earnings</h1>
                    <p className="text-sm text-emerald-100">Transfer your profits securely</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <div className="flex items-center justify-center mb-2">
                    <Wallet className="w-5 h-5 text-emerald-200 mr-2" />
                    <span className="text-sm text-emerald-200">Available Balance</span>
                  </div>
                  <p className="text-xl font-bold text-white">₹{availableBalance.toLocaleString()}</p>
                  
                  <div className="flex justify-center space-x-4 mt-3 text-sm">
                    <div className="flex items-center text-green-200">
                      <Target className="w-4 h-4 mr-2" />
                      <span>Min: ₹{minWithdrawal}</span>
                    </div>
                    <div className="flex items-center text-orange-200">
                      <Banknote className="w-4 h-4 mr-2" />
                      <span>Fee: {withdrawalFeePercentage}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-red-50 border border-red-200">
                <CardContent className="p-3">
                  <p className="text-red-600 text-sm">{error}</p>
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
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <ArrowDown className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Withdrawal Amount</h3>
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
          
          {/* Transaction Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Transaction Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Withdrawal Amount</span>
                    <span className="text-gray-900 font-medium">₹{amount || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Processing Fee ({withdrawalFeePercentage}%)</span>
                    <span className="text-red-600 font-medium">-₹{withdrawalFeeAmount.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-semibold text-base">Net Amount</span>
                    <span className="text-emerald-600 font-bold text-base">₹{netAmount.toFixed(2)}</span>
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
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Destination Bank</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {[
                    { label: "Account Holder", value: accountName },
                    { label: "Account Number", value: bankAccount },
                    { label: "IFSC Code", value: ifscCode },
                    { label: "Bank Name", value: bankName }
                  ].map((detail, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{detail.label}</span>
                      <span className="text-gray-900 font-medium">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-emerald-200/50 p-4 z-50">
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount || bankAccount === "Not set" || ifscCode === "Not set" || isProcessing}
            className={`w-full h-12 rounded-xl font-bold text-base shadow-lg border-0 transition-all ${
              isValidAmount && bankAccount !== "Not set" && ifscCode !== "Not set" && !isProcessing
                ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "PROCESS WITHDRAWAL"
            )}
          </button>
          
          <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Processed within 24 hours on business days</span>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-emerald-600 to-green-600 border-0 shadow-2xl p-0 overflow-hidden">
          <div className="relative p-6">
            <div className="flex flex-col items-center text-white">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4"
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
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-emerald-100 text-sm text-center mb-4"
              >
                Your withdrawal request for ₹{amount} has been submitted. You will receive ₹{netAmount.toFixed(2)} after processing fee deduction.
              </motion.p>
              <Button 
                className="w-full bg-white text-emerald-700 hover:bg-gray-100 font-bold rounded-lg text-sm" 
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
