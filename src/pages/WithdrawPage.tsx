import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Bell, Check, Wallet, Info, CreditCard } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createWithdrawOrder, getGeneralSettings } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AmountInput from "@/components/payments/AmountInput";
import BankInfo from "@/components/payments/BankInfo";
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
  
  // Get general settings using the hook
  const { settings: generalSettings } = useGeneralSettings();
  
  // Always refresh user data when component mounts
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);
  
  // Fetch general settings
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

  // Redirect to bank details page if bank not set - immediate check after refresh
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
  
  // Safely access user properties with fallbacks for TypeScript
  const availableBalance = user?.wallet ? parseFloat(user.income) : 0;
  const bankAccount = user?.account_number || "Not set";
  const ifscCode = user?.account_ifsc || "Not set";
  // Using a simple fallback as bank_name is not in the User type
  const bankName = "Your Bank";
  const accountName = user?.account_holder_name || user?.name || "Account Holder";

  const minWithdrawal = parseInt(settings.min_withdrawal) || 300;
  const withdrawalFeePercentage = parseFloat(generalSettings.withdrawal_fee) || 2;
  const isValidAmount = Number(amount) >= minWithdrawal && Number(amount) <= availableBalance;
  
  // Calculate fee and net amount based on percentage
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
        // Update user profile to get updated wallet balance
        await updateProfile();
        
        // Reset after 3 seconds
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
    <MobileLayout 
      showBackButton 
      title="Withdrawal"
      rightActions={(
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      )}
    >
      <div className="flex flex-col h-full bg-[#0d0f17] p-4">
        {/* Main content wrapper with fixed height and scroll for content */}
        <div className="flex flex-col" style={{ height: "calc(100vh - 180px)" }}>
          <div className="overflow-y-auto flex-grow pb-4">
            {/* Balance card with glowing effect */}
            <div className="bg-gradient-to-br from-blue-800/30 to-purple-800/30 rounded-2xl p-5 border border-blue-500/20 shadow-lg mb-5">
              <h3 className="text-gray-400 text-sm mb-1">Withdrawable Balance</h3>
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-blue-400 mr-2" />
                <p className="text-3xl font-bold text-white">₹{availableBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            {/* Amount Input */}
            <AmountInput
              amount={amount}
              onChange={setAmount}
              minAmount={minWithdrawal}
              maxAmount={availableBalance}
              quickAmounts={["500", "1000", "2000", "5000"]}
              className="mb-5"
            />
            
            {/* Withdrawal Fee Information */}
            <div className="bg-[#1a1e29] rounded-lg p-4 mb-5">
              <h3 className="text-gray-300 text-sm mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-400" />
                Withdrawal Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Withdrawal Amount</span>
                  <span className="text-white">₹{amount || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Withdrawal Fee ({withdrawalFeePercentage}%)</span>
                  <span className="text-red-400">₹{withdrawalFeeAmount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-700 my-2"></div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-300">Net Amount</span>
                  <span className="text-green-400">₹{netAmount.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Added bank details in withdrawal details section */}
              <div className="mt-4 pt-3 border-t border-gray-700">
                <h4 className="text-gray-300 text-sm mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-400" />
                  Receiving Bank Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Name</span>
                    <span className="text-white">{accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank Account</span>
                    <span className="text-white">{bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IFSC Code</span>
                    <span className="text-white">{ifscCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank</span>
                    <span className="text-white">{bankName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed bottom section for submit button */}
        <div className="mt-auto py-3 bg-[#0d0f17] fixed bottom-0 left-0 right-0 px-4">
          <ConfirmButton
            onClick={handleConfirm}
            disabled={!isValidAmount || bankAccount === "Not set" || ifscCode === "Not set"}
            isLoading={isProcessing}
            text="SUBMIT WITHDRAWAL"
          />
          
          <p className="text-xs text-center text-gray-500 mt-2">
            Withdrawals are typically processed within 24 hours
          </p>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-[#1a1e29] border-border/50 p-0 overflow-hidden">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse-glow"
            >
              <Check className="h-10 w-10 text-green-500" />
            </motion.div>
            <motion.h2 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-xl font-semibold text-white"
            >
              Withdrawal Request Submitted!
            </motion.h2>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-gray-400 text-center"
            >
              Your withdrawal request for ₹{amount} has been submitted successfully. After deducting the fee of ₹{withdrawalFeeAmount.toFixed(2)} ({withdrawalFeePercentage}%), you will receive ₹{netAmount.toFixed(2)}. It will be processed within 24 hours.
            </motion.p>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white" 
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default WithdrawPage;
