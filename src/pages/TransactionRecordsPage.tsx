import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactions, getGeneralSettings } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle, Calendar, Check, AlertTriangle, Loader2, TrendingUp, TrendingDown } from "lucide-react";

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

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      
      try {
        setIsLoading(true);
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Check className="h-4 w-4 text-emerald-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    const creditTypes = ["topup", "checkin", "mission", "invite reward", "team commission", "salary"];
    const debitTypes = ["withdraw", "purchase", "trade"];
    
    const isCredit = creditTypes.some(t => type.toLowerCase().includes(t.toLowerCase()));
    const isDebit = debitTypes.some(t => type.toLowerCase().includes(t.toLowerCase()));
    
    if (isCredit) {
      return <TrendingUp className="h-5 w-5 text-emerald-500" />;
    } else if (isDebit) {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
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

  return (
    <MobileLayout showBackButton title="Transaction History">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Trexo Transactions</h1>
            <p className="text-muted-foreground">Your complete trading and transaction history</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="topup" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Deposits</TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Withdrawals</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-2" />
                  <p className="text-muted-foreground">Loading transactions...</p>
                </div>
              ) : error ? (
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                  </CardContent>
                </Card>
              ) : filteredTransactions.length === 0 ? (
                <Card className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-semibold mb-1">No transactions yet</h3>
                    <p className="text-muted-foreground text-center">Start trading on Trexo to see your transaction history</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <Card key={transaction.txnid} className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3">
                              {getTypeIcon(transaction.txn_type)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {transaction.txn_type.replace(/^\w/, c => c.toUpperCase())}
                              </p>
                              <p className="text-xs text-muted-foreground">#{transaction.txnid}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              "font-bold text-lg",
                              isDebitTransaction(transaction.txn_type) ? "text-red-500" : "text-emerald-500"
                            )}>
                              {isDebitTransaction(transaction.txn_type) ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            <span className={cn(
                              "ml-2 px-2 py-1 rounded-full text-xs font-medium",
                              transaction.status.toLowerCase() === 'completed' 
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : transaction.status.toLowerCase() === 'pending'
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            )}>
                              {transaction.status}
                            </span>
                          </div>
                          <div className="text-muted-foreground">
                            {formatDate(transaction.created_at)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MobileLayout>
  );
};

export default TransactionRecordsPage;