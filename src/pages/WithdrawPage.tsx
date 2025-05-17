
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Bell, Check, Wallet } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createWithdrawOrder, getGeneralSettings } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AmountInput from "@/components/payments/AmountInput";
import BankInfo from "@/components/payments/BankInfo";
import ConfirmButton from "@/components/payments/ConfirmButton";
import { motion } from "framer-motion";

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
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
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

  // Redirect to bank details page if bank not set
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

  const minWithdrawal = parseInt(settings.min_withdrawal) || 300;
  const isValidAmount = Number(amount) >= minWithdrawal && Number(amount) <= availableBalance;
  
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
        
        {/* Bank Information */}
        <div className="bg-[#12131a] py-4 px-4 rounded-2xl mb-5">
          <h3 className="text-gray-300 text-sm mb-3">Your Bank Details</h3>
          <BankInfo 
            bankAccount={bankAccount} 
            ifscCode={ifscCode} 
          />
          
          {(bankAccount === "Not set" || ifscCode === "Not set") && (
            <div className="mt-3 bg-amber-900/20 border border-amber-900/30 rounded-lg p-3">
              <p className="text-amber-400 text-xs">
                Please update your bank details in the profile section before making a withdrawal.
              </p>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="mt-auto">
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
              Your withdrawal request for ₹{amount} has been submitted successfully. It will be processed within 24 hours.
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
