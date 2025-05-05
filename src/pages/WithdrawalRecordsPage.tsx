
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";

const WithdrawalRecordsPage = () => {
  // Sample withdrawal record data
  const records = [
    { id: 'WD78901', amount: 800, date: '2023-05-03', status: 'completed', account: '******6413' },
    { id: 'WD78902', amount: 1200, date: '2023-04-29', status: 'processing', account: '******6413' },
    { id: 'WD78903', amount: 500, date: '2023-04-25', status: 'completed', account: '******6413' },
    { id: 'WD78904', amount: 2000, date: '2023-04-20', status: 'completed', account: '******6413' },
    { id: 'WD78905', amount: 1500, date: '2023-04-15', status: 'rejected', account: '******6413' },
  ];
  
  return (
    <MobileLayout showBackButton title="Withdrawal Records">
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
                record.status === 'completed' ? "text-market-increase" : 
                record.status === 'processing' ? "text-amber-500" : "text-market-decrease"
              )}>
                {record.status.toUpperCase()}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-semibold">₹{record.amount}</p>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <div>
                <p>Bank Account</p>
                <p>{record.account}</p>
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

export default WithdrawalRecordsPage;
