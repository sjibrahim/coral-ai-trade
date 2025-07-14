
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactions } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TransactionRecord {
  id: string;
  type: string;
  amount: string;
  status: string;
  created_at: string;
  description?: string;
}

const TransactionRecordsPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactionRecords = async () => {
      try {
        setIsLoading(true);
        if (user?.token) {
          const response = await getTransactions(user.token);
          if (response.status) {
            setRecords(response.data || []);
          } else {
            toast({
              title: "Error",
              description: response.msg || "Failed to fetch transaction records",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching transaction records:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching transaction records",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionRecords();
  }, [user?.token, toast]);

  return (
    <MobileLayout showBackButton title="Transaction Records">
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
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-lg font-bold">Transaction History</h1>
                    <p className="text-emerald-100 text-base">Your account activity</p>
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
                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
                  <p className="text-gray-600 text-base">
                    Your transaction history will appear here
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Transaction records
            records.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/90 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        record.type.toLowerCase().includes('deposit') || record.type.toLowerCase().includes('credit')
                          ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        {record.type.toLowerCase().includes('deposit') || record.type.toLowerCase().includes('credit') ? (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-base truncate">
                          {record.description || record.type}
                        </h3>
                        <div className="flex items-center text-gray-500 text-base mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(record.created_at).toLocaleDateString()}</span>
                          <Clock className="w-4 h-4 ml-2 mr-1" />
                          <span>{new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-semibold text-base ${
                          record.type.toLowerCase().includes('deposit') || record.type.toLowerCase().includes('credit')
                            ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {record.type.toLowerCase().includes('deposit') || record.type.toLowerCase().includes('credit') ? '+' : '-'}₹{record.amount}
                        </p>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          record.status === 'completed' || record.status === 'success'
                            ? 'bg-emerald-100 text-emerald-700'
                            : record.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
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

export default TransactionRecordsPage;
