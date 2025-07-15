
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { 
  ArrowDownCircle, 
  IndianRupee, 
  Calendar, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Filter, 
  Eye,
  EyeOff,
  CreditCard,
  Building2,
  Hash,
  Timer,
  Banknote,
  Receipt
} from "lucide-react";
import { getTransactions, getGeneralSettings } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

interface WithdrawalRecord {
  id: string;
  amount: number;
  date: string;
  status: string;
  account: string;
  transaction_id?: string;
  created_at?: string;
  type?: string;
  method?: string;
  charges?: string | number;
  net_amount?: string | number;
}

const WithdrawalRecordsPage = () => {
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [withdrawalFeePercentage, setWithdrawalFeePercentage] = useState(2);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        // Fetch general settings for withdrawal fee
        const settingsResponse = await getGeneralSettings(token);
        if (settingsResponse.status && settingsResponse.data) {
          setWithdrawalFeePercentage(parseFloat(settingsResponse.data.withdrawal_fee) || 2);
        }

        const response = await getTransactions(token);
        
        if (response.status && Array.isArray(response.data)) {
          const withdrawals = response.data
            .filter((tx: any) => tx.txn_type === "WITHDRAW")
            .map((tx: any) => ({
              id: tx.txnid || `WD${Math.floor(Math.random() * 10000)}`,
              amount: parseFloat(tx.amount || 0),
              date: tx.created_at || new Date().toISOString().split('T')[0],
              status: tx.status || "processing",
              account: tx.bank_number || "******6413",
              transaction_id: tx.txnid || "",
              created_at: tx.created_at || "",
              type: tx.method || "BANK",
              method: tx.method || "BANK",
              charges: tx.charges || "10",
              net_amount: tx.net_amount || tx.amount
            }));
          
          setRecords(withdrawals);
          
          // Calculate total withdrawn (only successful withdrawals)
          const total = withdrawals
            .filter((record: WithdrawalRecord) => record.status.toLowerCase() === 'completed' || record.status.toLowerCase() === 'success')
            .reduce((sum: number, record: WithdrawalRecord) => sum + record.amount, 0);
          setTotalWithdrawn(total);
        } else {
          toast({
            title: "Error",
            description: response.msg || "Failed to fetch withdrawal records",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching withdrawal records:", error);
        toast({
          title: "Error",
          description: "Failed to fetch withdrawal records. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case 'processing':
      case 'pending':
        return "text-amber-600 bg-amber-50 border-amber-200";
      case 'rejected':
      case 'failed':
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today, " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday, " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else {
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) + " at " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatAmount = (amount: number) => {
    return hideAmounts ? "••••••" : `₹${amount.toLocaleString()}`;
  };

  const maskBankAccount = (account: string | undefined) => {
    if (!account) return "••••••••••";
    return "••••••••" + account.slice(-4);
  };

  const getRecordsByStatus = () => {
    const completed = records.filter(r => r.status.toLowerCase() === 'completed' || r.status.toLowerCase() === 'success').length;
    const pending = records.filter(r => r.status.toLowerCase() === 'processing' || r.status.toLowerCase() === 'pending').length;
    const failed = records.filter(r => r.status.toLowerCase() === 'rejected' || r.status.toLowerCase() === 'failed').length;
    
    return { completed, pending, failed };
  };

  const statusCounts = getRecordsByStatus();

  return (
    <MobileLayout showBackButton title="Withdrawal Records">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-6">
        
        {/* Header Stats Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Withdrawal History</h1>
                <p className="text-blue-100 text-sm">Track your withdrawal transactions</p>
              </div>
            </div>
            <button 
              onClick={() => setHideAmounts(!hideAmounts)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {hideAmounts ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Withdrawn</p>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  <span className="text-2xl font-bold">
                    {formatAmount(totalWithdrawn)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm mb-1">Total Records</p>
                <p className="text-2xl font-bold">{records.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4 -mt-3 relative z-10">
          {/* Status Overview */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{statusCounts.completed}</p>
                  <p className="text-xs text-emerald-700 font-medium">Completed</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{statusCounts.pending}</p>
                  <p className="text-xs text-amber-700 font-medium">Pending</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <XCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.failed}</p>
                  <p className="text-xs text-red-700 font-medium">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-blue-600" />
                  Recent Withdrawals
                </div>
                <Filter className="h-4 w-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-3 p-4">
                  {Array(4).fill(0).map((_, idx) => (
                    <div key={`skeleton-${idx}`} className="animate-pulse">
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                            <div className="space-y-2">
                              <div className="h-4 w-24 bg-gray-200 rounded"></div>
                              <div className="h-3 w-32 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                          <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-3 w-20 bg-gray-200 rounded"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : records.length > 0 ? (
                <div className="space-y-3 p-4">
                  {records.map((record, index) => {
                    const charges = typeof record.charges === 'string' ? parseFloat(record.charges) : record.charges || 0;
                    const netAmount = typeof record.net_amount === 'string' ? parseFloat(record.net_amount) : 
                                    (record.net_amount as number) || 0;
                    
                    return (
                      <div key={record.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors">
                        {/* Header with main info */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                              <ArrowDownCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatAmount(record.amount)}
                                </span>
                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {formatShortDate(record.date)}
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs border", getStatusColor(record.status))}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(record.status)}
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </div>
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building2 className="h-4 w-4" />
                              <span className="font-medium">Bank Account</span>
                            </div>
                            <p className="text-gray-900 font-mono text-xs">
                              {maskBankAccount(user?.account_number)}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Banknote className="h-4 w-4" />
                              <span className="font-medium">Net Amount</span>
                            </div>
                            <p className="text-emerald-600 font-semibold">
                              {formatAmount(netAmount)}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Hash className="h-4 w-4" />
                              <span className="font-medium">Transaction ID</span>
                            </div>
                            <p className="text-gray-700 font-mono text-xs truncate">
                              {record.id}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Receipt className="h-4 w-4" />
                              <span className="font-medium">Processing Fee</span>
                            </div>
                            <p className="text-red-500 font-semibold">
                              {formatAmount(charges)}
                            </p>
                          </div>
                        </div>

                        {/* Full timestamp */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Timer className="h-3 w-3" />
                            <span>{formatDate(record.date)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowDownCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Withdrawals Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Your withdrawal history will appear here once you make your first withdrawal.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      <strong>Tip:</strong> You can withdraw your earnings anytime from the Withdraw page.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default WithdrawalRecordsPage;
