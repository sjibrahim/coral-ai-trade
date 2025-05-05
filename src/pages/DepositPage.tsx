
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("PAY1");
  
  const paymentChannels = ["PAY1", "PAY2", "PAY3", "PAY4"];
  const isValidAmount = Number(amount) >= 600;
  
  const handleConfirm = () => {
    // Handle deposit confirmation
    console.log("Confirm deposit of", amount);
  };
  
  return (
    <MobileLayout 
      showBackButton 
      title="Deposit"
      rightActions={(
        <button className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
      )}
    >
      <div className="flex flex-col h-full bg-[#0A0B14] p-4">
        {/* Amount Display */}
        <div className="flex items-baseline text-left mb-2">
          <span className="text-4xl font-bold mr-2 text-gray-100">₹</span>
          <span className="text-8xl font-bold text-gray-100">
            {amount ? amount : "0"}
          </span>
        </div>
        
        {/* Minimum Deposit Info */}
        <div className="text-right mb-12">
          <p className="text-gray-400">Minimum Deposit ₹600</p>
        </div>
        
        {/* Payment Channels */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4 text-center text-gray-100">
            Payment Channels
          </h2>
          <div className="bg-[#14151F] rounded-full p-1.5 flex justify-between">
            {paymentChannels.map((channel) => (
              <button 
                key={channel}
                className={cn(
                  "py-2 px-6 rounded-full transition-colors flex-1 text-center",
                  selectedChannel === channel 
                    ? 'bg-blue-600 text-white font-medium' 
                    : 'text-gray-300'
                )}
                onClick={() => setSelectedChannel(channel)}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
        
        {/* Keypad */}
        <div className="flex-1 flex flex-col justify-end mt-auto">
          <NumericKeypad 
            value={amount}
            onChange={setAmount}
            onConfirm={isValidAmount ? handleConfirm : undefined}
            confirmButtonText="CONFIRM"
            className="mx-auto"
          />
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
