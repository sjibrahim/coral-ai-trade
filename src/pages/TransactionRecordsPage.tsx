
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactions } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle, Calendar, Check, AlertTriangle, Loader2, TrendingUp, TrendingDown, Activity, Wallet, Receipt } from "lucide-react";

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
      return <Activity className="h-5 w-5 text-blue-500" />;
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
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          {/* Header Card */}
          <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg mb-6">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-bold mb-1">Transaction History</h1>
              <p className="text-emerald-100 text-sm">Track all your financial activities</p>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6 bg-white shadow-sm h-12">
              <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-sm font-medium">All</TabsTrigger>
              <TabsTrigger value="topup" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-sm font-medium">Deposits</TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-sm font-medium">Withdrawals</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, idx) => (
                    <Card key={`skeleton-${idx}`} className="bg-white shadow-sm animate-pulse">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                          <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                    <p className="text-red-600 text-center">{error}</p>
                  </CardContent>
                </Card>
              ) : filteredTransactions.length === 0 ? (
                <Card className="bg-white shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-500 text-center">Start trading to see your transaction history</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 pb-24">
                  {filteredTransactions.map((transaction) => (
                    <Card key={transaction.txnid} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              {getTypeIcon(transaction.txn_type)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-base">
                                {transaction.txn_type.replace(/^\w/, c => c.toUpperCase())}
                              </p>
                              <p className="text-sm text-gray-500">#{transaction.txnid}</p>
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
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            <span className={cn(
                              "ml-2 px-3 py-1 rounded-full text-sm font-medium",
                              transaction.status.toLowerCase() === 'completed' 
                                ? "bg-emerald-100 text-emerald-700"
                                : transaction.status.toLowerCase() === 'pending'
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            )}>
                              {transaction.status}
                            </span>
                          </div>
                          <div className="text-gray-500 text-sm">
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
