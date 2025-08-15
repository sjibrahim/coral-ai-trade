
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar, CheckCircle, Clock, TrendingUp, TrendingDown, Target, Zap } from "lucide-react";

interface ContractRecord {
  id: string;
  type: string;
  amount: string;
  status: string;
  timestamp: string;
  result?: string;
}

const ContractRecordsPage = () => {
  const [records, setRecords] = useState<ContractRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContractRecords = async () => {
      try {
        setTimeout(() => {
          setRecords([
            { id: 'CON12345', type: 'Buy', amount: '10000', timestamp: '2023-05-01 12:00:00', status: 'Success', result: 'Win' },
            { id: 'CON12346', type: 'Sell', amount: '8500', timestamp: '2023-04-28 15:30:00', status: 'Success', result: 'Loss' },
            { id: 'CON12347', type: 'Buy', amount: '15000', timestamp: '2023-04-25 10:45:00', status: 'Success', result: 'Win' },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching contract records:", error);
        toast({
          title: "Error",
          description: "Failed to load contract records",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchContractRecords();
  }, [toast]);
  
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
  
  return (
    <MobileLayout showBackButton title="Contracts">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          <div className="relative px-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Contract History</h1>
              <p className="text-gray-400">Your trading contract history</p>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-4">
          {/* Contract Records */}
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, idx) => (
                <Card key={`skeleton-${idx}`} className="bg-gray-800/50 border-gray-700/50 animate-pulse">
                  <CardContent className="p-5">
                    <div className="flex justify-between mb-2">
                      <div className="h-5 w-24 bg-gray-700 rounded"></div>
                      <div className="h-5 w-20 bg-gray-700 rounded"></div>
                    </div>
                    <div className="mb-4">
                      <div className="h-7 w-32 bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="h-4 w-16 bg-gray-700 rounded mb-1"></div>
                        <div className="h-4 w-24 bg-gray-700 rounded"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-12 bg-gray-700 rounded mb-1"></div>
                        <div className="h-4 w-20 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : records.length > 0 ? (
            <div className="space-y-4 pb-6">
              {records.map((record) => (
                <Card 
                  key={record.id}
                  className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-all duration-200 backdrop-blur-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mr-3 border border-blue-500/30">
                          {record.type === 'Buy' ? (
                            <TrendingUp className="h-6 w-6 text-green-400" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">{record.type} Contract</p>
                          <p className="text-sm text-gray-400">#{record.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">
                          ₹{parseInt(record.amount).toLocaleString()}
                        </p>
                        <div className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          record.result === 'Win' 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        )}>
                          {record.result === 'Win' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {record.result?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-400 pt-3 border-t border-gray-700">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Contract Date</span>
                      </div>
                      <span className="font-medium text-gray-300">{formatDate(record.timestamp)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">No contracts yet</h3>
                <p className="text-gray-400">Start trading to see your contract history</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default ContractRecordsPage;
