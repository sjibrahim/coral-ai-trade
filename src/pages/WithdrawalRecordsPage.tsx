
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { ArrowDownCircle, IndianRupee, Calendar, TrendingDown, AlertCircle, CheckCircle, Clock, XCircle, Filter } from "lucide-react";
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
        return "text-green-600 bg-green-50 border-green-200";
      case 'processing':
      case 'pending':
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
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
    <MobileLayout showBackButton title="Withdrawal History">
      <div className="min-h-screen bg-gray-50 p-4 space-y-6">
        
        {/* Stats Overview */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-600" />
              Withdrawal Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Withdrawn</p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">
                    {totalWithdrawn.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-xl font-semibold">{records.length}</p>
              </div>
            </div>
            
            {/* Status breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{statusCounts.failed}</p>
                <p className="text-xs text-gray-600">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
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
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 w-32 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : records.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {records.map((record, index) => {
                  const charges = typeof record.charges === 'string' ? parseFloat(record.charges) : record.charges || 0;
                  const netAmount = typeof record.net_amount === 'string' ? parseFloat(record.net_amount) : 
                                  (record.net_amount as number) || 0;
                  
                  return (
                    <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <ArrowDownCircle className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">₹{record.amount.toLocaleString()}</p>
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
                            <div className="text-sm text-gray-500 space-y-1">
                              <p>{formatDate(record.date)}</p>
                              <p>To: {maskBankAccount(user?.account_number)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Net: ₹{netAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-red-500">
                            Fee: ₹{charges.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            ID: {record.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowDownCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Withdrawals Yet</h3>
                <p className="text-gray-500">
                  Your withdrawal history will appear here once you make your first withdrawal.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default WithdrawalRecordsPage;
