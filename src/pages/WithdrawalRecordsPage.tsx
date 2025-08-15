
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { 
  ArrowDownCircle, 
  IndianRupee, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye,
  EyeOff,
  Building2,
  Hash,
  Timer,
  Banknote,
  Receipt
} from "lucide-react";
import { getTransactions, getGeneralSettings } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
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
        return "text-emerald-400 bg-emerald-950/50 border-emerald-800";
      case 'processing':
      case 'pending':
        return "text-amber-400 bg-amber-950/50 border-amber-800";
      case 'rejected':
      case 'failed':
        return "text-red-400 bg-red-950/50 border-red-800";
      default:
        return "text-gray-400 bg-gray-800 border-gray-700";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-3 w-3" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
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
        month: 'short'
      }) + " at " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        
        {/* Compact Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <ArrowDownCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">Withdrawals</h1>
                  <p className="text-xs text-gray-400">{records.length} records</p>
                </div>
              </div>
              <button 
                onClick={() => setHideAmounts(!hideAmounts)}
                className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                {hideAmounts ? <EyeOff className="h-4 w-4 text-gray-300" /> : <Eye className="h-4 w-4 text-gray-300" />}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-950/50 border border-emerald-800/30 rounded-lg p-3">
                <p className="text-xs text-emerald-300 mb-1">Total Withdrawn</p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4 text-emerald-400" />
                  <span className="text-lg font-bold text-emerald-300">
                    {formatAmount(totalWithdrawn)}
                  </span>
                </div>
              </div>
              <div className="bg-blue-950/50 border border-blue-800/30 rounded-lg p-3">
                <p className="text-xs text-blue-300 mb-1">Success Rate</p>
                <p className="text-lg font-bold text-blue-300">
                  {records.length > 0 ? Math.round((statusCounts.completed / records.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Status Overview */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-emerald-950/50 border border-emerald-800/30 rounded-lg">
              <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center mx-auto mb-1">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
              <p className="text-lg font-bold text-emerald-400">{statusCounts.completed}</p>
              <p className="text-xs text-emerald-300">Success</p>
            </div>
            <div className="text-center p-3 bg-amber-950/50 border border-amber-800/30 rounded-lg">
              <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center mx-auto mb-1">
                <Clock className="h-3 w-3 text-white" />
              </div>
              <p className="text-lg font-bold text-amber-400">{statusCounts.pending}</p>
              <p className="text-xs text-amber-300">Pending</p>
            </div>
            <div className="text-center p-3 bg-red-950/50 border border-red-800/30 rounded-lg">
              <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center mx-auto mb-1">
                <XCircle className="h-3 w-3 text-white" />
              </div>
              <p className="text-lg font-bold text-red-400">{statusCounts.failed}</p>
              <p className="text-xs text-red-300">Failed</p>
            </div>
          </div>

          {/* Transactions List */}
          {isLoading ? (
            <div className="space-y-3">
              {Array(4).fill(0).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="animate-pulse">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-20 bg-gray-700 rounded"></div>
                          <div className="h-3 w-16 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="h-5 w-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-3 w-16 bg-gray-700 rounded"></div>
                      <div className="h-3 w-20 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : records.length > 0 ? (
            <div className="space-y-3 pb-4">
              {records.map((record) => {
                const charges = typeof record.charges === 'string' ? parseFloat(record.charges) : record.charges || 0;
                const netAmount = typeof record.net_amount === 'string' ? parseFloat(record.net_amount) : 
                                (record.net_amount as number) || 0;
                
                return (
                  <div key={record.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/30 hover:bg-gray-700/50 transition-all duration-200">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                            <ArrowDownCircle className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-white">
                                {formatAmount(record.amount)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Timer className="h-3 w-3" />
                              <span>{formatDate(record.date)}</span>
                            </div>
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

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <Building2 className="h-3 w-3" />
                            <span>Bank Account</span>
                          </div>
                          <p className="text-gray-300 font-mono">
                            {maskBankAccount(user?.account_number)}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <Banknote className="h-3 w-3" />
                            <span>Net Amount</span>
                          </div>
                          <p className="text-emerald-400 font-semibold">
                            {formatAmount(netAmount)}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <Hash className="h-3 w-3" />
                            <span>Transaction ID</span>
                          </div>
                          <p className="text-gray-300 font-mono truncate">
                            {record.id}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <Receipt className="h-3 w-3" />
                            <span>Fee ({withdrawalFeePercentage}%)</span>
                          </div>
                          <p className="text-red-400 font-semibold">
                            {formatAmount(charges)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowDownCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Withdrawals Yet</h3>
              <p className="text-gray-400 text-sm mb-4">
                Your withdrawal history will appear here once you make your first withdrawal.
              </p>
              <div className="bg-blue-950/50 border border-blue-800/30 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  <strong>Tip:</strong> You can withdraw your earnings anytime from the Withdraw page.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default WithdrawalRecordsPage;
