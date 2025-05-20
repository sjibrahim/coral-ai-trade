
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowDownCircle, IndianRupee, Wallet, Receipt, Check, X, Clock } from "lucide-react";
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
  type: "inr" | "usdt";
  method?: string;
  charges?: string | number;
  net_amount?: string | number;
}

interface GeneralSettings {
  usdt_price: string;
  withdrawal_fee: string;
}

const AllWithdrawalsPage = () => {
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inr");
  const [usdtPrice, setUsdtPrice] = useState(83);
  const [withdrawalFeePercentage, setWithdrawalFeePercentage] = useState(2);
  const { user } = useAuth(); 
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        // Fetch general settings for USDT price
        const settingsResponse = await getGeneralSettings(token);
        if (settingsResponse.status && settingsResponse.data) {
          setUsdtPrice(parseFloat(settingsResponse.data.usdt_price) || 83);
          setWithdrawalFeePercentage(parseFloat(settingsResponse.data.withdrawal_fee) || 2);
        }

        // Fetch withdrawal transactions
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
              // Determine the type based on the method field
              type: tx.method === "USDT" ? "usdt" : "inr",
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

  // Convert INR to USD based on USDT price
  const convertToUSD = (amountInr: number) => {
    return (amountInr / usdtPrice).toFixed(2);
  };

  const inrRecords = records.filter(record => record.type === "inr" || record.method === "BANK");
  const usdtRecords = records.filter(record => record.type === "usdt" || record.method === "USDT");

  const WithdrawalCard = ({ record, isUsdt = false }: { record: WithdrawalRecord, isUsdt?: boolean }) => {
    // Fix the type conversion issues by ensuring proper number types before calculations
    const charges = typeof record.charges === 'string' ? parseFloat(record.charges) : record.charges || 0;
    const amount = record.amount;
    const netAmount = typeof record.net_amount === 'string' ? parseFloat(record.net_amount) : 
                     (record.net_amount as number) || 0;
    
    return (
      <Card className="mb-4 bg-gradient-to-br from-[#1c1e29] to-[#151722] border-[#2a2d3a] overflow-hidden">
        <CardContent className="p-0">
          {/* Header with ID and Status */}
          <div className="flex items-center justify-between p-4 border-b border-[#2a2d3a]">
            <div className="flex items-center space-x-2">
              <Receipt className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-200">{record.id}</span>
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
                    <Wallet className="h-5 w-5 mr-2 text-amber-400" />
                    <span className="text-2xl font-bold text-white">${convertToUSD(amount)}</span>
                  </div>
                  <span className="text-xs text-gray-400">₹{amount.toLocaleString()} (INR)</span>
                </>
              ) : (
                <div className="flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{amount.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {/* Transaction Details Card */}
            <div className="rounded-lg bg-[#14161f] p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Transaction Details</h4>
              
              {/* Fee and Net Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-[#1c1e29] p-3">
                  <p className="text-xs text-gray-500 mb-1">Fee ({withdrawalFeePercentage}%)</p>
                  {isUsdt ? (
                    <div>
                      <p className="text-sm font-medium text-red-400">
                        ${(charges / usdtPrice).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ₹{charges.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-red-400">
                      ₹{charges.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="rounded-md bg-[#1c1e29] p-3">
                  <p className="text-xs text-gray-500 mb-1">Net Amount</p>
                  {isUsdt ? (
                    <div>
                      <p className="text-sm font-medium text-green-400">
                        ${(netAmount / usdtPrice).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ₹{netAmount.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-green-400">
                      ₹{netAmount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer Details */}
            <div className="flex justify-between text-xs text-gray-400">
              <div>
                <p className="mb-1">
                  {isUsdt ? "Wallet" : "Bank Account"}
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
  };

  return (
    <MobileLayout showBackButton title="Withdrawal Records">
      <div className="p-4 space-y-4 pb-20 animate-fade-in">
        {/* Tabs */}
        <Tabs defaultValue="inr" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4 bg-[#1c1e29]">
            <TabsTrigger value="inr" className="flex items-center gap-1 data-[state=active]:bg-blue-500">
              <IndianRupee className="h-4 w-4" />
              INR Withdrawals
            </TabsTrigger>
            <TabsTrigger value="usdt" className="flex items-center gap-1 data-[state=active]:bg-amber-500">
              <Wallet className="h-4 w-4" />
              USDT Withdrawals
            </TabsTrigger>
          </TabsList>
          
          {/* Create new withdrawal buttons */}
          <div className="mb-4">
            {activeTab === "inr" ? (
              <Link to="/withdraw">
                <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500">
                  <ArrowDownCircle className="h-4 w-4" />
                  New INR Withdrawal
                </Button>
              </Link>
            ) : (
              <Link to="/usdt-withdraw">
                <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500">
                  <ArrowDownCircle className="h-4 w-4" />
                  New USDT Withdrawal
                </Button>
              </Link>
            )}
          </div>
          
          {/* INR Withdrawals Content */}
          <TabsContent value="inr">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, idx) => (
                <Card key={`skeleton-${idx}`} className="mb-4 bg-[#1c1e29] border-[#2a2d3a] overflow-hidden animate-pulse">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-[#2a2d3a] flex justify-between">
                      <div className="h-5 w-24 bg-[#252836] rounded"></div>
                      <div className="h-5 w-20 bg-[#252836] rounded"></div>
                    </div>
                    <div className="p-4">
                      <div className="h-8 w-32 bg-[#252836] rounded mb-4"></div>
                      <div className="bg-[#14161f] p-4 mb-4 rounded-lg">
                        <div className="h-4 w-28 bg-[#252836] rounded mb-3"></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#252836] h-16 rounded-md"></div>
                          <div className="bg-[#252836] h-16 rounded-md"></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="h-3 w-20 bg-[#252836] rounded mb-1"></div>
                          <div className="h-3 w-24 bg-[#252836] rounded"></div>
                        </div>
                        <div>
                          <div className="h-3 w-10 bg-[#252836] rounded mb-1"></div>
                          <div className="h-3 w-20 bg-[#252836] rounded"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : inrRecords.length > 0 ? (
              inrRecords.map((record) => (
                <WithdrawalCard key={record.id} record={record} />
              ))
            ) : (
              <div className="bg-[#1c1e29] rounded-xl p-8 border border-[#2a2d3a] text-center">
                <div className="bg-blue-500/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Receipt className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Withdrawals Yet</h3>
                <p className="text-gray-400 mb-4">Make your first INR withdrawal to see records here</p>
                <Link to="/withdraw">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-500">
                    Create Your First INR Withdrawal
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          {/* USDT Withdrawals Content */}
          <TabsContent value="usdt">
            {isLoading ? (
              // Loading skeletons (same as INR)
              Array(3).fill(0).map((_, idx) => (
                <Card key={`skeleton-${idx}`} className="mb-4 bg-[#1c1e29] border-[#2a2d3a] overflow-hidden animate-pulse">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-[#2a2d3a] flex justify-between">
                      <div className="h-5 w-24 bg-[#252836] rounded"></div>
                      <div className="h-5 w-20 bg-[#252836] rounded"></div>
                    </div>
                    <div className="p-4">
                      <div className="h-8 w-32 bg-[#252836] rounded mb-4"></div>
                      <div className="bg-[#14161f] p-4 mb-4 rounded-lg">
                        <div className="h-4 w-28 bg-[#252836] rounded mb-3"></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#252836] h-16 rounded-md"></div>
                          <div className="bg-[#252836] h-16 rounded-md"></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="h-3 w-20 bg-[#252836] rounded mb-1"></div>
                          <div className="h-3 w-24 bg-[#252836] rounded"></div>
                        </div>
                        <div>
                          <div className="h-3 w-10 bg-[#252836] rounded mb-1"></div>
                          <div className="h-3 w-20 bg-[#252836] rounded"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : usdtRecords.length > 0 ? (
              usdtRecords.map((record) => (
                <WithdrawalCard key={record.id} record={record} isUsdt={true} />
              ))
            ) : (
              <div className="bg-[#1c1e29] rounded-xl p-8 border border-[#2a2d3a] text-center">
                <div className="bg-amber-500/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No USDT Withdrawals</h3>
                <p className="text-gray-400 mb-4">Make your first USDT withdrawal to see records here</p>
                <Link to="/usdt-withdraw">
                  <Button className="bg-gradient-to-r from-amber-600 to-amber-500">
                    Create Your First USDT Withdrawal
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default AllWithdrawalsPage;
