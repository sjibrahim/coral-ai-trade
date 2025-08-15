
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getTradeRecords } from "@/services/api";
import { TrendingUp, TrendingDown, Calendar, Target, Activity, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
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

const ContractRecordsPage = () => {
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

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp.replace(' ', 'T'));
      return isNaN(date.getTime()) 
        ? timestamp.split(' ')[0] 
        : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return timestamp;
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp.replace(' ', 'T'));
      return isNaN(date.getTime()) 
        ? timestamp.split(' ')[1] || ''
        : date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timestamp;
    }
  };
  
  return (
    <MobileLayout showBackButton title="Trading History">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="relative px-6 py-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/25">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Trading History</h1>
              <p className="text-gray-400 text-lg">Your crypto contracts performance</p>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-4">
          {/* Contract Records */}
          {isLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, idx) => (
                <Card key={`skeleton-${idx}`} className="bg-gray-800/60 border-gray-700/50 animate-pulse backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-16 bg-gray-700 rounded"></div>
                      </div>
                      <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-gray-700/50 rounded-xl"></div>
                      <div className="h-20 bg-gray-700/50 rounded-xl"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : records.length > 0 ? (
            <div className="space-y-4 pb-6">
              {records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm shadow-xl"
                  >
                    <CardContent className="p-6">
                      {/* Header with Asset Info */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                            {record.logo ? (
                              <img 
                                src={record.logo} 
                                alt={record.asset_name} 
                                className="w-8 h-8 rounded-full" 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : (
                              <span className="font-bold text-blue-400 text-lg">{record.asset_symbol.slice(0, 2)}</span>
                            )}
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                            <Zap className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">{record.asset_name}</h3>
                          <p className="text-gray-400 font-medium">{record.asset_symbol}/USDT</p>
                        </div>
                        
                        <div className={cn(
                          "px-4 py-2 rounded-2xl font-bold flex items-center gap-2 text-lg shadow-lg",
                          record.pnl_type === "Profit" 
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30" 
                            : "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/30"
                        )}>
                          {record.pnl_type === "Profit" ? 
                            <ArrowUpRight className="w-5 h-5" /> : 
                            <ArrowDownRight className="w-5 h-5" />
                          }
                          ₹{record.pnl_amount}
                        </div>
                      </div>
                      
                      {/* Trade Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-4 border border-emerald-500/20">
                          <div className="flex items-center text-emerald-400 text-sm font-semibold mb-3">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            <span>BUY ORDER</span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-2xl font-bold text-white">₹{record.amount_inr}</p>
                            <p className="text-emerald-300 font-mono text-sm">@ {parseFloat(record.obtained_price).toFixed(4)}</p>
                            <div className="flex items-center text-gray-400 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{formatDate(record.buy_time)} {formatTime(record.buy_time)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 border border-blue-500/20">
                          <div className="flex items-center text-blue-400 text-sm font-semibold mb-3">
                            <TrendingDown className="w-4 h-4 mr-2" />
                            <span>SELL ORDER</span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-2xl font-bold text-white">₹{record.current_balance}</p>
                            <p className="text-blue-300 font-mono text-sm">@ {parseFloat(record.closure_price).toFixed(4)}</p>
                            <div className="flex items-center text-gray-400 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{formatDate(record.sell_time)} {formatTime(record.sell_time)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Bar */}
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Target className="w-4 h-4 mr-2" />
                            <span>Contract #{record.id}</span>
                          </div>
                          <div className={cn(
                            "text-sm font-semibold",
                            record.pnl_type === "Profit" ? "text-green-400" : "text-red-400"
                          )}>
                            {record.pnl_type === "Profit" ? "PROFIT" : "LOSS"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-gray-800/60 border-gray-700/50 backdrop-blur-sm shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                    <Activity className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">No Trading History</h3>
                  <p className="text-gray-400 text-lg">Start trading crypto contracts to see your history here</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default ContractRecordsPage;
