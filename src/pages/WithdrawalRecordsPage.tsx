
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getTransactions } from "@/services/api";

interface WithdrawalRecord {
  id: string;
  amount: number;
  date: string;
  status: string;
  account: string;
  transaction_id?: string;
  created_at?: string;
}

const WithdrawalRecordsPage = () => {
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawalRecords = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await getTransactions(token);
        
        if (response.status && Array.isArray(response.data)) {
          // Filter withdrawal transactions
          const withdrawals = response.data
            .filter((tx: any) => tx.type === "withdraw")
            .map((tx: any) => ({
              id: tx.id || `WD${Math.floor(Math.random() * 10000)}`,
              amount: parseFloat(tx.amount || 0),
              date: tx.created_at || new Date().toISOString().split('T')[0],
              status: tx.status || "processing",
              account: tx.bank_number || "******6413",
              transaction_id: tx.transaction_id || "",
              created_at: tx.created_at || ""
            }));
          
          setRecords(withdrawals);
        }
      } catch (error) {
        console.error("Error fetching withdrawal records:", error);
        // Use sample data as fallback
        setRecords([
          { id: 'WD78901', amount: 800, date: '2023-05-03', status: 'completed', account: '******6413' },
          { id: 'WD78902', amount: 1200, date: '2023-04-29', status: 'processing', account: '******6413' },
          { id: 'WD78903', amount: 500, date: '2023-04-25', status: 'completed', account: '******6413' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWithdrawalRecords();
  }, []);
  
  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return "text-market-increase";
      case 'processing':
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

  return (
    <MobileLayout showBackButton title="Withdrawal Records">
      <div className="p-4 space-y-4 pb-20 animate-fade-in">
        {/* Create new withdrawal button */}
        <div className="mb-4">
          <Link to="/withdraw">
            <Button className="w-full flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4" />
              Create New Withdrawal
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
                <p className="text-lg font-medium">{record.id}</p>
                <p className={cn(
                  "font-medium",
                  getStatusStyles(record.status)
                )}>
                  {record.status.toUpperCase()}
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-2xl font-semibold">₹{record.amount}</p>
              </div>
              
              <div className="flex justify-between text-muted-foreground">
                <div>
                  <p>Bank Account</p>
                  <p>{record.account}</p>
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
