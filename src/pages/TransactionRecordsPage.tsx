
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactions } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Calendar, CheckCircle, AlertCircle, Loader2, TrendingUp, TrendingDown, Activity, Clock, Filter } from "lucide-react";

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
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const creditTypes = ["topup", "checkin", "mission", "invite reward", "team commission", "salary"];
    const debitTypes = ["withdraw", "purchase", "trade"];
    
    const isCredit = creditTypes.some(t => type.toLowerCase().includes(t.toLowerCase()));
    const isDebit = debitTypes.some(t => type.toLowerCase().includes(t.toLowerCase()));
    
    if (isCredit) {
      return <ArrowDownLeft className="h-6 w-6 text-green-500" />;
    } else if (isDebit) {
      return <ArrowUpRight className="h-6 w-6 text-red-500" />;
    } else {
      return <Activity className="h-6 w-6 text-blue-500" />;
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
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <MobileLayout showBackButton title="Transactions">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Transaction History</h1>
                <p className="text-slate-600 mt-1">Track your financial activities</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Filter className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full bg-slate-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="topup" 
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  Credits
                </TabsTrigger>
                <TabsTrigger 
                  value="withdraw" 
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  Debits
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, idx) => (
                  <div key={`skeleton-${idx}`} className="bg-white rounded-2xl p-4 animate-pulse border border-slate-200">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-slate-200 rounded"></div>
                        <div className="h-3 w-24 bg-slate-200 rounded"></div>
                      </div>
                      <div className="h-6 w-20 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-red-200">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Transactions</h3>
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Calendar className="h-20 w-20 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No Transactions</h3>
                <p className="text-slate-600">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 pb-6">
                {filteredTransactions.map((transaction) => (
                  <div 
                    key={transaction.txnid} 
                    className="bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-slate-50 rounded-full">
                            {getTypeIcon(transaction.txn_type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-lg">
                              {transaction.txn_type.replace(/^\w/, c => c.toUpperCase())}
                            </h3>
                            <p className="text-slate-500 text-sm">#{transaction.txnid}</p>
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
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className="text-sm font-medium text-slate-700">
                            {transaction.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-slate-500">
                          {formatDate(transaction.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </div>
    </MobileLayout>
  );
};

export default TransactionRecordsPage;
