import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, IndianRupee, Wallet, Clock, Check, X, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { getTransactions, getGeneralSettings } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

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
  const [usdtPrice, setUsdtPrice] = useState(83); 
  const [withdrawalFeePercentage, setWithdrawalFeePercentage] = useState(2);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        // Fetch USDT price from general settings
        const settingsResponse = await getGeneralSettings(token);
        if (settingsResponse.status && settingsResponse.data) {
          setUsdtPrice(parseFloat(settingsResponse.data.usdt_price) || 83);
          setWithdrawalFeePercentage(parseFloat(settingsResponse.data.withdrawal_fee) || 2);
        }

        const response = await getTransactions(token);
        
        if (response.status && Array.isArray(response.data)) {
          // Filter withdrawal transactions using the new format
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
  
  const convertToUSD = (amountInr: number) => {
    return (amountInr / usdtPrice).toFixed(2);
  };
  
  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'processing':
      case 'pending':
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case 'rejected':
      case 'failed':
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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

  const maskValue = (value: string | undefined, visibleCount: number = 5) => {
    if (!value) return "";
    return "***********" + value.slice(-visibleCount);
  };

  const isUsdtWithdrawal = (record: WithdrawalRecord) => {
    return record.type === "USDT" || record.method === "USDT";
  };

  return (
    <MobileLayout showBackButton hideNavbar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
        <div className="px-3 py-4">
          {/* Hero Header */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 p-6 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-white/10 transform -translate-x-4 translate-y-4"></div>
            
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center mb-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <ArrowDownCircle className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold">Withdrawal Records</h1>
              </div>
              <p className="text-red-100 text-sm">Track your withdrawal history</p>
            </div>
          </div>

          {/* Create new withdrawal button */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <Link to="/withdraw">
              <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                <ArrowDownCircle className="h-4 w-4" />
                INR Withdrawal
              </Button>
            </Link>
            <Link to="/usdt-withdraw">
              <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600">
                <Wallet className="h-4 w-4" />
                USDT Withdrawal
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, idx) => (
              <Card key={`skeleton-${idx}`} className="mb-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden animate-pulse">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-gray-100 flex justify-between">
                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="p-4">
                    <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="bg-gray-50 p-4 mb-4 rounded-lg">
                      <div className="h-4 w-28 bg-gray-200 rounded mb-3"></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-200 h-16 rounded-md"></div>
                        <div className="bg-gray-200 h-16 rounded-md"></div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      </div>
                      <div>
                        <div className="h-3 w-10 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : records.length > 0 ? (
            records.map((record) => {
              const isUsdt = isUsdtWithdrawal(record);
              // Fix type conversions by ensuring proper number types
              const charges = typeof record.charges === 'string' ? parseFloat(record.charges) : record.charges || 0;
              const amount = record.amount;
              const netAmount = typeof record.net_amount === 'string' ? parseFloat(record.net_amount) : 
                              (record.net_amount as number) || 0;
              
              return (
                <Card 
                  key={record.id}
                  className="mb-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Header with ID and Status */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        <Receipt className="h-4 w-4 text-red-400" />
                        <span className="text-sm font-medium text-gray-700">{record.id}</span>
                        {isUsdt && 
                          <span className="px-1.5 py-0.5 bg-amber-100 rounded-full text-xs text-amber-700">
                            USDT
                          </span>
                        }
                      </div>
                      <div className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1",
                        getStatusStyles(record.status)
                      )}>
                        {getStatusIcon(record.status)}
                        <span>{record.status.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="p-4">
                      {/* Amount Section */}
                      <div className="mb-4">
                        {isUsdt ? (
                          <>
                            <div className="flex items-center mb-1">
                              <Wallet className="h-5 w-5 mr-2 text-amber-500" />
                              <span className="text-2xl font-bold text-gray-800">${convertToUSD(amount)}</span>
                            </div>
                            <span className="text-xs text-gray-500">₹{amount.toLocaleString()} (INR)</span>
                          </>
                        ) : (
                          <div className="flex items-center">
                            <IndianRupee className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="text-2xl font-bold text-gray-800">{amount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Transaction Details Card */}
                      <div className="rounded-lg bg-gray-50 p-4 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Transaction Details</h4>
                        
                        {/* Fee and Net Amount */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-md bg-white p-3">
                            <p className="text-xs text-gray-500 mb-1">Fee ({withdrawalFeePercentage}%)</p>
                            {isUsdt ? (
                              <div>
                                <p className="text-sm font-medium text-red-500">
                                  ${(charges / usdtPrice).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  ₹{charges.toLocaleString()}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm font-medium text-red-500">
                                ₹{charges.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="rounded-md bg-white p-3">
                            <p className="text-xs text-gray-500 mb-1">Net Amount</p>
                            {isUsdt ? (
                              <div>
                                <p className="text-sm font-medium text-emerald-600">
                                  ${(netAmount / usdtPrice).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  ₹{netAmount.toLocaleString()}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm font-medium text-emerald-600">
                                ₹{netAmount.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Footer Details */}
                      <div className="flex justify-between text-xs text-gray-500">
                        <div>
                          <p className="mb-1">
                            {isUsdt ? "Wallet Address" : "Bank Account"}
                          </p>
                          <p>
                            {isUsdt 
                              ? maskValue(user?.usdt_address)
                              : maskValue(user?.account_number)
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="mb-1">Date</p>
                          <p>{formatDate(record.date)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border-0 shadow-sm text-center mt-8">
              <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Receipt className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Withdrawals Yet</h3>
              <p className="text-gray-600 mb-4">Make your first withdrawal to see records here</p>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/withdraw">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">INR Withdrawal</Button>
                </Link>
                <Link to="/usdt-withdraw">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">USDT Withdrawal</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default WithdrawalRecordsPage;
