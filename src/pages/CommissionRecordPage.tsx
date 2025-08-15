
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DollarSign, Calendar, Target, TrendingUp, Users } from "lucide-react";

const CommissionRecordPage = () => {
  // Sample commission record data
  const records = [
    { id: 'COM23456', amount: 120, date: '2023-05-04', level: 'Level 1', referral: 'User123' },
    { id: 'COM23457', amount: 80, date: '2023-05-02', level: 'Level 1', referral: 'User456' },
    { id: 'COM23458', amount: 50, date: '2023-04-30', level: 'Level 2', referral: 'User789' },
    { id: 'COM23459', amount: 25, date: '2023-04-27', level: 'Level 2', referral: 'User234' },
    { id: 'COM23460', amount: 10, date: '2023-04-25', level: 'Level 3', referral: 'User567' },
  ];

  const totalCommission = records.reduce((total, record) => total + record.amount, 0);
  
  return (
    <MobileLayout showBackButton title="Commission Records" hideFooter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="p-3 pb-4">
          {/* Total Commission */}
          <Card className="mb-4 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-blue-300 text-sm">Total Commission</span>
              </div>
              <p className="text-3xl font-bold mb-1 text-white">₹{totalCommission}</p>
              <p className="text-blue-300 text-xs">From {records.length} referrals</p>
            </CardContent>
          </Card>
          
          {/* Commission Records */}
          <div className="space-y-3">
            {records.map((record) => (
              <Card 
                key={record.id}
                className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-all duration-200 backdrop-blur-sm"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mr-3 border border-blue-500/30">
                        <DollarSign className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">{record.id}</p>
                        <p className="text-xs text-gray-400">{record.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-400">+₹{record.amount}</p>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <Target className="h-2 w-2 mr-1" />
                        {record.level}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-700">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>Referral: {record.referral}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{record.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CommissionRecordPage;
