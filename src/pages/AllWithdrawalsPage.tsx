
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight, IndianRupee, Plus, CheckCircle, XCircle, Clock, CreditCard, Banknote, Target, Wallet } from "lucide-react";
import { getTransactions, getGeneralSettings } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

interface WithdrawalRecord {
  id: string;
  amount: number;
  date: string;
  status: string;
  account: string;
  type: "inr";
  method?: string;
  charges?: string | number;
  net_amount?: string | number;
}

const AllWithdrawalsPage = () => {
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawalFeePercentage, setWithdrawalFeePercentage] = useState(2);
  const { user } = useAuth(); 
  const { toast } = useToast();
  
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

        // Fetch withdrawal transactions
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
              type: "inr",
              method: tx.method || "BANK",
              charges: tx.charges || "10",
              net_amount: tx.net_amount || tx.amount
            }));
          
          setRecords(withdrawals);
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
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const maskValue = (value: string | undefined, visibleCount: number = 5) => {
    if (!value) return "";
    return "***********" + value.slice(-visibleCount);
  };
  
  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return "bg-green-100 text-green-700 border-green-200";
      case 'processing':
      case 'pending':
        return "bg-amber-100 text-amber-700 border-amber-200";
      case 'rejected':
      case 'failed':
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MobileLayout showBackButton title="Withdrawals">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header Section */}
        <div className="bg-white border-b border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-purple-800">Withdrawal History</h1>
                <p className="text-purple-600 mt-1">Manage your withdrawal requests</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ArrowUpRight className="h-6 w-6 text-purple-600" />
              </div>
            </div>

            {/* New Withdrawal Button */}
            <Link to="/withdraw">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14 text-lg font-semibold rounded-xl shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Create New Withdrawal
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="bg-white rounded-2xl p-6 animate-pulse border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-purple-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-purple-200 rounded"></div>
                        <div className="h-3 w-16 bg-purple-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-6 w-20 bg-purple-200 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 w-32 bg-purple-200 rounded"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-purple-200 rounded-lg"></div>
                      <div className="h-16 bg-purple-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : records.length > 0 ? (
            <div className="space-y-4 pb-6">
              {records.map((record) => {
                const charges = typeof record.charges === 'string' ? parseFloat(record.charges) : record.charges || 0;
                const amount = record.amount;
                const netAmount = typeof record.net_amount === 'string' ? parseFloat(record.net_amount) : 
                                (record.net_amount as number) || 0;
                
                return (
                  <div 
                    key={record.id}
                    className="bg-white rounded-2xl border border-purple-200 shadow-sm hover:shadow-lg transition-all duration-200"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-purple-100 rounded-full">
                            <Banknote className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-lg">{record.id}</h3>
                            <p className="text-slate-500 text-sm">Bank Transfer</p>
                          </div>
                        </div>
                        <div className={cn(
                          "px-3 py-2 rounded-full border text-sm font-medium flex items-center space-x-2",
                          getStatusStyles(record.status)
                        )}>
                          {getStatusIcon(record.status)}
                          <span>{record.status.toUpperCase()}</span>
                        </div>
                      </div>
                      
                      {/* Amount Display */}
                      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <div className="flex items-center justify-center">
                          <IndianRupee className="h-8 w-8 mr-2 text-purple-600" />
                          <span className="text-3xl font-bold text-purple-800">{amount.toLocaleString()}</span>
                        </div>
                        <p className="text-center text-purple-600 mt-1 text-sm">Withdrawal Amount</p>
                      </div>
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                          <div className="flex items-center text-red-600 text-sm mb-2">
                            <Target className="w-4 h-4 mr-2" />
                            <span>Processing Fee</span>
                          </div>
                          <p className="text-lg font-bold text-red-600">₹{charges.toLocaleString()}</p>
                          <p className="text-xs text-red-500 mt-1">{withdrawalFeePercentage}% of amount</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                          <div className="flex items-center text-green-600 text-sm mb-2">
                            <Wallet className="w-4 h-4 mr-2" />
                            <span>Net Amount</span>
                          </div>
                          <p className="text-lg font-bold text-green-600">₹{netAmount.toLocaleString()}</p>
                          <p className="text-xs text-green-500 mt-1">Final received</p>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-slate-600 mb-1">Bank Account</p>
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-slate-400" />
                              <p className="text-sm font-mono text-slate-700">{maskValue(user?.account_number)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-600 mb-1">Date & Time</p>
                            <p className="text-sm text-slate-700">{formatDate(record.date)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-purple-200">
              <div className="bg-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Banknote className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">No Withdrawals Yet</h3>
              <p className="text-slate-600 mb-8 text-lg">Start your first withdrawal to see records here</p>
              <Link to="/withdraw">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-3 rounded-xl">
                  Create Withdrawal
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default AllWithdrawalsPage;
