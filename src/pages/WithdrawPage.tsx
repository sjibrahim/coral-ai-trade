
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { mockBalances } from "@/data/mockData";
import { CreditCard, AlertTriangle } from "lucide-react";

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const { availableBalance } = mockBalances;
  
  const bankAccount = "8054426413";
  const ifscCode = "AIRP0000001";

  const isValidAmount = Number(amount) >= 300 && Number(amount) <= availableBalance;
  
  return (
    <MobileLayout showBackButton title="Withdrawal">
      <div className="p-4 flex flex-col h-full animate-fade-in">
        {/* Amount Input */}
        <div className="flex items-center justify-center mb-4">
          <span className="text-6xl font-bold mr-2 text-muted-foreground">₹</span>
          <span className="text-8xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {amount ? amount : "0"}
          </span>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-muted-foreground text-lg flex items-center justify-center gap-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> 
            Minimum Withdrawal ₹300
          </p>
        </div>
        
        {/* Balance */}
        <div className="glass-card rounded-xl p-4 mb-8 shadow-lg border border-border/40">
          <p className="text-center text-muted-foreground text-lg mb-1">Withdrawal Balance</p>
          <p className="text-center text-4xl font-semibold bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">₹{availableBalance}</p>
        </div>
        
        {/* Bank Details */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border border-border/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <p className="text-blue-400 text-sm">Bank Account</p>
            </div>
            <p className="text-lg font-medium">{bankAccount}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p className="text-blue-400 text-sm">IFSC code</p>
            </div>
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
          
          <button 
            className={`w-full py-4 rounded-xl text-white text-lg font-medium shadow-lg flex items-center justify-center gap-2 transition-all ${
              isValidAmount 
                ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/20"
                : "bg-gray-500/50 opacity-70"
            }`}
            disabled={!isValidAmount}
          >
            <ArrowUpCircle className="w-5 h-5" />
            SUBMIT
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

const ArrowUpCircle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="16 12 12 8 8 12"></polyline>
    <line x1="12" y1="16" x2="12" y2="8"></line>
  </svg>
);

export default WithdrawPage;
