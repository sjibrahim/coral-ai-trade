import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Check, Wallet, Info, CreditCard, TrendingDown, DollarSign } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <MobileLayout 
      showBackButton 
      title="Trexo Withdrawal"
    >
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Withdraw Funds</h1>
            <p className="text-muted-foreground">Transfer your earnings to your bank</p>
          </div>

          {/* Balance Card */}
          <Card className="mb-6 bg-gradient-to-br from-emerald-500 to-green-600 border-none shadow-xl overflow-hidden">
            <CardContent className="p-6 text-white text-center">
              <div className="flex items-center justify-center mb-2">
                <Wallet className="h-6 w-6 mr-2" />
                <span className="text-emerald-100 text-sm">Available Balance</span>
              </div>
              <p className="text-3xl font-bold mb-2">₹{availableBalance.toLocaleString()}</p>
              <p className="text-emerald-100 text-sm">Ready for withdrawal</p>
            </CardContent>
          </Card>

          {/* Error message */}
          {error && (
            <Card className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Amount Input */}
          <AmountInput
            amount={amount}
            onChange={setAmount}
            minAmount={minWithdrawal}
            maxAmount={availableBalance}
            quickAmounts={["500", "1000", "2000", "5000"]}
            className="mb-6"
          />
          
          {/* Withdrawal Details */}
          <Card className="mb-6 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-emerald-600 dark:text-emerald-400 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Withdrawal Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Withdrawal Amount</span>
                <span className="font-semibold">₹{amount || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee ({withdrawalFeePercentage}%)</span>
                <span className="text-red-600 dark:text-red-400">₹{withdrawalFeeAmount.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">Net Amount</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{netAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="mb-6 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-emerald-600 dark:text-emerald-400 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Receiving Bank Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Holder</span>
                <span className="font-medium">{accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-medium">{bankAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IFSC Code</span>
                <span className="font-medium">{ifscCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Name</span>
                <span className="font-medium">{bankName}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Submit Button */}
          <ConfirmButton
            onClick={handleConfirm}
            disabled={!isValidAmount || bankAccount === "Not set" || ifscCode === "Not set"}
            isLoading={isProcessing}
            text="SUBMIT WITHDRAWAL REQUEST"
            className="w-full mb-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          />
          
          <p className="text-xs text-center text-muted-foreground">
            Withdrawal requests are processed within 24 hours during business days
          </p>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-800 p-0 overflow-hidden">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
            >
              <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <motion.h2 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-xl font-semibold text-emerald-600 dark:text-emerald-400"
            >
              Withdrawal Submitted!
            </motion.h2>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-muted-foreground text-center"
            >
              Your withdrawal request for ₹{amount} has been submitted. After deducting the {withdrawalFeePercentage}% processing fee, you will receive ₹{netAmount.toFixed(2)} in your bank account within 24 hours.
            </motion.p>
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white" 
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