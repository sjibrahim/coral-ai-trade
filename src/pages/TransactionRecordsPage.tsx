
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactions } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle, Calendar, Check, AlertTriangle, Loader2, TrendingUp, TrendingDown, Activity, Wallet } from "lucide-react";

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
        return <Check className="h-3 w-3 text-emerald-500" />;
      case 'pending':
        return <Loader2 className="h-3 w-3 text-amber-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
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
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    } else if (isDebit) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Activity className="h-4 w-4 text-blue-500" />;
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4">
          {/* Header */}
          <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 shadow-xl mb-4">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold">Transaction History</h1>
              </div>
              <p className="text-emerald-100 text-xs">Track all your financial activities</p>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4 bg-white/90 backdrop-blur-sm border border-emerald-200/50 h-10">
              <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs">All</TabsTrigger>
              <TabsTrigger value="topup" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs">Deposits</TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs">Withdrawals</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-2" />
                  <p className="text-gray-600 text-sm">Loading transactions...</p>
                </div>
              ) : error ? (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </CardContent>
                </Card>
              ) : filteredTransactions.length === 0 ? (
                <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">No transactions yet</h3>
                    <p className="text-gray-600 text-center text-sm">Start trading to see your transaction history</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 pb-24">
                  {filteredTransactions.map((transaction) => (
                    <Card key={transaction.txnid} className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                              {getTypeIcon(transaction.txn_type)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {transaction.txn_type.replace(/^\w/, c => c.toUpperCase())}
                              </p>
                              <p className="text-xs text-gray-500">#{transaction.txnid}</p>
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
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            <span className={cn(
                              "ml-2 px-2 py-1 rounded-full text-xs font-medium",
                              transaction.status.toLowerCase() === 'completed' 
                                ? "bg-emerald-100 text-emerald-700"
                                : transaction.status.toLowerCase() === 'pending'
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            )}>
                              {transaction.status}
                            </span>
                          </div>
                          <div className="text-gray-500 text-xs">
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
