
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, CreditCard, Wallet, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createDepositOrder } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await createDepositOrder(token, parseFloat(amount));
      
      if (response.status) {
        toast({
          title: "Success",
          description: "Deposit order created successfully",
        });
        setAmount("");
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to create deposit order",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout showBackButton hideNavbar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
        <div className="px-3 py-4">
          {/* Hero Header */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-white/10 transform -translate-x-4 translate-y-4"></div>
            
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center mb-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Wallet className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold">Add Funds</h1>
              </div>
              <p className="text-emerald-100 text-sm">Deposit money to start trading</p>
            </div>
          </div>

          {/* Deposit Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                Deposit Amount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleDeposit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Deposit Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
