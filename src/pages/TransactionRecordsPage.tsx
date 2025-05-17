
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactions, getGeneralSettings } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle, Calendar, Check, AlertTriangle, Loader2, Wallet, IndianRupee } from "lucide-react";

interface Transaction {
  txnid: string;
  txn_type: string;
  amount: number;
  charges: number;
  net_amount: number;
  created_at: string;
  updated_at: string;
  status: string;
  method?: string;
}

const TransactionRecordsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [usdtPrice, setUsdtPrice] = useState(83); // Default USDT price

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      
      try {
        setIsLoading(true);

        // Fetch USDT price from general settings
        const settingsResponse = await getGeneralSettings(user.token);
        if (settingsResponse.status && settingsResponse.data) {
          setUsdtPrice(parseFloat(settingsResponse.data.usdt_price) || 83);
        }

        // Fetch all transactions
        const response = await getTransactions(user.token);
        
        if (response.status) {
          setTransactions(response.data);
          setError(null);
        } else {
          setError(response.msg || "Failed to fetch transactions");
        }
      } catch (err) {
        setError("An error occurred while fetching transactions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "all") return true;
    return transaction.txn_type.toLowerCase() === activeTab.toLowerCase();
  });

  // Convert INR to USD based on USDT price
  const convertToUSD = (amountInr: number) => {
    return (amountInr / usdtPrice).toFixed(2);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string, method?: string) => {
    // Check if it's a USDT withdrawal
    if (type.toLowerCase() === "withdraw" && method?.toUpperCase() === "USDT") {
      return <Wallet className="h-5 w-5 text-amber-400" />;
    }

    // Credit transactions
    const creditTypes = ["topup", "checkin", "mission", "invite reward", "team commission", "salary"];
    // Debit transactions
    const debitTypes = ["withdraw", "purchase", "trade"];
    
    const isCredit = creditTypes.some(t => type.toLowerCase().includes(t.toLowerCase()));
    const isDebit = debitTypes.some(t => type.toLowerCase().includes(t.toLowerCase()));
    
    if (isCredit) {
      return <ArrowDownCircle className="h-5 w-5 text-market-increase" />;
    } else if (isDebit) {
      return <ArrowUpCircle className="h-5 w-5 text-market-decrease" />;
    } else {
      return null;
    }
  };

  const isDebitTransaction = (type: string) => {
    const debitTypes = ["withdraw", "purchase", "trade"];
    return debitTypes.some(t => type.toLowerCase().includes(t.toLowerCase()));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isUsdtWithdrawal = (transaction: Transaction) => {
    return transaction.txn_type.toLowerCase() === "withdraw" && 
           transaction.method?.toUpperCase() === "USDT";
  };

  return (
    <MobileLayout showBackButton title="Transaction Records">
      <div className="p-4 animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="topup" className="text-xs">Top-up</TabsTrigger>
            <TabsTrigger value="withdraw" className="text-xs">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16">
                <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.txnid} className="bg-card rounded-xl p-4 border border-border/40 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center mr-3 border border-border/40">
                          {getTypeIcon(transaction.txn_type, transaction.method)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.txn_type}
                            {isUsdtWithdrawal(transaction) && 
                              <span className="ml-1 text-xs text-amber-400">(USDT)</span>
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.txnid}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isUsdtWithdrawal(transaction) ? (
                          <div>
                            <p className={cn(
                              "font-semibold text-lg",
                              "text-market-decrease"
                            )}>
                              -${convertToUSD(transaction.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">₹{transaction.amount}</p>
                          </div>
                        ) : (
                          <p className={cn(
                            "font-semibold text-lg",
                            isDebitTransaction(transaction.txn_type) ? "text-market-decrease" : "text-market-increase"
                          )}>
                            {isDebitTransaction(transaction.txn_type) ? '-' : '+'}₹{transaction.amount}
                          </p>
                        )}
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{transaction.status}</span>
                      </div>
                      <div>{formatDate(transaction.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default TransactionRecordsPage;
