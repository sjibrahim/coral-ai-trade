
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";

const DepositRecordsPage = () => {
  // Sample deposit record data
  const records = [
    { id: 'DEP45678', amount: 1000, date: '2023-05-04', status: 'completed', method: 'Bank Transfer' },
    { id: 'DEP45679', amount: 500, date: '2023-05-01', status: 'completed', method: 'UPI' },
    { id: 'DEP45680', amount: 2000, date: '2023-04-28', status: 'completed', method: 'Bank Transfer' },
    { id: 'DEP45681', amount: 1500, date: '2023-04-25', status: 'processing', method: 'UPI' },
    { id: 'DEP45682', amount: 3000, date: '2023-04-22', status: 'completed', method: 'Bank Transfer' },
  ];
  
  return (
    <MobileLayout showBackButton title="Deposit Records">
      <div className="p-4 space-y-6 animate-fade-in">
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
                <p>Method</p>
                <p>{record.method}</p>
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

export default DepositRecordsPage;
