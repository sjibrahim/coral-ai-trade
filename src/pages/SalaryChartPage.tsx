
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign, Calendar, Target } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const SalaryChartPage = () => {
  const { user } = useAuth();
  
  // Mock salary data for the chart
  const [salaryData] = useState([
    { month: 'Jan', amount: 4500, target: 5000 },
    { month: 'Feb', amount: 5200, target: 5000 },
    { month: 'Mar', amount: 4800, target: 5000 },
    { month: 'Apr', amount: 5800, target: 6000 },
    { month: 'May', amount: 6200, target: 6000 },
    { month: 'Jun', amount: 5900, target: 6000 },
    { month: 'Jul', amount: 7100, target: 7000 },
    { month: 'Aug', amount: 6800, target: 7000 },
    { month: 'Sep', amount: 7500, target: 7500 },
    { month: 'Oct', amount: 8200, target: 8000 },
    { month: 'Nov', amount: 7800, target: 8000 },
    { month: 'Dec', amount: 8500, target: 8500 }
  ]);

  const currentSalary = user?.salary ? parseFloat(user.salary) : 8500;
  const totalEarned = salaryData.reduce((sum, item) => sum + item.amount, 0);
  const averageSalary = Math.round(totalEarned / salaryData.length);
  const bestMonth = salaryData.reduce((max, item) => item.amount > max.amount ? item : max);

  return (
    <MobileLayout showBackButton title="Salary Chart" hideFooter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="p-4 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 border-emerald-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 mr-2 text-emerald-400" />
                  <span className="text-emerald-300 text-sm">Current Salary</span>
                </div>
                <p className="text-2xl font-bold text-white">₹{currentSalary.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                  <span className="text-blue-300 text-sm">Total Earned</span>
                </div>
                <p className="text-2xl font-bold text-white">₹{totalEarned.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Salary Trend Chart */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Salary Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value, name) => [
                      `₹${value.toLocaleString()}`, 
                      name === 'amount' ? 'Salary' : 'Target'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-4 w-4 mr-2 text-amber-400" />
                  <span className="text-amber-300 text-xs">Average</span>
                </div>
                <p className="text-lg font-bold text-white">₹{averageSalary.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Monthly Average</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-4 w-4 mr-2 text-purple-400" />
                  <span className="text-purple-300 text-xs">Best Month</span>
                </div>
                <p className="text-lg font-bold text-white">₹{bestMonth.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{bestMonth.month} 2024</p>
              </CardContent>
            </Card>
          </div>

          {/* Salary vs Target Comparison */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Salary vs Target
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={salaryData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value, name) => [
                      `₹${value.toLocaleString()}`, 
                      name === 'amount' ? 'Actual' : 'Target'
                    ]}
                  />
                  <Bar dataKey="target" fill="#EF4444" opacity={0.6} />
                  <Bar dataKey="amount" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SalaryChartPage;
