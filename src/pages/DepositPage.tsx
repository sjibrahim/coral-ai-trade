
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { createTopupOrder } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethod {
  id: string;
  name: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: "PAY1", name: "PAY-1" },
  { id: "PAY2", name: "PAY-2" },
  { id: "PAY3", name: "PAY-3" },
  { id: "PAY4", name: "PAY-4" }
];

const DepositPage = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useGeneralSettings();
  
  const minDepositAmount = parseFloat(settings.min_deposit || "10");
  const isValidAmount = Number(amount) >= minDepositAmount;
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    if (newValue.split('.').length > 2) return;
    setAmount(newValue);
  };

  const handleConfirm = async () => {
    if (!isValidAmount || !selectedChannel || !user?.token) return;
    
    setIsLoading(true);
    
    try {
      const response = await createTopupOrder(user.token, Number(amount), selectedChannel);
      
      if (response.status && response.data?.redirect_url) {
        window.location.href = response.data.redirect_url;
        return;
      } else {
        toast({
          title: "Payment Failed",
          description: response.msg || "No active gateway available",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Deposit error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <img 
          src="/uploads/out.gif" 
          alt="Loading" 
          className="w-16 h-16"
        />
      </div>
    );
  }
  
  return (
    <MobileLayout showBackButton title="Recharge" hideFooter>
      <div className="min-h-screen bg-gray-900 text-white">
        
        {/* Header Info Section */}
        <div className="px-4 py-4 bg-gray-800/50 border-b border-gray-700/50">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-200 mb-1">Quick & Secure Deposit</h2>
            <p className="text-sm text-gray-400">Add funds to your account instantly</p>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4">
          
          {/* Balance Info */}
          <div 
            className="rounded-lg border text-center py-3"
            style={{
              background: 'var(--bg, #1a1a1a)',
              borderRadius: '.16rem',
              padding: '.32rem',
              border: '.02rem solid var(--bg, #2a2a2a)',
              marginBottom: '.32rem',
              lineHeight: '1.2'
            }}
          >
            <p className="text-xs text-gray-400 mb-1">Current Balance</p>
            <p className="text-lg font-semibold text-gray-200">${user?.wallet || '0.00'}</p>
          </div>

          {/* Select Channel Section */}
          <div 
            className="rounded-lg border"
            style={{
              background: 'var(--bg, #1a1a1a)',
              borderRadius: '.16rem',
              padding: '.32rem .32rem 0',
              border: '.02rem solid var(--bg, #2a2a2a)',
              marginBottom: '.32rem',
              lineHeight: '1.2'
            }}
          >
            <h3 className="text-gray-300 text-sm mb-3">Select Channel</h3>
            <div className="pb-3">
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-full bg-gray-800/50 border-gray-700/50 text-gray-200 h-10 rounded-lg text-sm">
                  <SelectValue placeholder="Choose payment method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 z-50">
                  {paymentMethods.map(method => (
                    <SelectItem 
                      key={method.id} 
                      value={method.id} 
                      className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 text-sm"
                    >
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enter Amount Section */}
          <div 
            className="rounded-lg border"
            style={{
              background: 'var(--bg, #1a1a1a)',
              borderRadius: '.16rem',
              padding: '.32rem .32rem 0',
              border: '.02rem solid var(--bg, #2a2a2a)',
              marginBottom: '.32rem',
              lineHeight: '1.2'
            }}
          >
            <h3 className="text-gray-300 text-sm mb-3">Enter Amount</h3>
            <div className="pb-3">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-gray-600 focus:outline-none text-sm"
                placeholder={`Min $${minDepositAmount}`}
                maxLength={10}
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div 
            className="rounded-lg border"
            style={{
              background: 'var(--bg, #1a1a1a)',
              borderRadius: '.16rem',
              padding: '.32rem',
              border: '.02rem solid var(--bg, #2a2a2a)',
              marginBottom: '.32rem',
              lineHeight: '1.2'
            }}
          >
            <h3 className="text-gray-300 text-sm mb-3">Quick Select</h3>
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, 5000].map(quickAmount => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="py-2 px-2 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/30 rounded text-xs text-gray-300 transition-colors"
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount || !selectedChannel}
            className={`w-full h-11 rounded-lg font-medium transition-all text-sm ${
              isValidAmount && selectedChannel
                ? "text-white shadow-lg"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
            style={{
              backgroundColor: isValidAmount && selectedChannel ? '#00e8be' : undefined
            }}
          >
            {isLoading ? 'Processing...' : 'Confirm Deposit'}
          </button>

          {/* Info Note */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Deposits are processed instantly. Contact support if you need help.
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
