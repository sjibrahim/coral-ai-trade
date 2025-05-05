
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";

const SalaryRecordPage = () => {
  // Sample salary record data
  const records = [
    { id: 'SAL12345', amount: 5000, date: '2023-05-01', period: 'May 2023', status: 'completed' },
    { id: 'SAL12346', amount: 5000, date: '2023-04-01', period: 'April 2023', status: 'completed' },
    { id: 'SAL12347', amount: 5000, date: '2023-03-01', period: 'March 2023', status: 'completed' },
    { id: 'SAL12348', amount: 4500, date: '2023-02-01', period: 'February 2023', status: 'completed' },
    { id: 'SAL12349', amount: 4500, date: '2023-01-01', period: 'January 2023', status: 'completed' },
  ];
  
  return (
    <MobileLayout showBackButton title="Salary Records">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Total Earned */}
        <div className="bg-card rounded-xl p-5 mb-4">
          <p className="text-center text-muted-foreground mb-1">Total Earned YTD</p>
          <p className="text-center text-4xl font-semibold">₹24,000</p>
        </div>
        
        {/* Salary Records */}
        {records.map((record) => (
          <div 
            key={record.id}
            className="bg-card rounded-xl p-5 border border-border/40"
          >
            <div className="flex justify-between mb-2">
              <p className="text-lg font-medium">{record.id}</p>
              <p className={cn(
                "font-medium",
                record.status === 'completed' ? "text-market-increase" : "text-amber-500"
              )}>
                {record.status.toUpperCase()}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-semibold">₹{record.amount}</p>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <div>
                <p>Period</p>
                <p>{record.period}</p>
              </div>
              <div className="text-right">
                <p>Date</p>
                <p>{record.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default SalaryRecordPage;
