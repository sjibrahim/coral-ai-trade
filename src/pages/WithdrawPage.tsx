
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { mockBalances } from "@/data/mockData";

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const { availableBalance } = mockBalances;
  
  const bankAccount = "8054426413";
  const ifscCode = "AIRP0000001";
  
  return (
    <MobileLayout showBackButton title="Withdrawal">
      <div className="p-4 flex flex-col h-full animate-fade-in">
        {/* Amount Input */}
        <div className="flex items-center mb-4">
          <span className="text-6xl font-bold mr-2">₹</span>
          <span className="text-8xl font-bold">
            {amount ? amount : "0"}
          </span>
        </div>
        
        <div className="text-right mb-4">
          <p className="text-muted-foreground text-lg">Minimum Withdrawal ₹300</p>
        </div>
        
        {/* Balance */}
        <div className="bg-card rounded-xl p-4 mb-8">
          <p className="text-center text-muted-foreground text-lg mb-1">Withdrawal Balance</p>
          <p className="text-center text-4xl font-semibold">₹{availableBalance}</p>
        </div>
        
        {/* Bank Details */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-xl p-3">
            <p className="text-blue-500 mb-1">Bank Account</p>
            <p className="text-lg font-medium">{bankAccount}</p>
          </div>
          <div className="bg-card rounded-xl p-3">
            <p className="text-blue-500 mb-1">IFSC code</p>
            <p className="text-lg font-medium">{ifscCode}</p>
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
            SUBMIT
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default WithdrawPage;
