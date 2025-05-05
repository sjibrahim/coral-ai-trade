
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { mockBalances } from "@/data/mockData";
import { Bell } from "lucide-react";

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const { availableBalance } = mockBalances;
  
  const bankAccount = "8054426413";
  const ifscCode = "AIRP0000001";

  const isValidAmount = Number(amount) >= 300 && Number(amount) <= availableBalance;
  
  const handleConfirm = () => {
    // Handle withdrawal confirmation
    console.log("Confirm withdrawal of", amount);
  };
  
  return (
    <MobileLayout 
      showBackButton 
      title="Withdrawal"
      rightActions={(
        <button className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
      )}
    >
      <div className="flex flex-col h-full p-4">
        {/* Amount Display */}
        <div className="flex items-baseline text-left mb-2">
          <span className="text-4xl font-bold mr-2">₹</span>
          <span className="text-7xl font-bold">
            {amount ? amount : "0"}
          </span>
        </div>
        
        {/* Minimum Withdrawal Info */}
        <div className="text-right mb-4">
          <p className="text-gray-400">Minimum Withdrawal ₹300</p>
        </div>
        
        {/* Withdrawal Balance */}
        <div className="text-center mb-6">
          <p className="text-gray-400 mb-1">Withdrawal Balance</p>
          <p className="text-3xl font-bold">₹{availableBalance.toLocaleString()}</p>
        </div>
        
        {/* Bank Account Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#0F1219]/40 backdrop-blur-sm rounded-xl p-3 border border-[#222]">
            <p className="text-blue-400 text-sm mb-1">Bank Account</p>
            <p className="text-lg">{bankAccount}</p>
          </div>
          <div className="bg-[#0F1219]/40 backdrop-blur-sm rounded-xl p-3 border border-[#222]">
            <p className="text-blue-400 text-sm mb-1">IFSC code</p>
            <p className="text-lg">{ifscCode}</p>
          </div>
        </div>
        
        {/* Keypad */}
        <div className="flex-1 flex flex-col justify-end">
          <NumericKeypad 
            value={amount}
            onChange={setAmount}
            onConfirm={isValidAmount ? handleConfirm : undefined}
            confirmButtonText="SUBMIT"
          />
        </div>
      </div>
    </MobileLayout>
  );
};

export default WithdrawPage;
