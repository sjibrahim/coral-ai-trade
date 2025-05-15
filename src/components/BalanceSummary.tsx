
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface BalanceSummaryProps {
  totalBalance: number;
  totalDeposit: number;
  totalWithdrawal: number;
  availableBalance: number;
  asUSDT?: boolean;
}

const BalanceSummary = ({ 
  totalBalance, 
  totalDeposit, 
  totalWithdrawal, 
  availableBalance,
  asUSDT = false
}: BalanceSummaryProps) => {
  const [hideBalance, setHideBalance] = useState(false);
  
  const toggleBalanceVisibility = () => {
    setHideBalance(!hideBalance);
  };
  
  const displayAmount = (amount: number) => {
    return hideBalance ? "****.**" : amount.toLocaleString();
  };

  const currencySymbol = asUSDT ? 'USDT' : '₹';

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">AVAILABLE BALANCE</h2>
        <button 
          onClick={toggleBalanceVisibility} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      <div className="flex items-center">
        <span className="text-xl font-normal">{currencySymbol}</span>
        <span className="text-3xl font-semibold ml-1 text-gradient">{displayAmount(availableBalance)}</span>
      </div>
      
      {/* Deposit Balance Display */}
      <div className="flex justify-between items-center pt-2 border-t border-white/10">
        <div className="text-sm text-muted-foreground">
          Deposit Balance
        </div>
        <div className="flex items-center">
          <span className="text-sm font-normal">{currencySymbol}</span>
          <span className="text-base font-medium ml-0.5">{displayAmount(totalDeposit)}</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;
