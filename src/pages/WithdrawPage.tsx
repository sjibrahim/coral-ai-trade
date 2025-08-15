
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
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    if (newValue.split('.').length > 2) return;
    setAmount(newValue);
  };

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

  if (isProcessing) {
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
    <MobileLayout showBackButton title="Withdraw Funds" hideFooter>
      <div className="min-h-screen bg-gray-900">
        
        <div className="px-4 py-6 space-y-4">

          {/* Top Row - Balance and Processing Hours */}
          <div className="grid grid-cols-2 gap-3">
            {/* Available Balance - Compact */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-3">
              <div className="flex items-center mb-1">
                <Wallet className="w-4 h-4 text-[#00e8be] mr-1" />
                <h3 className="text-white font-medium text-sm">Balance</h3>
              </div>
              <div className="text-lg font-bold text-white">₹{availableBalance.toLocaleString()}</div>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <Target className="w-3 h-3 mr-1" />
                <span>Min: ₹{minWithdrawal}</span>
              </div>
            </div>

            {/* Processing Hours - Compact */}
            <div className="bg-blue-900/30 rounded-lg border border-blue-700/50 p-3">
              <div className="flex items-center mb-1">
                <Clock className="w-4 h-4 text-blue-400 mr-1" />
                <h3 className="text-blue-300 font-medium text-sm">Processing</h3>
              </div>
              <p className="text-blue-200 text-sm font-medium">8:00 AM - 10:00 AM</p>
              <p className="text-blue-300 text-xs">Full weekend available</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 rounded-xl border border-red-700/50 p-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Main Section - Withdraw Amount - Compact Mobile */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="text-center mb-3">
              <div className="flex items-center justify-center mb-1">
                <ArrowDown className="w-5 h-5 text-[#00e8be] mr-1" />
                <h2 className="text-white font-semibold">Withdraw Amount</h2>
              </div>
              <p className="text-gray-400 text-xs">Enter amount to withdraw</p>
            </div>
            
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#00e8be] focus:outline-none focus:ring-1 focus:ring-white text-lg text-center"
                placeholder={`Min ${minWithdrawal}`}
                maxLength={10}
              />
            </div>

            <div className="flex items-center justify-center text-xs text-gray-400">
              <Banknote className="w-3 h-3 mr-1" />
              <span>Fee: {withdrawalFeePercentage}%</span>
            </div>
          </div>

          {/* Withdraw Summary */}
          {amount && (
            <div className="bg-gradient-to-r from-[#00e8be]/10 to-cyan-400/10 rounded-xl p-4 border border-[#00e8be]/30">
              <h4 className="text-white font-semibold mb-3 text-center text-sm">Withdrawal Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-gray-700/50">
                  <span className="text-gray-300 text-sm">Amount</span>
                  <span className="text-white font-medium text-sm">₹{amount}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-700/50">
                  <span className="text-gray-300 text-sm">Fee ({withdrawalFeePercentage}%)</span>
                  <span className="text-red-400 font-medium text-sm">-₹{withdrawalFeeAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#00e8be] font-semibold">You'll Receive</span>
                  <span className="text-[#00e8be] font-bold">₹{netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bank Details */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-3">
              <CreditCard className="w-4 h-4 text-[#00e8be] mr-2" />
              <h3 className="text-white font-medium text-sm">Bank Details</h3>
            </div>
            
            <div className="bg-gray-700/30 rounded-lg p-3 space-y-1.5">
              {[
                { label: "Account Holder", value: accountName },
                { label: "Account Number", value: bankAccount },
                { label: "IFSC Code", value: ifscCode },
                { label: "Bank Name", value: bankName }
              ].map((detail, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{detail.label}</span>
                  <span className="text-gray-200 font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount || bankAccount === "Not set" || ifscCode === "Not set"}
            className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
              isValidAmount && bankAccount !== "Not set" && ifscCode !== "Not set"
                ? "bg-[#00e8be] text-gray-900 hover:shadow-lg hover:shadow-[#00e8be]/25 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Process Withdrawal
              </>
            )}
          </button>
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
