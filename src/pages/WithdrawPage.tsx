
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { Bell, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";
import { createWithdrawOrder } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const WithdrawPage = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const availableBalance = user?.wallet ? parseFloat(user.wallet) : 0;
  const bankAccount = user?.account_number || "Not provided";
  const ifscCode = user?.account_ifsc || "Not provided";

  const isValidAmount = Number(amount) >= 300 && Number(amount) <= availableBalance;
  
  const handleConfirm = async () => {
    if (!isValidAmount || !user?.token) return;
    
    setIsLoading(true);
    
    try {
      const response = await createWithdrawOrder(user.token, Number(amount));
      
      if (response.status) {
        // Show success modal
        setShowSuccessModal(true);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          setAmount("");
        }, 3000);
      } else {
        setErrorMessage(response.msg || "No active withdrawal gateway");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      setErrorMessage("Something went wrong. Please try again later.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
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
              Minimum Withdrawal <span className="text-blue-400">₹300</span>
            </p>
          </div>
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

        {/* Bottom Section - Keypad */}
        <div className="flex-1 flex flex-col justify-end px-4 py-2">
          <NumericKeypad 
            value={amount}
            onChange={setAmount}
            size="sm"
            deleteIcon="backspace"
            clearText="clr"
            className="mb-2"
            onConfirm={isLoading ? undefined : handleConfirm}
            confirmButtonText={isLoading ? "PROCESSING..." : "SUBMIT"}
            confirmDisabled={!isValidAmount || isLoading}
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
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md bg-[#1a1e29] border-border/50 p-0 overflow-hidden">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse-glow">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Withdrawal Failed</h2>
            <p className="text-gray-400 text-center">
              {errorMessage}
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => setShowErrorModal(false)}
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
