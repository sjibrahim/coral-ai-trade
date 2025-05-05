
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface BalanceSummaryProps {
  totalBalance: number;
  totalDeposit: number;
  totalWithdrawal: number;
  availableBalance: number;
}

const BalanceSummary = ({ 
  totalBalance, 
  totalDeposit, 
  totalWithdrawal, 
  availableBalance 
}: BalanceSummaryProps) => {
  const [hideBalance, setHideBalance] = useState(false);
  
  const toggleBalanceVisibility = () => {
    setHideBalance(!hideBalance);
  };
  
  const displayAmount = (amount: number) => {
    return hideBalance ? "****.**" : amount.toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg text-muted-foreground">TOTAL BALANCE</h2>
        <button onClick={toggleBalanceVisibility} className="p-1">
          {hideBalance ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <div className="flex items-center">
        <span className="text-2xl">₹</span>
        <span className="text-4xl font-semibold ml-2">{displayAmount(totalBalance)}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className={cn(
            "text-xl font-medium",
            totalDeposit < 0 ? "text-market-decrease" : ""
          )}>
            ₹ {displayAmount(totalDeposit)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Total Deposit</p>
        </div>
        
        <div className="text-center">
          <p className="text-xl font-medium">
            ₹ {displayAmount(totalWithdrawal)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Total Withdrawal</p>
        </div>
        
        <div className="text-center">
          <p className="text-xl font-medium">
            ₹ {displayAmount(availableBalance)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Available</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;
