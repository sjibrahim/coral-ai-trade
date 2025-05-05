
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("PAY1");
  
  const paymentChannels = ["PAY1", "PAY2", "PAY3", "PAY4"];
  
  return (
    <MobileLayout showBackButton title="Deposit">
      <div className="p-4 flex flex-col h-full animate-fade-in">
        {/* Amount Input */}
        <div className="flex items-center mb-4">
          <span className="text-6xl font-bold mr-2">₹</span>
          <span className="text-8xl font-bold">
            {amount ? amount : "0"}
          </span>
        </div>
        
        <div className="text-right mb-8">
          <p className="text-muted-foreground text-lg">Minimum Deposit ₹600</p>
        </div>
        
        {/* Payment Channels */}
        <div className="mb-8">
          <h2 className="text-center text-xl mb-4">Payment Channels</h2>
          <div className="bg-secondary/50 rounded-full p-2 flex justify-between">
            {paymentChannels.map((channel) => (
              <button 
                key={channel}
                className={`py-2 px-4 rounded-full transition-colors ${selectedChannel === channel ? 'bg-muted' : ''}`}
                onClick={() => setSelectedChannel(channel)}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
        
        {/* Keypad */}
        <div className="flex-1 flex flex-col justify-end">
          <NumericKeypad 
            value={amount}
            onChange={setAmount}
            className="mb-4"
          />
          
          <button className="w-full py-4 rounded-xl bg-primary text-white text-lg font-medium">
            CONFIRM
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
