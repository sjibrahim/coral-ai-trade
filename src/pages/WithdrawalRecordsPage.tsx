
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { 
  ArrowDownCircle, 
  IndianRupee, 
  Calendar, 
  TrendingDown, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Building2,
  CreditCard,
  Hash,
  Banknote,
  Target,
  Wallet,
  Activity,
  Filter,
  Search,
  Eye,
  EyeOff
} from "lucide-react";
import { getTransactions, getGeneralSettings } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [filteredRecords, setFilteredRecords] = useState<WithdrawalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [withdrawalFeePercentage, setWithdrawalFeePercentage] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showBalance, setShowBalance] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

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
              transaction_id: tx.txnid || "",
              created_at: tx.created_at || "",
              type: tx.method || "BANK",
              method: tx.method || "BANK",
              charges: tx.charges || "10",
              net_amount: tx.net_amount || tx.amount
            }))
            .sort((a: WithdrawalRecord, b: WithdrawalRecord) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          
          setRecords(withdrawals);
          setFilteredRecords(withdrawals);
          
          // Calculate total withdrawn (only successful withdrawals)
          const total = withdrawals
            .filter((record: WithdrawalRecord) => record.status.toLowerCase() === 'completed' || record.status.toLowerCase() === 'success')
            .reduce((sum: number, record: WithdrawalRecord) => sum + record.amount, 0);
          setTotalWithdrawn(total);
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

  // Filter records based on search and status
  useEffect(() => {
    let filtered = records;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.amount.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => 
        record.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredRecords(filtered);
  }, [searchTerm, statusFilter, records]);
  
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case 'processing':
      case 'pending':
        return "text-amber-700 bg-amber-100 border-amber-200";
      case 'rejected':
      case 'failed':
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
  };

  const maskBankAccount = (account: string | undefined) => {
    if (!account) return "••••••••••";
    return "••••••••" + account.slice(-4);
  };

  const getRecordsByStatus = () => {
    const completed = records.filter(r => r.status.toLowerCase() === 'completed' || r.status.toLowerCase() === 'success').length;
    const pending = records.filter(r => r.status.toLowerCase() === 'processing' || r.status.toLowerCase() === 'pending').length;
    const failed = records.filter(r => r.status.toLowerCase() === 'rejected' || r.status.toLowerCase() === 'failed').length;
    
    return { completed, pending, failed };
  };

  const statusCounts = getRecordsByStatus();
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" }
  ];

  return (
    <MobileLayout showBackButton title="Withdrawal Records">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Withdrawal History</h1>
                <p className="text-blue-100 text-sm">Track all your withdrawals</p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100 text-sm">Total Withdrawn</span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-6 h-6 text-white" />
                <span className="text-2xl font-bold text-white">
                  {showBalance ? totalWithdrawn.toLocaleString() : "••••••"}
                </span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100 text-sm">Total Records</span>
              </div>
              <span className="text-2xl font-bold text-white">{records.length}</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4 pb-24">
          {/* Status Overview */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <Target className="w-5 h-5 text-blue-600" />
                Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">{statusCounts.completed}</p>
                  <p className="text-xs text-emerald-600 font-medium">Completed</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold text-amber-700">{statusCounts.pending}</p>
                  <p className="text-xs text-amber-600 font-medium">Pending</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center justify-center mb-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-700">{statusCounts.failed}</p>
                  <p className="text-xs text-red-600 font-medium">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by ID or amount..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={statusFilter === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(option.value)}
                      className={cn(
                        "min-w-fit text-xs px-3 py-1.5 rounded-full",
                        statusFilter === option.value
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, idx) => (
                <Card key={`skeleton-${idx}`} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div>
                          <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 w-32 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="space-y-4">
              {filteredRecords.map((record, index) => {
                const charges = typeof record.charges === 'string' ? parseFloat(record.charges) : record.charges || 0;
                const netAmount = typeof record.net_amount === 'string' ? parseFloat(record.net_amount) : 
                                (record.net_amount as number) || 0;
                
                return (
                  <Card key={record.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <ArrowDownCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span className="text-sm font-mono text-gray-600">{record.id}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-5 h-5 text-gray-700" />
                              <span className="text-xl font-bold text-gray-900">
                                {showBalance ? record.amount.toLocaleString() : "••••••"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs border-2 font-medium px-3 py-1", getStatusColor(record.status))}
                        >
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(record.status)}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                      
                      {/* Transaction Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-medium text-red-700">Fee ({withdrawalFeePercentage}%)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-red-600" />
                            <span className="text-lg font-bold text-red-700">
                              {showBalance ? charges.toLocaleString() : "••••"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 border border-emerald-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Banknote className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-700">Net Amount</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-emerald-600" />
                            <span className="text-lg font-bold text-emerald-700">
                              {showBalance ? netAmount.toLocaleString() : "••••"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Footer Details */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-medium">Bank Account</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 font-mono">
                              {maskBankAccount(user?.account_number)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-medium">Date & Time</span>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {formatDate(record.date)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowDownCircle className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || statusFilter !== "all" ? "No Records Found" : "No Withdrawals Yet"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria."
                    : "Your withdrawal history will appear here once you make your first withdrawal."
                  }
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    variant="outline"
                    className="bg-white hover:bg-gray-50"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default WithdrawalRecordsPage;
