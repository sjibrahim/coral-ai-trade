
import { cn } from "@/lib/utils";
import { Eye, EyeOff, BadgeInfo } from "lucide-react";
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
    return hideBalance ? "******" : amount.toLocaleString();
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
      
      {/* Highlighted Deposit Balance - Enhanced for better visibility */}
      <div className="p-4 mt-2 rounded-lg border-2 border-primary/30 bg-secondary/60 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <BadgeInfo size={18} className="text-primary" />
          <span className="text-sm font-semibold text-primary">Deposit Balance</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total deposits</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">{currencySymbol}</span>
            <span className="text-lg font-bold ml-0.5 text-gradient-primary">{displayAmount(totalDeposit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;
