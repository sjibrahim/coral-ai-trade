
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowDownCircle, IndianRupee, Wallet } from "lucide-react";
import { getTransactions } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface WithdrawalRecord {
  id: string;
  amount: number;
  date: string;
  status: string;
  account: string;
  type: "inr" | "usdt";
}

const AllWithdrawalsPage = () => {
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inr");
  const { user } = useAuth(); 
  
  useEffect(() => {
    const fetchWithdrawalRecords = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

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
              type: tx.method === "USDT" ? "usdt" : "inr"
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
          
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWithdrawalRecords();
  }, []);
  
  const maskValue = (value: string | undefined, visibleCount: number = 5) => {
    if (!value) return "";
    return "***********" + value.slice(-visibleCount);
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

  const inrRecords = records.filter(record => record.type === "inr");
  const usdtRecords = records.filter(record => record.type === "usdt");

  return (
    <MobileLayout showBackButton title="Withdrawal Records">
      <div className="p-4 space-y-4 pb-20 animate-fade-in">
        {/* Tabs */}
        <Tabs defaultValue="inr" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="inr" className="flex items-center gap-1">
              <IndianRupee className="h-4 w-4" />
              INR Withdrawals
            </TabsTrigger>
            <TabsTrigger value="usdt" className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              USDT Withdrawals
            </TabsTrigger>
          </TabsList>
          
          {/* Create new withdrawal buttons */}
          <div className="mb-4">
            {activeTab === "inr" ? (
              <Link to="/withdraw">
                <Button className="w-full flex items-center gap-2">
                  <ArrowDownCircle className="h-4 w-4" />
                  New INR Withdrawal
                </Button>
              </Link>
            ) : (
              <Link to="/usdt-withdraw">
                <Button className="w-full flex items-center gap-2">
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
              Array(4).fill(0).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="bg-card rounded-xl p-5 border border-border/40 animate-pulse mb-4">
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
            ) : inrRecords.length > 0 ? (
              inrRecords.map((record) => (
                <div 
                  key={record.id}
                  className="bg-card rounded-xl p-5 border border-border/40 mb-3"
                >
                  <div className="flex justify-between mb-2">
                    <p className="text-lg font-medium">{record.id}</p>
                    <p className={cn(
                      "font-medium",
                      getStatusStyles(record.status)
                    )}>
                      {record.status.toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1 text-primary" />
                      <p className="text-2xl font-semibold">{record.amount}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-muted-foreground">
                    <div>
                      <p>Bank Account</p>
                      <p>{maskValue(user?.account_number)}</p>
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
                <p className="text-muted-foreground mb-4">No INR withdrawal records found</p>
                <Link to="/withdraw">
                  <Button>Create Your First INR Withdrawal</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          {/* USDT Withdrawals Content */}
          <TabsContent value="usdt">
            {isLoading ? (
              // Loading skeletons (same as INR)
              Array(4).fill(0).map((_, idx) => (
                <div key={`skeleton-usdt-${idx}`} className="bg-card rounded-xl p-5 border border-border/40 animate-pulse mb-4">
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
            ) : usdtRecords.length > 0 ? (
              usdtRecords.map((record) => (
                <div 
                  key={record.id}
                  className="bg-card rounded-xl p-5 border border-border/40 mb-3"
                >
                  <div className="flex justify-between mb-2">
                    <p className="text-lg font-medium">{record.id}</p>
                    <p className={cn(
                      "font-medium",
                      getStatusStyles(record.status)
                    )}>
                      {record.status.toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center">
                      <Wallet className="h-4 w-4 mr-1 text-amber-400" />
                      <p className="text-2xl font-semibold">{record.amount} USDT</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-muted-foreground">
                    <div>
                      <p>Wallet Address</p>
                      <p>{maskValue(user?.usdt_address)}</p>
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
                <p className="text-muted-foreground mb-4">No USDT withdrawal records found</p>
                <Link to="/usdt-withdraw">
                  <Button>Create Your First USDT Withdrawal</Button>
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
