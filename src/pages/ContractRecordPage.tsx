
import MobileLayout from "@/components/layout/MobileLayout";
import { mockTransactions } from "@/data/mockData";
import { cn } from "@/lib/utils";

const ContractRecordPage = () => {
  return (
    <MobileLayout showBackButton title="Contract Record">
      <div className="p-4 space-y-6 animate-fade-in">
        {mockTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="bg-card rounded-xl p-5 border border-border/40"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <img src={transaction.logo} alt={transaction.coin} className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{transaction.coin} / {transaction.symbol}</h3>
              </div>
              <div className="ml-auto">
                <h3 className={cn(
                  "font-semibold text-lg",
                  transaction.profit > 0 ? "text-market-increase" : "text-market-decrease"
                )}>
                  Profit: ₹{transaction.profit}
                </h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount: ₹{transaction.amount}</p>
                <p className="text-sm text-muted-foreground">BuyTime: {transaction.buyTime}</p>
                <p className="text-sm text-muted-foreground">Obtained Price: {transaction.obtainedPrice.toFixed(4)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Balance: ₹{transaction.currentBalance}</p>
                <p className="text-sm text-muted-foreground">SellTime: {transaction.sellTime}</p>
                <p className="text-sm text-muted-foreground">Closure Price: {transaction.closurePrice.toFixed(4)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default ContractRecordPage;
