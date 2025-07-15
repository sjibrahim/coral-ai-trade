import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { Wallet, Calendar, TrendingUp } from "lucide-react";

const SalaryRecordPage = () => {
  // Sample salary record data
  const records = [
    { id: 'SAL23456', amount: 5000, date: '2023-05-04', description: 'Monthly Salary' },
    { id: 'SAL23457', amount: 5000, date: '2023-05-02', description: 'Monthly Salary' },
    { id: 'SAL23458', amount: 5000, date: '2023-04-30', description: 'Monthly Salary' },
    { id: 'SAL23459', amount: 5000, date: '2023-04-27', description: 'Monthly Salary' },
    { id: 'SAL23460', amount: 5000, date: '2023-04-25', description: 'Monthly Salary' },
  ];
  
  return (
    <MobileLayout showBackButton title="Salary Records">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Total Salary */}
        <div className="bg-card rounded-xl p-5 mb-4">
          <p className="text-center text-muted-foreground mb-1">Total Salary</p>
          <p className="text-center text-4xl font-semibold">₹25,000</p>
        </div>
        
        {/* Salary Records */}
        {records.map((record) => (
          <div 
            key={record.id}
            className="bg-card rounded-xl p-5 border border-border/40"
          >
            <div className="flex justify-between mb-2">
              <p className="text-lg font-medium">{record.id}</p>
              <p className="text-muted-foreground">{record.date}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-semibold text-market-increase">+₹{record.amount}</p>
            </div>
            
            <div className="text-muted-foreground">
              <p>Description</p>
              <p>{record.description}</p>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default SalaryRecordPage;
