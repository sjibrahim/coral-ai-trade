import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSalaryRecords } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, CheckCircle, Clock, Wallet, TrendingUp, Award, Star } from "lucide-react";

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
    <MobileLayout showBackButton title="Salary Records" hideFooter>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
        <div className="p-4 pb-6">
          {/* Hero Stats Section */}
          <div className="mb-6 space-y-4">
            {/* Main Balance Card */}
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-emerald-400/20 backdrop-blur-md shadow-2xl">
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full flex items-center justify-center border border-emerald-400/30">
                      <Wallet className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                  <h2 className="text-emerald-300 text-sm font-medium mb-2">Total Salary Earned</h2>
                  <p className="text-4xl font-bold mb-1 text-white bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    ₹{totalEarned.toLocaleString()}
                  </p>
                  <p className="text-emerald-300/70 text-sm">From {records.length} payments</p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-2 right-2 opacity-10">
                  <Star className="h-8 w-8 text-emerald-400" />
                </div>
                <div className="absolute bottom-2 left-2 opacity-10">
                  <Award className="h-6 w-6 text-teal-400" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-400/20 backdrop-blur-md">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">
                    {records.filter(r => r.status.toLowerCase() === 'success').length}
                  </p>
                  <p className="text-blue-300 text-xs">Successful</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-400/20 backdrop-blur-md">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">
                    {records.length > 0 ? Math.ceil((Date.now() - new Date(records[records.length - 1]?.timestamp.replace(' ', 'T')).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  </p>
                  <p className="text-purple-300 text-xs">Days Active</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Salary Records List */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              Payment History
            </h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, idx) => (
                  <Card key={`skeleton-${idx}`} className="bg-gray-800/30 border-gray-700/30 animate-pulse backdrop-blur-md">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700/50 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 w-32 bg-gray-700/50 rounded mb-2"></div>
                          <div className="h-3 w-20 bg-gray-700/50 rounded"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-5 w-20 bg-gray-700/50 rounded mb-1"></div>
                          <div className="h-3 w-16 bg-gray-700/50 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : records.length > 0 ? (
              <div className="space-y-4">
                {records.map((record, index) => (
                  <Card 
                    key={record.id}
                    className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-gray-700/30 hover:from-gray-800/60 hover:to-gray-900/60 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-emerald-500/30 shadow-lg">
                            <DollarSign className="h-6 w-6 text-emerald-400" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                            {index + 1}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-semibold text-base truncate">
                              Monthly Salary
                            </h4>
                            <div className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
                              record.status.toLowerCase() === 'success' 
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            )}>
                              {record.status.toLowerCase() === 'success' ? (
                                <CheckCircle className="h-2 w-2 mr-1" />
                              ) : (
                                <Clock className="h-2 w-2 mr-1" />
                              )}
                              {record.status.toUpperCase()}
                            </div>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(record.timestamp)}</span>
                          </div>
                        </div>
                        
                        {/* Amount */}
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            ₹{parseInt(record.amount).toLocaleString()}
                          </p>
                          <p className="text-gray-400 text-xs">Payment #{record.id.slice(-4)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/30 backdrop-blur-md shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <DollarSign className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">No salary records yet</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Complete tasks and activities to earn your first salary payment. 
                    Your earnings will appear here once processed.
                  </p>
                  <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
                    <p className="text-emerald-300 text-xs">💡 Tip: Regular activity increases your salary potential</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SalaryRecordPage;
