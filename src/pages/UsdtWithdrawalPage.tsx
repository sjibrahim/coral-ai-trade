
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { Bell, Check, Wallet } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createWithdrawOrder, getGeneralSettings } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface GeneralSettings {
  usdt_price: string;
  min_withdrawal: string;
}

const UsdtWithdrawalPage = () => {
  const [amount, setAmount] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [settings, setSettings] = useState<GeneralSettings>({
    usdt_price: "85",
    min_withdrawal: "300"
  });
  
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  // Safely access user properties with fallbacks
  const availableBalance = user?.wallet ? parseFloat(user.wallet) : 0;
  
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

  // Calculate USDT amount based on INR
  const usdtAmount = amount ? (parseFloat(amount) / parseFloat(settings.usdt_price)).toFixed(2) : "0";
  
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
      title="USDT Withdrawal (TRC20)"
      rightActions={(
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      )}
      noScroll
    >
      <div className="flex flex-col h-full bg-[#0d0f17]">
        {/* Top Section - Amount Display */}
        <div className="pt-4 px-6 text-left">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-amber-400 mr-2" />
            <span className="text-xl font-bold text-white mt-1 mr-1">USDT</span>
            <span className="text-6xl font-bold text-white">
              {usdtAmount}
            </span>
          </div>
          
          <div className="mt-2 text-right">
            <p className="text-gray-400 text-sm">
              ₹{amount ? parseFloat(amount).toLocaleString() : "0"} (₹{settings.usdt_price}/USDT)
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Minimum Withdrawal <span className="text-blue-400">₹{settings.min_withdrawal}</span>
            </p>
          </div>
          
          {error && (
            <div className="mt-2 text-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>
        
        {/* Middle Section - Balance & TRC20 Address */}
        <div className="bg-[#12131a] py-3 px-6 mt-4">
          <div className="text-center mb-3">
            <h3 className="text-gray-400 text-sm mb-1">Withdrawal Balance</h3>
            <p className="text-3xl font-bold text-white">₹{availableBalance.toLocaleString()}</p>
          </div>
          
          <div className="mt-4">
            <label className="text-blue-400 text-xs mb-1 block">TRC20 Wallet Address</label>
            <Input 
              placeholder="Enter your TRC20 wallet address"
              className="bg-[#1a1e29] border-[#2a2f3c] text-white"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <p className="text-amber-500/80 text-xs mt-1">
              Only TRC20 network is supported. Make sure your address is correct.
            </p>
          </div>
        </div>

        {/* Bottom Section - Keypad */}
        <div className="flex-1 flex flex-col justify-end px-4 py-2">
          <NumericKeypad 
            value={amount}
            onChange={setAmount}
            size="sm"
            deleteIcon="backspace"
            clearText="clr"
            className="mb-2"
            onConfirm={handleConfirm}
            confirmButtonText={isProcessing ? "PROCESSING..." : "SUBMIT"}
            confirmDisabled={!isValidAmount || isProcessing}
          />
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-[#1a1e29] border-border/50 p-0 overflow-hidden">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse-glow">
              <Check className="h-10 w-10 text-green-500" />
            </div>
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
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default UsdtWithdrawalPage;
