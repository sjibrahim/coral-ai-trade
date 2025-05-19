
import { cn } from "@/lib/utils";
import { Eye, EyeOff, BadgeInfo, Wallet, IndianRupee } from "lucide-react";
import { useState } from "react";

interface BalanceSummaryProps {
  totalBalance: number;
  totalDeposit: number;
  totalWithdrawal: number;
  availableBalance: number;
  asUSDT?: boolean;
  showDepositProminent?: boolean;
  showSmallDeposit?: boolean;
}

const BalanceSummary = ({ 
  totalBalance, 
  totalDeposit, 
  totalWithdrawal, 
  availableBalance,
  asUSDT = false,
  showDepositProminent = false,
  showSmallDeposit = false
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
      
      {showSmallDeposit && (
        <div className="flex items-center justify-between mt-1 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wallet size={14} />
            <span>Total Deposit:</span>
          </div>
          <div className="font-medium">
            {currencySymbol} {displayAmount(totalDeposit)}
          </div>
        </div>
      )}
      
      {showDepositProminent && (
        <div className="p-4 mt-3 rounded-lg border-[3px] border-primary bg-primary/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary/70 to-transparent"></div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/30 rounded-full">
              <BadgeInfo size={24} className="text-primary" />
            </div>
            <span className="text-base font-extrabold text-primary tracking-wide">DEPOSIT BALANCE</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-muted-foreground">Total deposits</span>
            <div className="flex items-center">
              <span className="text-lg font-medium">{currencySymbol}</span>
              <span className="text-2xl font-bold ml-0.5 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">{displayAmount(totalDeposit)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceSummary;
