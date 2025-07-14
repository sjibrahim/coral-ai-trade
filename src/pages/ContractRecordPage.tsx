
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getTradeRecords } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, Calendar, Target, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

interface TradeRecord {
  id: string;
  asset_name: string;
  asset_symbol: string;
  amount_inr: string;
  buy_time: string;
  obtained_price: string;
  sell_time: string;
  closure_price: string;
  current_balance: string;
  pnl_type: string;
  pnl_amount: string;
  logo: string;
}

const ContractRecordPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<TradeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTradeRecords = async () => {
      try {
        setIsLoading(true);
        if (user?.token) {
          const response = await getTradeRecords(user.token);
          if (response.status) {
            setRecords(response.data || []);
          } else {
            toast({
              title: "Error",
              description: response.msg || "Failed to fetch contract records",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching contract records:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching contract records",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradeRecords();
  }, [user?.token, toast]);

  return (
    <MobileLayout showBackButton title="Contract Records">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-3 space-y-3 pb-24">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-center justify-center">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center mr-2">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-base font-bold">Trading History</h1>
                    <p className="text-emerald-100 text-xs">Your contract performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-3 w-20 mb-1" />
                      <Skeleton className="h-2 w-24" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
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
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 mx-auto">
                    <Target className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">No Trades Yet</h3>
                  <p className="text-gray-600 text-sm">
                    Start trading to see your records here
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Contract records
            records.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-3">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        {record.logo ? (
                          <img 
                            src={record.logo} 
                            alt={record.asset_name} 
                            className="w-5 h-5 rounded-full" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          <span className="font-bold text-xs text-emerald-600">{record.asset_symbol.slice(0, 2)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{record.asset_name}</h3>
                        <p className="text-gray-600 text-xs">{record.asset_symbol}</p>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1",
                        record.pnl_type === "Profit" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-red-100 text-red-700"
                      )}>
                        {record.pnl_type === "Profit" ? 
                          <ArrowUpRight className="w-3 h-3" /> : 
                          <ArrowDownRight className="w-3 h-3" />
                        }
                        ₹{record.pnl_amount}
                      </div>
                    </div>
                    
                    {/* Trade Details */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-emerald-50 rounded-lg p-2">
                        <div className="flex items-center text-emerald-600 text-xs mb-1">
                          <Target className="w-3 h-3 mr-1" />
                          <span>Buy</span>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">₹{record.amount_inr}</p>
                        <p className="text-gray-600 text-xs">{parseFloat(record.obtained_price).toFixed(4)}</p>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <Clock className="w-2 h-2 mr-1" />
                          <span>{record.buy_time}</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-2">
                        <div className="flex items-center text-blue-600 text-xs mb-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Sell</span>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">₹{record.current_balance}</p>
                        <p className="text-gray-600 text-xs">{parseFloat(record.closure_price).toFixed(4)}</p>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <Clock className="w-2 h-2 mr-1" />
                          <span>{record.sell_time}</span>
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

export default ContractRecordPage;
