
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getWithdrawalRecords } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpRight, Banknote, Calendar, Clock, CheckCircle, XCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";

interface WithdrawalRecord {
  id: string;
  amount: string;
  status: string;
  created_at: string;
  bank_name?: string;
  account_number?: string;
  processing_fee?: string;
}

const AllWithdrawalsPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWithdrawalRecords = async () => {
      try {
        setIsLoading(true);
        if (user?.token) {
          const response = await getWithdrawalRecords(user.token);
          if (response.status) {
            setRecords(response.data || []);
          } else {
            toast({
              title: "Error",
              description: response.msg || "Failed to fetch withdrawal records",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching withdrawal records:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching withdrawal records",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawalRecords();
  }, [user?.token, toast]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <Loader className="w-4 h-4 text-yellow-600" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Loader className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MobileLayout showBackButton title="All Withdrawals">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pb-20">
        <div className="p-4 space-y-4">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-lg font-bold">Withdrawal History</h1>
                    <p className="text-emerald-100 text-sm">Track your withdrawals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="bg-white/90">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : records.length === 0 ? (
            // Empty state
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-white/90">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 mx-auto">
                    <ArrowUpRight className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Withdrawals Yet</h3>
                  <p className="text-gray-600 text-base">
                    Your withdrawal history will appear here
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Withdrawal records
            records.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/90 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-base">
                            Withdrawal
                          </h3>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(record.status)}
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </div>
                        </div>
                        
                        <p className="font-bold text-red-600 text-lg mb-2">-₹{record.amount}</p>
                        
                        {record.bank_name && (
                          <p className="text-gray-600 text-sm mb-1">
                            Bank: {record.bank_name}
                          </p>
                        )}
                        
                        {record.account_number && (
                          <p className="text-gray-600 text-sm mb-1">
                            Account: ****{record.account_number.slice(-4)}
                          </p>
                        )}
                        
                        {record.processing_fee && (
                          <p className="text-gray-500 text-sm mb-2">
                            Processing Fee: ₹{record.processing_fee}
                          </p>
                        )}
                        
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{new Date(record.created_at).toLocaleDateString()}</span>
                          <Clock className="w-3 h-3 ml-2 mr-1" />
                          <span>{new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default AllWithdrawalsPage;
