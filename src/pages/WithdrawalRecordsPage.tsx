import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, AlertTriangle, Loader2, Calendar, Filter, X, Clock } from "lucide-react";
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

const WithdrawalRecordsPage = () => {
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
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

  const filteredRecords = records.filter(record => {
    const statusMatch = statusFilter === "all" || record.status.toLowerCase() === statusFilter.toLowerCase();
    return statusMatch;
  });

  const getStatusStyles = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch(normalizedStatus) {
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
    const normalizedStatus = status.toLowerCase();
    switch(normalizedStatus) {
      case 'completed':
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'processing':
      case 'pending':
        return <Loader2 className="h-4 w-4" />;
      case 'rejected':
      case 'failed':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDisplayStatus = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch(normalizedStatus) {
      case 'pending':
        return 'PROCESSING';
      case 'completed':
      case 'success':
        return 'SUCCESSFUL';
      case 'processing':
        return 'PROCESSING';
      case 'failed':
      case 'rejected':
        return 'FAILED';
      default:
        return status.toUpperCase();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getStatusFilterLabel = () => {
    switch (statusFilter) {
      case 'pending':
        return 'Processing';
      case 'processing':
        return 'Processing';
      case 'completed':
      case 'success':
        return 'Successful';
      case 'failed':
        return 'Failed';
      default:
        return 'Filter';
    }
  };

  const FilterDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white h-8"
        >
          <Filter className="h-4 w-4 mr-1" />
          {getStatusFilterLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white z-50">
        <DropdownMenuItem 
          onClick={() => setStatusFilter("all")}
          className="hover:bg-gray-700 focus:bg-gray-700"
        >
          All Status
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter("pending")}
          className="hover:bg-gray-700 focus:bg-gray-700"
        >
          <Loader2 className="h-4 w-4 mr-2 text-amber-400" />
          Processing
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter("completed")}
          className="hover:bg-gray-700 focus:bg-gray-700"
        >
          <Check className="h-4 w-4 mr-2 text-emerald-400" />
          Successful
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter("failed")}
          className="hover:bg-gray-700 focus:bg-gray-700"
        >
          <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
          Failed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <MobileLayout 
      showBackButton 
      title="Withdrawal Records" 
      hideFooter
      headerAction={<FilterDropdown />}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="p-3 pb-4">
          {isLoading ? (
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-gray-500 animate-spin mb-3" />
                <h3 className="text-base font-semibold text-white mb-2">Loading withdrawals...</h3>
                <p className="text-gray-400 text-center text-sm">Fetching your withdrawal history</p>
              </CardContent>
            </Card>
          ) : records.length > 0 ? (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-all duration-200 backdrop-blur-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-base font-medium text-white">{record.id}</span>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1",
                        getStatusStyles(record.status)
                      )}>
                        {getStatusIcon(record.status)}
                        <span>{getDisplayStatus(record.status)}</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-white">₹{record.amount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-400">
                      <div>
                        <p className="mb-1">Method</p>
                        <p>{record.method || 'BANK'}</p>
                      </div>
                      <div className="text-right">
                        <p className="mb-1">Date</p>
                        <p>{formatDate(record.date)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-500 mb-3" />
                <h3 className="text-base font-semibold text-white mb-2">No withdrawal records found</h3>
                <p className="text-gray-400 text-center text-sm">No withdrawals have been made yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default WithdrawalRecordsPage;
