
import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";

const CommissionRecordPage = () => {
  // Sample commission record data
  const records = [
    { id: 'COM23456', amount: 120, date: '2023-05-04', level: 'Level 1', referral: 'User123' },
    { id: 'COM23457', amount: 80, date: '2023-05-02', level: 'Level 1', referral: 'User456' },
    { id: 'COM23458', amount: 50, date: '2023-04-30', level: 'Level 2', referral: 'User789' },
    { id: 'COM23459', amount: 25, date: '2023-04-27', level: 'Level 2', referral: 'User234' },
    { id: 'COM23460', amount: 10, date: '2023-04-25', level: 'Level 3', referral: 'User567' },
  ];
  
  return (
    <MobileLayout showBackButton title="Commission Records">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Total Commission */}
        <div className="bg-card rounded-xl p-5 mb-4">
          <p className="text-center text-muted-foreground mb-1">Total Commission</p>
          <p className="text-center text-4xl font-semibold">₹285</p>
        </div>
        
        {/* Commission Records */}
        {records.map((record) => (
          <div 
            key={record.id}
            className="bg-card rounded-xl p-5 border border-border/40"
          >
            <div className="flex justify-between mb-2">
              <p className="text-lg font-medium">{record.id}</p>
              <p className="text-primary font-medium">
                {record.level}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-semibold text-market-increase">+₹{record.amount}</p>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <div>
                <p>Referral</p>
                <p>{record.referral}</p>
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

export default CommissionRecordPage;
