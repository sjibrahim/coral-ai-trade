
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactions } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity, Wallet, Clock, Check, AlertTriangle, Loader2, Filter } from "lucide-react";

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
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const creditTypes = ["topup", "checkin", "mission", "invite reward", "team commission", "salary"];
    const debitTypes = ["withdraw", "purchase", "trade"];
    
    const isCredit = creditTypes.some(t => type.toLowerCase().includes(t.toLowerCase()));
    const isDebit = debitTypes.some(t => type.toLowerCase().includes(t.toLowerCase()));
    
    if (isCredit) {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30">
        <div className="p-4 space-y-4 pb-20">
          {/* Header Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardContent className="p-4 text-center">
                <Wallet className="h-6 w-6 mx-auto mb-2" />
                <p className="text-lg font-bold">{transactions.length}</p>
                <p className="text-xs opacity-90">Total</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <p className="text-lg font-bold">{transactions.filter(t => !isDebitTransaction(t.txn_type)).length}</p>
                <p className="text-xs opacity-90">Credits</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardContent className="p-4 text-center">
                <TrendingDown className="h-6 w-6 mx-auto mb-2" />
                <p className="text-lg font-bold">{transactions.filter(t => isDebitTransaction(t.txn_type)).length}</p>
                <p className="text-xs opacity-90">Debits</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full bg-white border border-gray-200">
              <TabsTrigger value="all" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="topup" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                Deposits
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                Withdrawals
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Transactions</h3>
                    <p className="text-red-600">{error}</p>
                  </CardContent>
                </Card>
              ) : filteredTransactions.length === 0 ? (
                <Card className="bg-gray-50">
                  <CardContent className="p-8 text-center">
                    <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Transactions Found</h3>
                    <p className="text-gray-500">No transactions match your current filter</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <Card key={transaction.txnid} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                              {getTypeIcon(transaction.txn_type)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 capitalize">
                                {transaction.txn_type.replace(/^\w/, c => c.toUpperCase())}
                              </p>
                              <p className="text-xs text-gray-500">#{transaction.txnid}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              "text-xl font-bold",
                              isDebitTransaction(transaction.txn_type) ? "text-red-500" : "text-green-500"
                            )}>
                              {isDebitTransaction(transaction.txn_type) ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(transaction.status)}
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              transaction.status.toLowerCase() === 'completed' 
                                ? "bg-green-100 text-green-700"
                                : transaction.status.toLowerCase() === 'pending'
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            )}>
                              {transaction.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </p>
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
