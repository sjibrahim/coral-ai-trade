
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { CircleDollarSign, ArrowRight, Check, DollarSign } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createWithdrawOrder } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { motion } from "framer-motion";

const UsdtWithdrawalPage = () => {
  const [amount, setAmount] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const { 
    settings, 
    isValidWithdrawal, 
    getUsdtPrice, 
    loading: loadingSettings 
  } = useGeneralSettings();
  
  // Safely access user properties with fallbacks
  const availableBalance = user?.wallet ? parseFloat(user.wallet) : 0;
  
  // Calculate USDT amount based on INR
  const usdtPrice = getUsdtPrice();
  const usdtAmount = amount ? (parseFloat(amount) / usdtPrice).toFixed(2) : "0";
  
  const minWithdrawalInr = parseFloat(settings.min_withdrawal || "300");
  const isValidAmount = Number(amount) >= minWithdrawalInr && Number(amount) <= availableBalance && address.trim().length > 10;
  
  const handleConfirm = async () => {
    if (!isValidAmount) {
      setError(`Please enter a valid amount (minimum ₹${minWithdrawalInr} and not exceeding your balance) and a valid TRC20 address`);
      return;
    }
    
    setIsProcessing(true);
    setError("");
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // The API endpoint needs to be updated to support USDT withdrawals
      // For now, we're using the same endpoint but will send additional data
      const response = await createWithdrawOrder(token, Number(amount));
      
      if (response.status) {
        setShowSuccessModal(true);
        // Update user profile to get updated wallet balance
        await updateProfile();
        
        // Reset after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          setAmount("");
          setAddress("");
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
      title="USDT Withdrawal"
      noScroll
    >
      <div className="flex flex-col h-full bg-[#0d0f17] pb-4">
        {/* Top Section with Card */}
        <motion.div 
          className="mx-4 my-4 rounded-xl bg-gradient-to-br from-blue-900/40 to-blue-600/20 backdrop-blur-sm p-6 shadow-lg border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Tether (USDT)</h2>
                <p className="text-sm text-blue-300">TRC20 Network</p>
              </div>
            </div>
            <div className="bg-blue-500/10 rounded-full px-3 py-1">
              <span className="text-xs text-blue-300">1 USDT = ₹{usdtPrice}</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center">
              <CircleDollarSign className="h-8 w-8 text-amber-400 mr-2 animate-pulse" />
              <h3 className="text-5xl font-bold text-gradient-blue-purple">
                {usdtAmount}
              </h3>
            </div>
            <p className="text-blue-200/80 mt-2">
              ₹{amount ? parseFloat(amount).toLocaleString() : "0"}
            </p>
          </div>
        </motion.div>
        
        {/* Middle Section - Available Balance */}
        <motion.div 
          className="mx-4 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-between items-center bg-[#1a1e29] p-4 rounded-lg border border-blue-500/10">
            <span className="text-gray-400">Available Balance</span>
            <span className="text-xl font-bold text-white">₹{availableBalance.toLocaleString()}</span>
          </div>
        </motion.div>
        
        {/* Address Input */}
        <motion.div 
          className="mx-4 mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <label className="text-blue-400 text-xs mb-1 block">TRC20 Wallet Address</label>
          <div className="relative">
            <Input 
              placeholder="Enter your TRC20 wallet address"
              className="bg-[#1a1e29] border-[#2a2f3c] text-white pr-10"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <DollarSign className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <p className="text-amber-500/80 text-xs mt-1">
            Only TRC20 network is supported. Make sure your address is correct.
          </p>
        </motion.div>
        
        {/* Amount Input */}
        <motion.div 
          className="mx-4 mb-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label className="text-blue-400 text-xs mb-1 block">Amount (in INR)</label>
          <div className="relative">
            <Input 
              placeholder="Enter amount to withdraw"
              className="bg-[#1a1e29] border-[#2a2f3c] text-white pr-10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              readOnly
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-blue-400">₹</span>
            </div>
          </div>
          <p className="text-blue-300/80 text-xs mt-1">
            Minimum withdrawal: <span className="text-amber-400">₹{minWithdrawalInr}</span>
          </p>
        </motion.div>
        
        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-4">
            <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
              {error}
            </p>
          </div>
        )}
        
        {/* Bottom Section - Keypad */}
        <div className="flex-1 flex flex-col justify-end px-4 mt-auto">
          <NumericKeypad 
            value={amount}
            onChange={setAmount}
            size="sm"
            deleteIcon="backspace"
            clearText="clr"
            className="mb-2"
            onConfirm={handleConfirm}
            confirmButtonText={isProcessing ? "PROCESSING..." : "WITHDRAW USDT"}
            confirmDisabled={!isValidAmount || isProcessing}
          />
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-[#1a1e29] border-border/50 p-0 overflow-hidden">
          <motion.div 
            className="flex flex-col items-center justify-center p-6 space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Check className="h-10 w-10 text-green-500" />
            </motion.div>
            <h2 className="text-xl font-semibold text-white">Withdrawal Request Submitted!</h2>
            <p className="text-gray-400 text-center">
              Your USDT withdrawal request for {usdtAmount} USDT (₹{amount}) has been submitted successfully. It will be processed within 24 hours.
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default UsdtWithdrawalPage;
