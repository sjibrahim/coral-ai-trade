
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSalaryRecords } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, CheckCircle, Clock, Wallet, TrendingUp } from "lucide-react";

interface SalaryRecord {
  id: string;
  phone: string;
  amount: string;
  status: string;
  timestamp: string;
}

const SalaryRecordPage = () => {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSalaryRecords = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await getSalaryRecords(token);
        
        if (response.status && Array.isArray(response.data)) {
          setRecords(response.data);
        } else {
          toast({
            title: "Error",
            description: response.msg || "Could not fetch salary records",
            variant: "destructive",
          });
          
          setRecords([
            { id: 'SAL12345', phone: '9876543210', amount: '5000', timestamp: '2023-05-01 12:00:00', status: 'Success' },
            { id: 'SAL12346', phone: '9876543210', amount: '5000', timestamp: '2023-04-01 12:00:00', status: 'Success' },
          ]);
        }
      } catch (error) {
        console.error("Error fetching salary records:", error);
        toast({
          title: "Error",
          description: "Failed to load salary records",
          variant: "destructive",
        });
        
        setRecords([
          { id: 'SAL12345', phone: '9876543210', amount: '5000', timestamp: '2023-05-01 12:00:00', status: 'Success' },
          { id: 'SAL12346', phone: '9876543210', amount: '5000', timestamp: '2023-04-01 12:00:00', status: 'Success' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalaryRecords();
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
  
  const totalEarned = records.reduce((total, record) => {
    return total + parseInt(record.amount || '0');
  }, 0);
  
  return (
    <MobileLayout showBackButton title="Salary">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20" />
          <div className="relative px-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Salary History</h1>
              <p className="text-gray-400">Your earnings from Trexo activities</p>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-4">
          {/* Total Earned Card */}
          <Card className="mb-6 bg-gradient-to-br from-emerald-500/20 to-green-600/20 border-emerald-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 mr-2 text-emerald-400" />
                <span className="text-emerald-300 text-sm">Total Salary Earned</span>
              </div>
              <p className="text-4xl font-bold mb-2 text-white">₹{totalEarned.toLocaleString()}</p>
              <p className="text-emerald-300 text-sm">From {records.length} salary payments</p>
            </CardContent>
          </Card>
          
          {/* Salary Records */}
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
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 flex items-center justify-center mr-3 border border-emerald-500/30">
                          <DollarSign className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">Salary #{record.id}</p>
                          <p className="text-sm text-gray-400">Monthly payment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-400">
                          ₹{parseInt(record.amount).toLocaleString()}
                        </p>
                        <div className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          record.status.toLowerCase() === 'success' 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        )}>
                          {record.status.toLowerCase() === 'success' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {record.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-400 pt-3 border-t border-gray-700">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Payment Date</span>
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <DollarSign className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">No salary records yet</h3>
                <p className="text-gray-400">Complete tasks and activities to earn your first salary on Trexo</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default SalaryRecordPage;
