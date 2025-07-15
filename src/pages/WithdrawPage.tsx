
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Check, Wallet, CreditCard, Info, AlertCircle, Banknote } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWithdrawOrder, getGeneralSettings } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
      setError("");
    }
  };

  const setQuickAmount = (quickAmount: string) => {
    setAmount(quickAmount);
    setError("");
  };
  
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
    <MobileLayout showBackButton title="Withdraw Funds">
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Balance Card */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-800">Available Balance</CardTitle>
              <div className="text-3xl font-bold text-blue-600">₹{availableBalance.toLocaleString()}</div>
            </CardHeader>
          </Card>

          {/* Withdrawal Form */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Banknote className="w-5 h-5 text-green-600" />
                Withdrawal Amount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Enter Amount (Min: ₹{minWithdrawal})
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="pl-8 h-12 text-lg border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {["1000", "2500", "5000", "10000"].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickAmount(quickAmount)}
                    className="h-8 text-xs"
                    disabled={parseInt(quickAmount) > availableBalance}
                  >
                    {quickAmount}
                  </Button>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fee Breakdown */}
          {amount && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="w-5 h-5 text-blue-600" />
                    Fee Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Withdrawal Amount</span>
                    <span className="font-medium">₹{amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Processing Fee ({withdrawalFeePercentage}%)</span>
                    <span className="font-medium text-red-600">-₹{withdrawalFeeAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Net Amount</span>
                      <span className="font-bold text-green-600 text-lg">₹{netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bank Details */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Account Holder</p>
                  <p className="font-medium text-gray-800">{accountName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Bank Name</p>
                  <p className="font-medium text-gray-800">{bankName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Account Number</p>
                  <p className="font-medium text-gray-800">{bankAccount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">IFSC Code</p>
                  <p className="font-medium text-gray-800">{ifscCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleConfirm}
            disabled={!isValidAmount || bankAccount === "Not set" || ifscCode === "Not set" || isProcessing}
            className={`w-full h-12 text-base font-semibold ${
              isValidAmount && bankAccount !== "Not set" && ifscCode !== "Not set" && !isProcessing
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              "Confirm Withdrawal"
            )}
          </Button>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Withdrawal Submitted!
            </h2>
            <p className="text-gray-600 mb-4">
              Your withdrawal request for ₹{amount} has been submitted. You will receive ₹{netAmount.toFixed(2)} after processing fee deduction.
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
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
