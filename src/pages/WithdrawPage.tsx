
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { mockBalances } from "@/data/mockData";
import { Bell, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const { availableBalance } = mockBalances;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const bankAccount = "8054426413";
  const ifscCode = "AIRP0000001";

  const isValidAmount = Number(amount) >= 300 && Number(amount) <= availableBalance;
  
  const handleConfirm = () => {
    if (!isValidAmount) return;
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      setAmount("");
    }, 3000);
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
      <div className="flex flex-col h-full bg-[#14131b] justify-between">
        {/* Top Section - Amount Display */}
        <div className="pt-8 px-6">
          <div className="flex items-center">
            <div className="relative flex items-start">
              <span className="text-4xl font-bold text-white mr-1">₹</span>
              <span className="text-8xl font-bold text-white">
                {amount ? amount : "0"}
              </span>
            </div>
          </div>
          
          <div className="text-right mt-1">
            <p className="text-gray-400 text-base">
              Minimum Withdrawal <span className="text-blue-400">₹300</span>
            </p>
          </div>
        </div>
        
        {/* Middle Section - Balance & Bank info */}
        <div className="bg-[#1a1b25] py-6 px-6">
          <div className="text-center mb-4">
            <h3 className="text-gray-400 mb-1">Withdrawal Balance</h3>
            <p className="text-3xl font-bold text-white">₹{availableBalance.toLocaleString()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#20212c] rounded-xl p-4">
              <p className="text-blue-500 text-sm mb-1">Bank Account</p>
              <p className="text-white text-lg font-medium">{bankAccount}</p>
            </div>
            <div className="bg-[#20212c] rounded-xl p-4">
              <p className="text-blue-500 text-sm mb-1">IFSC code</p>
              <p className="text-white text-lg font-medium">{ifscCode}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Keypad */}
        <div className="flex flex-col flex-grow justify-end">
          <div className="flex justify-center">
            <NumericKeypad 
              value={amount}
              onChange={setAmount}
              size="lg"
              deleteIcon="backspace"
              clearText="clr"
              className="mx-auto pb-4"
            />
          </div>

          <div className="px-4 pb-6">
            <button 
              onClick={isValidAmount ? handleConfirm : undefined}
              disabled={!isValidAmount}
              className={cn(
                "w-full py-4 rounded-lg text-white text-xl font-medium transition-all",
                isValidAmount 
                  ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]" 
                  : "bg-blue-600/50 cursor-not-allowed"
              )}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-[#20212c] border-border/50 p-0 overflow-hidden">
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
    </MobileLayout>
  );
};

export default WithdrawPage;
