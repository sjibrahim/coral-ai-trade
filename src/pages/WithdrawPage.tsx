
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import NumericKeypad from "@/components/NumericKeypad";
import { mockBalances } from "@/data/mockData";
import { CreditCard, AlertTriangle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const { availableBalance } = mockBalances;
  
  const bankAccount = "8054426413";
  const ifscCode = "AIRP0000001";

  const isValidAmount = Number(amount) >= 300 && Number(amount) <= availableBalance;
  
  return (
    <MobileLayout showBackButton title="Withdrawal">
      <div className="p-4 flex flex-col h-full animate-fade-in max-w-md mx-auto pb-8">
        {/* Amount Input */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 mb-4 border border-border/40">
          <div className="flex items-baseline mb-2">
            <span className="text-4xl font-bold mr-2 text-primary">₹</span>
            <span className="text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {amount ? amount : "0"}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 mt-2 text-right ml-auto">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> 
            <p className="text-muted-foreground">Minimum Withdrawal ₹300</p>
          </div>
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[500, 1000, 2000, 5000, 10000, availableBalance].map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value.toString())}
              className="py-2 rounded-lg bg-secondary/50 hover:bg-accent/70 transition-colors border border-border/20 text-sm font-medium"
            >
              {value === availableBalance ? "MAX" : `₹${value.toLocaleString()}`}
            </button>
          ))}
        </div>
        
        {/* Balance */}
        <div className="glass-card rounded-xl p-4 mb-6 shadow-lg border border-border/40">
          <p className="text-center text-muted-foreground text-base mb-1">Withdrawal Balance</p>
          <p className="text-center text-3xl font-semibold bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">₹{availableBalance.toLocaleString()}</p>
        </div>
        
        {/* Bank Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card/40 rounded-xl p-4 border border-border/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <p className="text-blue-400 text-sm">Bank Account</p>
            </div>
            <p className="text-lg font-medium">{bankAccount}</p>
          </div>
          <div className="bg-card/40 rounded-xl p-4 border border-border/40 backdrop-blur-sm">
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
        <div className="mt-auto">
          <NumericKeypad 
            value={amount}
            onChange={setAmount}
            className="mb-4"
          />
          
          <button 
            className={cn(
              "w-full py-4 rounded-xl text-white text-base font-medium shadow-lg flex items-center justify-center gap-2 transition-all",
              isValidAmount 
                ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/20"
                : "bg-gray-500/50 opacity-70"
            )}
            disabled={!isValidAmount}
          >
            <ArrowUpCircle className="w-5 h-5" />
            {isValidAmount ? 'CONFIRM WITHDRAWAL' : 'ENTER VALID AMOUNT'}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default WithdrawPage;
