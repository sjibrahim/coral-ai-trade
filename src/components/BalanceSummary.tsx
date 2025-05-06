
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
        <h2 className="text-sm text-muted-foreground">TOTAL BALANCE</h2>
        <button 
          onClick={toggleBalanceVisibility} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      <div className="flex items-center">
        <span className="text-xl font-normal">{currencySymbol}</span>
        <span className="text-3xl font-semibold ml-1 text-gradient">{displayAmount(totalBalance)}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center glass-card p-2.5 rounded-lg backdrop-blur-sm animate-fade-in">
          <p className={cn(
            "text-base font-medium",
            totalDeposit < 0 ? "text-market-decrease" : ""
          )}>
            {currencySymbol} {displayAmount(totalDeposit)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Deposit</p>
        </div>
        
        <div className="text-center glass-card p-2.5 rounded-lg backdrop-blur-sm animate-fade-in" style={{animationDelay: "50ms"}}>
          <p className="text-base font-medium">
            {currencySymbol} {displayAmount(totalWithdrawal)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Withdrawal</p>
        </div>
        
        <div className="text-center glass-card p-2.5 rounded-lg backdrop-blur-sm animate-fade-in" style={{animationDelay: "100ms"}}>
          <p className="text-base font-medium">
            {currencySymbol} {displayAmount(availableBalance)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Available</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;
