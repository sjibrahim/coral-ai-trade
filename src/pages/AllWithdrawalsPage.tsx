
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowDownCircle, IndianRupee, Receipt, Check, X, Clock, Wallet, Target, TrendingDown, Plus } from "lucide-react";
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
        return "bg-green-50 text-green-700 border-green-200";
      case 'processing':
      case 'pending':
        return "bg-amber-50 text-amber-700 border-amber-200";
      case 'rejected':
      case 'failed':
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
      case 'failed':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const totalWithdrawals = records.reduce((sum, record) => sum + record.amount, 0);
  const completedWithdrawals = records.filter(r => r.status.toLowerCase() === 'completed').length;

  return (
    <MobileLayout showBackButton title="Withdrawal History">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30">
        <div className="p-4 space-y-4 pb-20">
          {/* Header Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardContent className="p-4 text-center">
                <TrendingDown className="h-8 w-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">₹{totalWithdrawals.toLocaleString()}</p>
                <p className="text-sm opacity-90">Total Withdrawn</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardContent className="p-4 text-center">
                <Receipt className="h-8 w-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{completedWithdrawals}</p>
                <p className="text-sm opacity-90">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* New Withdrawal Button */}
          <Link to="/withdraw">
            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-12 text-lg font-semibold shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              New Withdrawal
            </Button>
          </Link>
        
          {/* Withdrawals List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => {
                const charges = typeof record.charges === 'string' ? parseFloat(record.charges) : record.charges || 0;
                const amount = record.amount;
                const netAmount = typeof record.net_amount === 'string' ? parseFloat(record.net_amount) : 
                                (record.net_amount as number) || 0;
                
                return (
                  <Card 
                    key={record.id}
                    className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <ArrowDownCircle className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Withdrawal</p>
                            <p className="text-sm text-gray-500">#{record.id}</p>
                          </div>
                        </div>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 border",
                          getStatusStyles(record.status)
                        )}>
                          {getStatusIcon(record.status)}
                          <span>{record.status.toUpperCase()}</span>
                        </div>
                      </div>
                      
                      {/* Amount */}
                      <div className="mb-4">
                        <div className="flex items-center">
                          <IndianRupee className="h-6 w-6 mr-2 text-blue-600" />
                          <span className="text-3xl font-bold text-gray-900">₹{amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Transaction Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                          <div className="flex items-center text-red-600 mb-1">
                            <Target className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Fee ({withdrawalFeePercentage}%)</span>
                          </div>
                          <p className="text-lg font-bold text-red-700">₹{charges.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                          <div className="flex items-center text-green-600 mb-1">
                            <Wallet className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Net Amount</span>
                          </div>
                          <p className="text-lg font-bold text-green-700">₹{netAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {/* Footer Details */}
                      <div className="flex justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                        <div>
                          <p className="font-medium mb-1">Bank Account</p>
                          <p>{maskValue(user?.account_number)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium mb-1">Date</p>
                          <p>{formatDate(record.date)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Receipt className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Withdrawals Yet</h3>
                <p className="text-gray-500 mb-4">Make your first withdrawal to see records here</p>
                <Link to="/withdraw">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    Start Withdrawal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default AllWithdrawalsPage;
