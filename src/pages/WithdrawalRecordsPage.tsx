
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, Wallet, ArrowDown, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { getTransactions, getGeneralSettings } from "@/services/api";
import { toast } from "@/hooks/use-toast";

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
  const [usdtPrice, setUsdtPrice] = useState(83); // Default USDT price

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        // Fetch USDT price from general settings
        const settingsResponse = await getGeneralSettings(token);
        if (settingsResponse.status && settingsResponse.data) {
          setUsdtPrice(parseFloat(settingsResponse.data.usdt_price) || 83);
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
        
        // Use sample data as fallback
        setRecords([
          { 
            id: 'WD78901', 
            amount: 800, 
            date: '2023-05-03', 
            status: 'completed', 
            account: '******6413',
            charges: 10,
            net_amount: 790
          },
          { 
            id: 'WD78902', 
            amount: 1200, 
            date: '2023-04-29', 
            status: 'processing', 
            account: '******6413',
            charges: 10,
            net_amount: 1190
          },
          { 
            id: 'WD78903', 
            amount: 500, 
            date: '2023-04-25', 
            status: 'completed', 
            account: '******6413',
            charges: 10,
            net_amount: 490
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Convert INR to USD based on USDT price
  const convertToUSD = (amountInr: number) => {
    return (amountInr / usdtPrice).toFixed(2);
  };
  
  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return "text-market-increase";
      case 'processing':
      case 'pending':
        return "text-amber-500";
      case 'rejected':
      case 'failed':
        return "text-market-decrease";
      default:
        return "text-muted-foreground";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
  };

  const isUsdtWithdrawal = (record: WithdrawalRecord) => {
    return record.type === "USDT" || record.method === "USDT";
  };

  return (
    <MobileLayout showBackButton title="Withdrawal Records">
      <div className="p-4 space-y-4 pb-20 animate-fade-in">
        {/* Create new withdrawal button */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <Link to="/withdraw">
            <Button className="w-full flex items-center gap-2" variant="secondary">
              <ArrowDownCircle className="h-4 w-4" />
              INR Withdrawal
            </Button>
          </Link>
          <Link to="/usdt-withdraw">
            <Button className="w-full flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              USDT Withdrawal
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          // Loading skeletons
          Array(4).fill(0).map((_, idx) => (
            <div key={`skeleton-${idx}`} className="bg-card rounded-xl p-5 border border-border/40 animate-pulse">
              <div className="flex justify-between mb-2">
                <div className="h-5 w-24 bg-secondary/40 rounded"></div>
                <div className="h-5 w-20 bg-secondary/40 rounded"></div>
              </div>
              <div className="mb-4">
                <div className="h-7 w-32 bg-secondary/40 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="h-4 w-16 bg-secondary/40 rounded mb-1"></div>
                  <div className="h-4 w-24 bg-secondary/40 rounded"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-12 bg-secondary/40 rounded mb-1"></div>
                  <div className="h-4 w-20 bg-secondary/40 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : records.length > 0 ? (
          records.map((record) => (
            <div 
              key={record.id}
              className="bg-card rounded-xl p-5 border border-border/40"
            >
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <p className="text-lg font-medium">{record.id}</p>
                  {isUsdtWithdrawal(record) && 
                    <span className="ml-2 px-2 py-0.5 bg-amber-900/30 rounded-full text-xs text-amber-400">
                      USDT
                    </span>
                  }
                </div>
                <p className={cn(
                  "font-medium",
                  getStatusStyles(record.status)
                )}>
                  {record.status.toUpperCase()}
                </p>
              </div>
              
              <div className="mb-3">
                {isUsdtWithdrawal(record) ? (
                  <div className="flex flex-col">
                    <p className="text-2xl font-semibold flex items-center">
                      <Wallet className="h-4 w-4 mr-1 text-amber-400" />
                      ${convertToUSD(record.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">₹{record.amount} (INR)</p>
                  </div>
                ) : (
                  <p className="text-2xl font-semibold">₹{record.amount}</p>
                )}
              </div>
              
              {/* Fee and Net Amount section */}
              <div className="bg-[#1a1c25] rounded-lg p-3 mb-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Fee</span>
                  <span className="text-red-400">₹{record.charges}</span>
                </div>
                <div className="my-1 border-b border-gray-700"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Net Amount</span>
                  <span className="text-green-400">₹{record.net_amount}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-muted-foreground">
                <div>
                  <p>Payment Method</p>
                  <p>{isUsdtWithdrawal(record) ? "USDT Wallet" : "Bank Account"}</p>
                </div>
                <div className="text-right">
                  <p>Date</p>
                  <p>{formatDate(record.date)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card rounded-xl p-8 border border-border/40 text-center">
            <p className="text-muted-foreground mb-4">No withdrawal records found</p>
            <Link to="/withdraw">
              <Button>Create Your First Withdrawal</Button>
            </Link>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default WithdrawalRecordsPage;
