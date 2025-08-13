
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";

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
        // Simulate API call with mock data
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
    <MobileLayout showBackButton title="Contract Records">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Contract History</h1>
            <p className="text-muted-foreground">Your trading contract records</p>
          </div>

          {/* Contract Records */}
          {isLoading ? (
            // Loading skeletons
            <div className="space-y-4">
              {Array(3).fill(0).map((_, idx) => (
                <Card key={`skeleton-${idx}`} className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                  <CardContent className="p-5">
                    <div className="flex justify-between mb-2">
                      <div className="h-5 w-24 bg-emerald-100 dark:bg-emerald-900/30 rounded"></div>
                      <div className="h-5 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded"></div>
                    </div>
                    <div className="mb-4">
                      <div className="h-7 w-32 bg-emerald-100 dark:bg-emerald-900/30 rounded"></div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="h-4 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded mb-1"></div>
                        <div className="h-4 w-24 bg-emerald-100 dark:bg-emerald-900/30 rounded"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded mb-1"></div>
                        <div className="h-4 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <Card 
                  key={record.id}
                  className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3">
                          {record.type === 'Buy' ? (
                            <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground">{record.type} Contract</p>
                          <p className="text-sm text-muted-foreground">#{record.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{parseInt(record.amount).toLocaleString()}
                        </p>
                        <div className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          record.result === 'Win' 
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
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
                    
                    <div className="flex justify-between text-sm text-muted-foreground pt-3 border-t border-emerald-100 dark:border-emerald-800">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Contract Date</span>
                      </div>
                      <span className="font-medium">{formatDate(record.timestamp)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No contract records yet</h3>
                <p className="text-muted-foreground">Start trading to see your contract history</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default ContractRecordsPage;
