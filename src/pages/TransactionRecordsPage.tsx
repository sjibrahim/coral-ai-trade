import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactions } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle, Loader2, TrendingUp, TrendingDown, Activity, Calendar, Filter } from "lucide-react";

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
  const [statusFilter, setStatusFilter] = useState("all");

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
    // Filter by transaction type
    const typeMatch = activeTab === "all" || transaction.txn_type.toLowerCase() === activeTab.toLowerCase();
    
    // Filter by status
    const statusMatch = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase();
    
    return typeMatch && statusMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <Check className="h-3 w-3 text-emerald-400" />;
      case 'pending':
        return <Loader2 className="h-3 w-3 text-amber-400 animate-spin" />;
      case 'processing':
        return <Loader2 className="h-3 w-3 text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-3 w-3 text-red-400" />;
      default:
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

  const getStatusFilterLabel = () => {
    switch (statusFilter) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'completed':
      case 'success':
        return 'Success';
      case 'failed':
        return 'Failed';
      default:
        return 'Filter';
    }
  };

  const FilterDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white h-8"
        >
          <Filter className="h-4 w-4 mr-1" />
          {getStatusFilterLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white z-50">
        <DropdownMenuItem 
          onClick={() => setStatusFilter("all")}
          className="hover:bg-gray-700 focus:bg-gray-700"
        >
          All Status
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter("pending")}
          className="hover:bg-gray-700 focus:bg-gray-700"
        >
          <Loader2 className="h-4 w-4 mr-2 text-amber-400" />
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter("processing")}
          className="hover:bg-gray-700 focus:bg-gray-700"
        >
          <Loader2 className="h-4 w-4 mr-2 text-blue-400" />
          Processing
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter("completed")}
          className="hover:bg-gray-700 focus:bg-gray-700"
        >
          <Check className="h-4 w-4 mr-2 text-emerald-400" />
          Success
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter("failed")}
          className="hover:bg-gray-700 focus:bg-gray-700"
        >
          <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
          Failed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <MobileLayout 
      showBackButton 
      title="Transactions" 
      hideFooter
      headerAction={<FilterDropdown />}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="p-3 pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4 bg-gray-800/50 backdrop-blur-sm h-10 border border-gray-700/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs font-medium">All</TabsTrigger>
              <TabsTrigger value="topup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs font-medium">Deposits</TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs font-medium">Withdrawals</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, idx) => (
                    <Card key={`skeleton-${idx}`} className="bg-gray-800/50 border-gray-700/50 animate-pulse">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="h-3 w-16 bg-gray-700 rounded"></div>
                          <div className="h-3 w-12 bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-5 w-20 bg-gray-700 rounded"></div>
                        <div className="h-2 w-28 bg-gray-700 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card className="bg-red-500/10 border-red-500/20 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <AlertTriangle className="h-10 w-10 text-red-400 mb-3" />
                    <p className="text-red-400 text-center text-sm">{error}</p>
                  </CardContent>
                </Card>
              ) : filteredTransactions.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-500 mb-3" />
                    <h3 className="text-base font-semibold text-white mb-2">No transactions found</h3>
                    <p className="text-gray-400 text-center text-sm">
                      {statusFilter !== "all" ? `No ${getStatusFilterLabel().toLowerCase()} transactions found` : "Start trading to see your transaction history"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <Card key={transaction.txnid} className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-all duration-200 backdrop-blur-sm">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-white text-sm">
                              {transaction.txn_type.replace(/^\w/, c => c.toUpperCase())}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              "font-bold text-base",
                              isDebitTransaction(transaction.txn_type) ? "text-red-400" : "text-emerald-400"
                            )}>
                              {isDebitTransaction(transaction.txn_type) ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            <span className={cn(
                              "ml-2 px-2 py-0.5 rounded-full text-xs font-medium",
                              transaction.status.toLowerCase() === 'completed' || transaction.status.toLowerCase() === 'success'
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : transaction.status.toLowerCase() === 'pending'
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : transaction.status.toLowerCase() === 'processing'
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            )}>
                              {transaction.status}
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs">
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
