import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { CircleDollarSign, ArrowRight, Check, DollarSign, Copy, AlertCircle, Info } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createWithdrawOrder } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; // Added the import for cn function

const UsdtWithdrawalPage = () => {
  const [amount, setAmount] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("amount");
  const [copied, setCopied] = useState(false);
  
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
  
  useEffect(() => {
    if (user?.usdt_address && address === "") {
      setAddress(user.usdt_address);
    }
  }, [user]);
  
  // Calculate USDT amount based on INR
  const usdtPrice = getUsdtPrice();
  const usdtAmount = amount ? (parseFloat(amount) / usdtPrice).toFixed(2) : "0";
  
  const minWithdrawalInr = parseFloat(settings.min_withdrawal || "300");
  const isValidAmount = Number(amount) >= minWithdrawalInr && Number(amount) <= availableBalance;
  const isValidAddress = address.trim().length > 10;
  const canProceed = isValidAmount && isValidAddress;
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Handle decimal point (only one allowed)
    if (newValue.split('.').length > 2) return;
    
    setAmount(newValue);
  };
  
  const handleConfirm = async () => {
    if (!canProceed) {
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
      
      // Added USDT address to the API payload
      const response = await createWithdrawOrder(token, Number(amount), address);
      
      if (response.status) {
        setShowSuccessModal(true);
        // Update user profile to get updated wallet balance
        await updateProfile();
        
        // Reset after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          setAmount("");
          setAddress("");
          setActiveTab("amount");
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
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied!",
          description: "Address copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy:", err);
      });
  };
  
  const handleNextStep = () => {
    if (activeTab === "amount" && isValidAmount) {
      setActiveTab("address");
    } else if (activeTab === "address" && isValidAddress) {
      setActiveTab("confirm");
    }
  };
  
  const handlePrevStep = () => {
    if (activeTab === "address") {
      setActiveTab("amount");
    } else if (activeTab === "confirm") {
      setActiveTab("address");
    }
  };
  
  return (
    <MobileLayout 
      showBackButton 
      title="USDT Withdrawal"
    >
      <div className="flex flex-col h-full bg-[#0d0f17]">
        {/* Header Section with Balance Info */}
        
        {/* Main Withdrawal Flow with ScrollArea */}
        <ScrollArea className="flex-1 overflow-visible">
          <div className="px-4 pb-32">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="amount" disabled={activeTab !== "amount" && !isValidAmount}>
                  Amount
                </TabsTrigger>
                <TabsTrigger value="address" disabled={!isValidAmount || (activeTab === "confirm" && !isValidAddress)}>
                  Address
                </TabsTrigger>
                <TabsTrigger value="confirm" disabled={!isValidAmount || !isValidAddress}>
                  Confirm
                </TabsTrigger>
              </TabsList>
              
              {/* Amount Tab */}
              <TabsContent value="amount" className="mt-0 space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <div className="text-center mb-2">
                    <p className="text-gray-400 text-xs mb-1">Withdrawal Amount (INR)</p>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={handleAmountChange}
                        className="text-5xl font-bold text-white bg-transparent border-none p-0 h-auto text-center focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="0"
                        maxLength={10}
                      />
                      <div className="absolute right-0 top-3">
                        <span className="text-xl font-bold text-white">₹</span>
                      </div>
                    </div>
                    <p className="text-blue-400 text-sm mt-1">≈ {usdtAmount} USDT</p>
                  </div>
                  
                  <div className="w-full bg-[#1a1e29] rounded-lg p-3 mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-xs">Exchange Rate</span>
                      <span className="text-xs text-gray-300">1 USDT = ₹{usdtPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Minimum Withdrawal</span>
                      <span className="text-xs text-gray-300">₹{minWithdrawalInr}</span>
                    </div>
                  </div>
                  
                  {!isValidAmount && amount && (
                    <div className="w-full bg-red-900/20 border border-red-800/30 rounded-lg p-3 mt-4 flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-400">
                        {Number(amount) < minWithdrawalInr 
                          ? `Amount must be at least ₹${minWithdrawalInr}` 
                          : Number(amount) > availableBalance 
                            ? `Insufficient balance. Available: ₹${availableBalance}`
                            : "Please enter a valid amount"}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {["500", "1000", "2000", "5000"].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount)}
                      className={cn(
                        "py-2 rounded-lg border text-center text-sm transition-all",
                        amount === quickAmount
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-gray-700 text-gray-400 hover:border-gray-600"
                      )}
                    >
                      ₹{quickAmount}
                    </button>
                  ))}
                </div>
                
                <div className="fixed bottom-0 left-0 right-0 bg-[#0d0f17] border-t border-[#1a1e29] pb-4 pt-2 px-4">
                  <Button 
                    onClick={isValidAmount ? handleNextStep : undefined}
                    disabled={!isValidAmount}
                    className="w-full py-6"
                  >
                    NEXT
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* Address Tab */}
              <TabsContent value="address" className="space-y-4 min-h-[300px]">
                <div className="bg-[#1a1e29] rounded-lg p-4">
                  <label className="text-xs text-gray-400 block mb-2">TRC20 Wallet Address</label>
                  <div className="relative">
                    <Input 
                      placeholder="Enter your TRC20 wallet address"
                      className="bg-[#252836] border-[#353950] text-white pr-10 py-6 text-sm"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-start mt-4">
                    <Info className="h-4 w-4 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-400/80 text-xs">
                      IMPORTANT: Only TRC20 network is supported. Withdrawing to other networks may result in permanent loss of funds.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    disabled={!isValidAddress}
                    className="flex-1"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
              
              {/* Confirm Tab */}
              <TabsContent value="confirm" className="space-y-4 min-h-[300px]">
                <div className="bg-[#1a1e29] rounded-lg p-4">
                  <h2 className="text-white font-medium mb-4">Confirm Withdrawal Details</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-[#353950]">
                      <span className="text-gray-400">Amount (INR)</span>
                      <span className="text-white font-medium">₹{amount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-[#353950]">
                      <span className="text-gray-400">Amount (USDT)</span>
                      <span className="text-white font-medium">{usdtAmount} USDT</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-[#353950]">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white font-medium">TRC20</span>
                    </div>
                    
                    <div className="py-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400">Address</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(address)} 
                          className="h-6 text-xs text-blue-400 hover:text-blue-300"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-300 break-all">{address}</p>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    disabled={isProcessing || !canProceed}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Confirm Withdrawal"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-[#1a1e29] border-blue-500/20 p-0 overflow-hidden">
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
            <h2 className="text-xl font-semibold text-white">Withdrawal Submitted!</h2>
            <p className="text-gray-400 text-center">
              Your USDT withdrawal request for {usdtAmount} USDT (₹{amount}) has been successfully submitted. It will be processed within 24 hours.
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
