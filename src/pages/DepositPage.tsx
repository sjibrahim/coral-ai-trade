
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
      <div className="min-h-screen bg-gray-900 px-4 py-6">
        {/* Select Channel Section */}
        <div 
          className="rounded-lg p-4 border border-gray-800 mb-4"
          style={{
            background: 'var(--bg, #1a1a1a)',
            borderRadius: '.16rem',
            padding: '.32rem .32rem 0',
            border: '.02rem solid var(--bg, #2a2a2a)',
            marginBottom: '.32rem',
            lineHeight: '1.2'
          }}
        >
          <h2 className="text-gray-300 text-sm mb-3">Select Channel</h2>
          <div className="pb-3">
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-200 h-12 rounded-lg">
                <SelectValue placeholder="Choose payment method" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 z-50">
                {paymentMethods.map(method => (
                  <SelectItem 
                    key={method.id} 
                    value={method.id} 
                    className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
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
          className="rounded-lg p-4 border border-gray-800 mb-6"
          style={{
            background: 'var(--bg, #1a1a1a)',
            borderRadius: '.16rem',
            padding: '.32rem .32rem 0',
            border: '.02rem solid var(--bg, #2a2a2a)',
            marginBottom: '.32rem',
            lineHeight: '1.2'
          }}
        >
          <h2 className="text-gray-300 text-sm mb-3">Enter Amount</h2>
          <div className="pb-3">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:border-gray-600 focus:outline-none"
              placeholder={`Min ${minDepositAmount}$`}
              maxLength={10}
            />
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!isValidAmount || !selectedChannel}
          className={`w-full h-12 rounded-lg font-medium transition-all ${
            isValidAmount && selectedChannel
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
