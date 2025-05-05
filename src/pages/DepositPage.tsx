
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { cn } from "@/lib/utils";
import { ArrowDownCircle, Info, AlertCircle, Check } from "lucide-react";

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("PAY1");
  
  const paymentChannels = ["PAY1", "PAY2", "PAY3", "PAY4"];
  const isValidAmount = Number(amount) >= 600;
  
  return (
    <MobileLayout showBackButton title="Deposit">
      <div className="p-4 flex flex-col h-full animate-fade-in max-w-md mx-auto pb-8">
        {/* Amount Input */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 mb-4 border border-border/40">
          <div className="flex items-baseline mb-2">
            <span className="text-4xl font-bold mr-2 text-primary">₹</span>
            <span className="text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {amount ? amount : "0"}
            </span>
          </div>
          
          <div className="flex items-center gap-1 mt-2 text-right ml-auto">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <p className="text-muted-foreground">Minimum Deposit ₹600</p>
          </div>
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[1000, 2000, 5000, 10000, 20000, 50000].map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value.toString())}
              className="py-2 rounded-lg bg-secondary/50 hover:bg-accent/70 transition-colors border border-border/20 text-sm font-medium"
            >
              ₹{value.toLocaleString()}
            </button>
          ))}
        </div>
        
        {/* Payment Channels */}
        <div className="mb-6">
          <h2 className="text-base font-medium mb-3 flex items-center">
            <Info className="w-4 h-4 mr-1.5 text-primary" />
            Payment Channels
          </h2>
          <div className="bg-secondary/50 rounded-xl p-2 flex justify-between">
            {paymentChannels.map((channel) => (
              <button 
                key={channel}
                className={cn(
                  "py-2 px-4 rounded-lg transition-colors flex-1 text-center text-sm",
                  selectedChannel === channel 
                    ? 'bg-primary text-white font-medium shadow-md' 
                    : 'text-muted-foreground hover:bg-accent/50'
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
            className="mb-4"
          />
          
          <button 
            className={cn(
              "w-full py-4 rounded-xl text-white text-base font-medium flex items-center justify-center gap-2 transition-all",
              isValidAmount 
                ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20" 
                : "bg-gray-500/50 opacity-70"
            )}
            disabled={!isValidAmount}
          >
            <ArrowDownCircle className="w-5 h-5" />
            {isValidAmount ? 'CONFIRM DEPOSIT' : 'ENTER VALID AMOUNT'}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DepositPage;
