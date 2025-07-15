import MobileLayout from "@/components/layout/MobileLayout";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Calendar, Clock } from "lucide-react";

const ContractRecordPage = () => {
  // Sample contract record data
  const records = [
    { id: 'CR23456', coin: 'BTC', type: 'Long', amount: 0.05, profit: 0.002, date: '2023-05-04', status: 'Completed' },
    { id: 'CR23457', coin: 'ETH', type: 'Short', amount: 0.1, profit: -0.005, date: '2023-05-03', status: 'Completed' },
    { id: 'CR23458', coin: 'LTC', type: 'Long', amount: 0.2, profit: 0.01, date: '2023-05-02', status: 'Completed' },
    { id: 'CR23459', coin: 'XRP', type: 'Short', amount: 0.5, profit: -0.02, date: '2023-05-01', status: 'Completed' },
    { id: 'CR23460', coin: 'ADA', type: 'Long', amount: 1.0, profit: 0.05, date: '2023-04-30', status: 'Completed' },
  ];
  
  return (
    <MobileLayout showBackButton title="Contract Records">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Contract Records */}
        {records.map((record) => (
          <div 
            key={record.id}
            className="bg-card rounded-xl p-5 border border-border/40"
          >
            <div className="flex justify-between mb-2">
              <p className="text-lg font-medium">{record.coin} - {record.type}</p>
              <p className="text-muted-foreground">
                {record.status}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-semibold">
                {record.profit > 0 ? (
                  <span className="text-market-increase">
                    <TrendingUp className="inline-block mr-1 h-5 w-5 align-middle" />
                    +{record.profit} {record.coin}
                  </span>
                ) : (
                  <span className="text-market-decrease">
                    <TrendingDown className="inline-block mr-1 h-5 w-5 align-middle" />
                    {record.profit} {record.coin}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <div>
                <p>Amount</p>
                <p>{record.amount} {record.coin}</p>
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

export default ContractRecordPage;
