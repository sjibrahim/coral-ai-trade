
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowDownCircle, IndianRupee, Receipt, Check, X, Clock, Wallet, Target, Plus } from "lucide-react";
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

  return (
    <MobileLayout showBackButton title="Withdrawal History">
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 space-y-6 pb-24">
          {/* Header Card */}
          <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <ArrowDownCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <h1 className="text-lg font-bold">Withdrawals</h1>
                  <p className="text-emerald-100 text-sm">Track your withdrawal history</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Withdrawal Button */}
          <Link to="/withdraw">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white h-12 text-base shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              New Withdrawal
            </Button>
          </Link>
        
          {isLoading ? (
            // Loading skeletons
            <div className="space-y-4">
              {Array(3).fill(0).map((_, idx) => (
                <Card key={`skeleton-${idx}`} className="bg-white shadow-sm animate-pulse">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
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
                    className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Receipt className="h-5 w-5 text-emerald-600" />
                          <span className="text-base font-medium text-gray-700">{record.id}</span>
                        </div>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1",
                          getStatusStyles(record.status)
                        )}>
                          {getStatusIcon(record.status)}
                          <span>{record.status.toUpperCase()}</span>
                        </div>
                      </div>
                      
                      {/* Amount */}
                      <div className="mb-4">
                        <div className="flex items-center">
                          <IndianRupee className="h-6 w-6 mr-2 text-emerald-600" />
                          <span className="text-2xl font-bold text-gray-900">{amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Transaction Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center text-gray-600 text-sm mb-1">
                            <Target className="w-4 h-4 mr-1" />
                            <span>Fee ({withdrawalFeePercentage}%)</span>
                          </div>
                          <p className="text-base font-medium text-red-600">₹{charges.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center text-gray-600 text-sm mb-1">
                            <Wallet className="w-4 h-4 mr-1" />
                            <span>Net Amount</span>
                          </div>
                          <p className="text-base font-medium text-emerald-600">₹{netAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {/* Footer Details */}
                      <div className="flex justify-between text-sm text-gray-500">
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
              })}
            </div>
          ) : (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="bg-emerald-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Receipt className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Withdrawals Yet</h3>
                <p className="text-gray-600 mb-6 text-base">Make your first withdrawal to see records here</p>
                <Link to="/withdraw">
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-base px-8">
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
