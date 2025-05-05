
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { mockBalances } from "@/data/mockData";
import { Bell, IndianRupee, Wallet, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  
  const quickAmounts = [1000, 2000, 5000, 10000];
  
  return (
    <MobileLayout 
      showBackButton 
      title="Withdrawal"
      rightActions={(
        <button className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
      )}
      noScroll
    >
      <div className="flex flex-col h-full bg-background p-4 justify-between">
        
        {/* Top Section */}
        <div>
          {/* Amount Display */}
          <div className="flex items-center justify-center pt-4">
            <div className="relative">
              <div className="absolute -left-6 top-4">
                <IndianRupee className="h-7 w-7 text-primary/90" />
              </div>
              <span className="text-7xl font-bold text-gradient-primary tracking-tighter">
                {amount ? amount : "0"}
              </span>
            </div>
          </div>
          
          {/* Min Withdrawal Info */}
          <div className="text-center mt-2">
            <p className="text-muted-foreground text-sm">Minimum Withdrawal <span className="text-primary">₹300</span></p>
          </div>
          
          {/* Withdrawal Balance */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <Wallet className="h-5 w-5 text-primary/80" />
            <span className="text-muted-foreground text-sm">Balance:</span>
            <span className="text-foreground font-semibold">₹{availableBalance.toLocaleString()}</span>
          </div>
          
          {/* Quick Amount Selection */}
          <div className="grid grid-cols-4 gap-2 mt-6">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={cn(
                  "py-2 px-1 rounded-xl transition-all duration-200",
                  "border border-border/50 bg-card/50 backdrop-blur-sm",
                  "hover:bg-primary/10 hover:border-primary/50",
                  amount === amt.toString() && "bg-primary/20 border-primary/70 ring-1 ring-primary/50"
                )}
              >
                <span className="text-sm font-medium">₹{amt.toLocaleString()}</span>
              </button>
            ))}
          </div>
          
          {/* Bank Account Info */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="flex flex-col bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border/40">
              <span className="text-primary/80 text-xs mb-1">Bank Account</span>
              <span className="text-foreground font-medium">{bankAccount}</span>
            </div>
            <div className="flex flex-col bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border/40">
              <span className="text-primary/80 text-xs mb-1">IFSC Code</span>
              <span className="text-foreground font-medium">{ifscCode}</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-auto w-full">
          {/* Keypad */}
          <NumericKeypad 
            value={amount}
            onChange={setAmount}
            onConfirm={isValidAmount ? handleConfirm : undefined}
            confirmButtonText="SUBMIT"
            confirmButtonIcon={<Download className="h-4 w-4 mr-1" />}
            className="mx-auto"
          />
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-card border-border/50 p-0 overflow-hidden">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse-glow">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">Withdrawal Request Submitted!</h2>
            <p className="text-muted-foreground text-center">
              Your withdrawal request for ₹{amount} has been submitted successfully. It will be processed within 24 hours.
            </p>
            <Button 
              className="w-full" 
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
