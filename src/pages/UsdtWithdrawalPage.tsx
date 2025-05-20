
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowRight, Check, Copy, AlertCircle, Info, DollarSign } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createWithdrawOrder } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import AmountInput from "@/components/payments/AmountInput";
import ConfirmButton from "@/components/payments/ConfirmButton";

const UsdtWithdrawalPage = () => {
  const [amount, setAmount] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("amount");
  const [copied, setCopied] = useState(false);
  
  const { user, updateProfile, refreshUserData } = useAuth();
  const { toast } = useToast();
  const { 
    settings, 
    getUsdtPrice, 
    loading: loadingSettings 
  } = useGeneralSettings();
  
  // Safely access user properties with fallbacks
  const availableBalance = user?.income ? parseFloat(user.income) : 0;
  
  useEffect(() => {
    if (user?.usdt_address && address === "") {
      setAddress(user.usdt_address);
    }
  }, [user]);
  
  // Add this effect to refresh user data when the component mounts
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);
  
  // Calculate USDT amount based on INR
  const usdtPrice = getUsdtPrice();
  const withdrawalFee = parseFloat(settings.withdrawal_fee) || 10;
  const usdtAmount = amount ? (parseFloat(amount) / usdtPrice).toFixed(2) : "0";
  const netAmountInr = amount ? Math.max(parseFloat(amount) - withdrawalFee, 0) : 0;
  const netAmountUsdt = netAmountInr ? (netAmountInr / usdtPrice).toFixed(2) : "0";
  
  const minWithdrawalInr = parseFloat(settings.min_withdrawal || "300");
  const isValidAmount = Number(amount) >= minWithdrawalInr && Number(amount) <= availableBalance;
  const isValidAddress = address.trim().length > 10;
  const canProceed = isValidAmount && isValidAddress;
  
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
        {/* Header Section - Balance Card */}
        <div className="px-4 pt-4">
          <div className="bg-gradient-to-br from-blue-800/30 to-indigo-800/30 rounded-2xl p-4 border border-indigo-500/20 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-400 text-xs">Available Balance</h3>
                <p className="text-2xl font-bold text-white">₹{availableBalance.toLocaleString()}</p>
              </div>
              <div className="bg-indigo-900/40 rounded-lg p-2">
                <DollarSign className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Withdrawal Flow with ScrollArea */}
        <ScrollArea className="flex-1 overflow-visible">
          <div className="px-4 pb-32">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6 bg-[#1a1c25]">
                <TabsTrigger 
                  value="amount" 
                  disabled={activeTab !== "amount" && !isValidAmount}
                  className={activeTab === "amount" ? "bg-blue-600 text-white" : ""}
                >
                  Amount
                </TabsTrigger>
                <TabsTrigger 
                  value="address" 
                  disabled={!isValidAmount || (activeTab === "confirm" && !isValidAddress)}
                  className={activeTab === "address" ? "bg-blue-600 text-white" : ""}
                >
                  Address
                </TabsTrigger>
                <TabsTrigger 
                  value="confirm" 
                  disabled={!isValidAmount || !isValidAddress}
                  className={activeTab === "confirm" ? "bg-blue-600 text-white" : ""}
                >
                  Confirm
                </TabsTrigger>
              </TabsList>
              
              {/* Amount Tab */}
              <TabsContent value="amount" className="mt-0 space-y-4">
                <div className="flex flex-col mb-6">
                  <AmountInput
                    amount={amount}
                    onChange={setAmount}
                    minAmount={minWithdrawalInr}
                    maxAmount={availableBalance}
                    quickAmounts={["500", "1000", "2000", "5000"]}
                    currencySymbol={<span className="text-xl font-bold text-white/70 mr-1">₹</span>}
                  />
                  
                  <div className="text-center mt-2">
                    <p className="text-blue-400 text-sm">≈ {usdtAmount} USDT</p>
                  </div>
                  
                  <div className="bg-[#1a1e29] rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Exchange Rate</span>
                      <span className="text-sm text-gray-300">1 USDT = ₹{usdtPrice}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Minimum Withdrawal</span>
                      <span className="text-sm text-gray-300">₹{minWithdrawalInr}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Withdrawal Fee</span>
                      <span className="text-sm text-red-400">₹{withdrawalFee}</span>
                    </div>
                    <div className="h-px bg-gray-700 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">You Will Receive</span>
                      <span className="text-sm text-green-400">{netAmountUsdt} USDT</span>
                    </div>
                  </div>
                  
                  {!isValidAmount && amount && (
                    <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 mt-4 flex items-start">
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
                
                <div className="fixed bottom-0 left-0 right-0 bg-[#0d0f17] border-t border-[#1a1e29] pb-4 pt-3 px-4">
                  <ConfirmButton
                    onClick={isValidAmount ? handleNextStep : undefined}
                    disabled={!isValidAmount}
                    isLoading={false}
                    text="NEXT"
                    className="bg-gradient-to-r from-blue-600 to-indigo-500"
                  />
                </div>
              </TabsContent>
              
              {/* Address Tab */}
              <TabsContent value="address" className="space-y-4 min-h-[300px]">
                <div className="bg-[#1a1e29] rounded-lg p-4 mb-4">
                  <label className="text-sm text-gray-300 block mb-2">TRC20 Wallet Address</label>
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
                
                <div className="fixed bottom-0 left-0 right-0 bg-[#0d0f17] border-t border-[#1a1e29] pb-4 pt-3 px-4">
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
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Confirm Tab */}
              <TabsContent value="confirm" className="space-y-4 min-h-[300px]">
                <div className="bg-[#1a1e29] rounded-lg p-4 mb-4">
                  <h2 className="text-lg font-medium text-white mb-4">Confirm Withdrawal Details</h2>
                  
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
                      <span className="text-gray-400">Withdrawal Fee</span>
                      <span className="text-red-400 font-medium">₹{withdrawalFee}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-[#353950]">
                      <span className="text-gray-400">You Will Receive</span>
                      <span className="text-green-400 font-medium">{netAmountUsdt} USDT</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-[#353950]">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white font-medium bg-blue-900/20 text-blue-300 rounded-full px-3 py-0.5 text-xs">TRC20</span>
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
                      <p className="text-xs text-gray-300 break-all bg-[#252836] p-2 rounded-md">{address}</p>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}
                </div>
                
                <div className="fixed bottom-0 left-0 right-0 bg-[#0d0f17] border-t border-[#1a1e29] pb-4 pt-3 px-4">
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevStep}
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <ConfirmButton
                      onClick={handleConfirm}
                      disabled={isProcessing || !canProceed}
                      isLoading={isProcessing}
                      text="CONFIRM"
                      className="flex-1"
                    />
                  </div>
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
              Your USDT withdrawal request for {usdtAmount} USDT (₹{amount}) has been successfully submitted. After deducting the fee of ₹{withdrawalFee}, you will receive {netAmountUsdt} USDT. It will be processed within 24 hours.
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
