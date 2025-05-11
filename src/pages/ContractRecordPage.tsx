
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getTradeRecords } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface TradeRecord {
  id: string;
  asset_name: string;
  asset_symbol: string;
  amount_inr: string;
  buy_time: string;
  obtained_price: string;
  sell_time: string;
  closure_price: string;
  current_balance: string;
  pnl_type: string;
  pnl_amount: string;
  logo: string;
}

const ContractRecordPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<TradeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTradeRecords = async () => {
      try {
        setIsLoading(true);
        if (user?.token) {
          const response = await getTradeRecords(user.token);
          if (response.status) {
            setRecords(response.data || []);
          } else {
            toast({
              title: "Error",
              description: response.msg || "Failed to fetch contract records",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching contract records:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching contract records",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradeRecords();
  }, [user?.token, toast]);

  return (
    <MobileLayout showBackButton title="Contract Record">
      <div className="p-4 space-y-6 animate-fade-in">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-card rounded-xl p-5 border border-border/40 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <div className="ml-auto">
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-24 ml-auto" />
                  <Skeleton className="h-4 w-32 ml-auto" />
                  <Skeleton className="h-4 w-28 ml-auto" />
                </div>
              </div>
            </div>
          ))
        ) : records.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">No contract records found</h3>
            <p className="text-muted-foreground mt-1">
              Your trading contract records will appear here
            </p>
          </div>
        ) : (
          // Contract records
          records.map((record) => (
            <div 
              key={record.id}
              className="bg-card rounded-xl p-5 border border-border/40"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  {record.logo ? (
                    <img 
                      src={record.logo} 
                      alt={record.asset_name} 
                      className="w-8 h-8" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <span className="font-bold text-xs">{record.asset_symbol.slice(0, 2)}</span>
                  )}
                  <div className="hidden absolute inset-0 flex items-center justify-center font-bold text-xs">
                    {record.asset_symbol.slice(0, 2)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{record.asset_name} / {record.asset_symbol}</h3>
                </div>
                <div className="ml-auto">
                  <h3 className={cn(
                    "font-semibold text-lg",
                    record.pnl_type === "Profit" ? "text-market-increase" : "text-market-decrease"
                  )}>
                    {record.pnl_type}: ₹{record.pnl_amount}
                  </h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount: ₹{record.amount_inr}</p>
                  <p className="text-sm text-muted-foreground">BuyTime: {record.buy_time}</p>
                  <p className="text-sm text-muted-foreground">Obtained Price: {parseFloat(record.obtained_price).toFixed(4)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Balance: ₹{record.current_balance}</p>
                  <p className="text-sm text-muted-foreground">SellTime: {record.sell_time}</p>
                  <p className="text-sm text-muted-foreground">Closure Price: {parseFloat(record.closure_price).toFixed(4)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </MobileLayout>
  );
};

export default ContractRecordPage;
