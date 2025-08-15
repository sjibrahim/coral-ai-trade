
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
        
        <div className="px-4 py-6 space-y-6">

          {/* Balance Display */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-4">
              <Wallet className="w-5 h-5 text-[#00e8be] mr-2" />
              <h3 className="text-white font-medium">Available Balance</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">₹{availableBalance.toLocaleString()}</div>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center text-gray-400">
                  <Target className="w-4 h-4 mr-1" />
                  <span>Min: ₹{minWithdrawal}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Banknote className="w-4 h-4 mr-1" />
                  <span>Fee: {withdrawalFeePercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Time Notice */}
          <div className="bg-blue-900/30 rounded-xl border border-blue-700/50 p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="text-blue-300 font-medium">Processing Hours</h3>
            </div>
            <p className="text-blue-200 text-sm">Daily: 8:00 AM - 10:00 AM</p>
            <p className="text-blue-300 text-xs">Available full weekend (No holidays)</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 rounded-xl border border-red-700/50 p-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Enter Amount */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-4">
              <ArrowDown className="w-5 h-5 text-[#00e8be] mr-2" />
              <h3 className="text-white font-medium">Withdrawal Amount</h3>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#00e8be] focus:outline-none focus:ring-1 focus:ring-white text-lg"
                placeholder={`Min ${minWithdrawal}`}
                maxLength={10}
              />
            </div>
            
            {/* Quick Amount Selection */}
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-3">Quick Select</p>
              <div className="grid grid-cols-4 gap-2">
                {[1000, 2500, 5000, 10000].map(quickAmount => (
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

          {/* Transaction Summary */}
          {amount && (
            <div className="bg-gradient-to-r from-[#00e8be]/5 to-cyan-400/5 rounded-xl p-4 border border-[#00e8be]/20">
              <h4 className="text-white font-medium mb-3">Transaction Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Withdrawal Amount:</span>
                  <span className="text-white font-medium">₹{amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processing Fee ({withdrawalFeePercentage}%):</span>
                  <span className="text-red-400 font-medium">-₹{withdrawalFeeAmount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-700"></div>
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Net Amount:</span>
                  <span className="text-[#00e8be] font-bold">₹{netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bank Details */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-[#00e8be] mr-2" />
              <h3 className="text-white font-medium">Destination Bank</h3>
            </div>
            
            <div className="bg-gray-700/30 rounded-lg p-3 space-y-2">
              {[
                { label: "Account Holder", value: accountName },
                { label: "Account Number", value: bankAccount },
                { label: "IFSC Code", value: ifscCode },
                { label: "Bank Name", value: bankName }
              ].map((detail, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
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
            className={`w-full h-14 rounded-xl font-semibold transition-all duration-300 text-lg flex items-center justify-center ${
              isValidAmount && bankAccount !== "Not set" && ifscCode !== "Not set"
                ? "bg-[#00e8be] text-gray-900 hover:shadow-lg hover:shadow-[#00e8be]/25 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
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
