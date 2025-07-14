
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowDownCircle, IndianRupee, Receipt, Check, X, Clock, Wallet, Target } from "lucide-react";
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
        return "bg-emerald-100 text-emerald-700";
      case 'processing':
      case 'pending':
        return "bg-amber-100 text-amber-700";
      case 'rejected':
      case 'failed':
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <Check className="h-3 w-3" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'rejected':
      case 'failed':
        return <X className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <MobileLayout showBackButton title="Withdrawal History">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 space-y-4 pb-24">
          {/* Header Card */}
          <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <ArrowDownCircle className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <h1 className="text-lg font-bold">Withdrawals</h1>
                  <p className="text-emerald-100 text-xs">Track your withdrawal history</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Withdrawal Button */}
          <Link to="/withdraw">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm h-10">
              <ArrowDownCircle className="h-4 w-4 mr-2" />
              New Withdrawal
            </Button>
          </Link>
        
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, idx) => (
              <Card key={`skeleton-${idx}`} className="bg-white/90 backdrop-blur-sm border border-gray-200/50 animate-pulse">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : records.length > 0 ? (
            records.map((record) => {
              const charges = typeof record.charges === 'string' ? parseFloat(record.charges) : record.charges || 0;
              const amount = record.amount;
              const netAmount = typeof record.net_amount === 'string' ? parseFloat(record.net_amount) : 
                              (record.net_amount as number) || 0;
              
              return (
                <Card 
                  key={record.id}
                  className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Receipt className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-gray-700">{record.id}</span>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1",
                        getStatusStyles(record.status)
                      )}>
                        {getStatusIcon(record.status)}
                        <span>{record.status.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    {/* Amount */}
                    <div className="mb-3">
                      <div className="flex items-center">
                        <IndianRupee className="h-5 w-5 mr-2 text-emerald-600" />
                        <span className="text-2xl font-bold text-gray-900">{amount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Transaction Details */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 text-xs mb-1">
                          <Target className="w-3 h-3 mr-1" />
                          <span>Fee ({withdrawalFeePercentage}%)</span>
                        </div>
                        <p className="text-sm font-medium text-red-600">₹{charges.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 text-xs mb-1">
                          <Wallet className="w-3 h-3 mr-1" />
                          <span>Net Amount</span>
                        </div>
                        <p className="text-sm font-medium text-emerald-600">₹{netAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Footer Details */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <div>
                        <p className="mb-1">Bank Account</p>
                        <p>{maskValue(user?.account_number)}</p>
                      </div>
                      <div className="text-right">
                        <p className="mb-1">Date</p>
                        <p>{formatDate(record.date)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50">
              <CardContent className="p-8 text-center">
                <div className="bg-emerald-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Receipt className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Withdrawals Yet</h3>
                <p className="text-gray-600 mb-4 text-sm">Make your first withdrawal to see records here</p>
                <Link to="/withdraw">
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-sm">
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
