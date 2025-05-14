
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { Bell, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createWithdrawOrder, getGeneralSettings } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface GeneralSettings {
  min_withdrawal: string;
}

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<GeneralSettings>({ min_withdrawal: "300" });
  
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
  
  // Safely access user properties with fallbacks for TypeScript
  const availableBalance = user?.wallet ? parseFloat(user.wallet) : 0;
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
      noScroll
    >
      <div className="flex flex-col h-full bg-[#0d0f17]">
        {/* Top Section - Amount Display */}
        <div className="pt-4 px-6 text-left">
          <div className="flex items-start">
            <span className="text-xl font-bold text-white mt-2 mr-1">₹</span>
            <span className="text-6xl font-bold text-white">
              {amount ? amount : "0"}
            </span>
          </div>
          
          <div className="mt-1 text-right">
            <p className="text-gray-400 text-sm">
              Minimum Withdrawal <span className="text-blue-400">₹{minWithdrawal}</span>
            </p>
          </div>
          
          {error && (
            <div className="mt-2 text-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>
        
        {/* Middle Section - Balance & Bank info */}
        <div className="bg-[#12131a] py-3 px-6 mt-4">
          <div className="text-center mb-3">
            <h3 className="text-gray-400 text-sm mb-1">Withdrawal Balance</h3>
            <p className="text-3xl font-bold text-white">₹{availableBalance.toLocaleString()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1a1e29] rounded-xl p-3">
              <p className="text-blue-400 text-xs mb-1 text-left">Bank Account</p>
              <p className="text-white text-base font-medium text-left">{bankAccount}</p>
            </div>
            <div className="bg-[#1a1e29] rounded-xl p-3">
              <p className="text-blue-400 text-xs mb-1 text-left">IFSC code</p>
              <p className="text-white text-base font-medium text-left">{ifscCode}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Keypad centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-2">
          <NumericKeypad 
            value={amount}
            onChange={setAmount}
            size="sm"
            deleteIcon="backspace"
            clearText="clr"
            className="w-full"
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
              Your withdrawal request for ₹{amount} has been submitted successfully. It will be processed within 24 hours.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white" 
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
