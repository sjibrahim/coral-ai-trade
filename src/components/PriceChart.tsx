
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  data: { time: string; price: number }[];
  isPositive: boolean;
}

const PriceChart = ({ data, isPositive }: PriceChartProps) => {
  const [activeTimeframe, setActiveTimeframe] = useState('1m');
  
  const timeframes = [
    { id: '1m', label: '1m' },
    { id: '3m', label: '3m' },
    { id: '5m', label: '5m' },
    { id: '15m', label: '15m' },
    { id: 'area', label: 'Area' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-2">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.id}
            className={cn(
              "px-4 py-1 text-sm rounded-full transition-colors",
              activeTimeframe === timeframe.id 
                ? "bg-muted text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTimeframe(timeframe.id)}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: '#a0aec0' }}
              axisLine={{ stroke: '#2d3748' }}
              tickLine={false}
            />
            <YAxis 
              domain={['dataMin - 100', 'dataMax + 100']} 
              orientation="right"
              tick={{ fontSize: 10, fill: '#a0aec0' }}
              axisLine={{ stroke: '#2d3748' }}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a202c', 
                borderColor: '#2d3748',
                borderRadius: '0.375rem',
              }}
              itemStyle={{ color: '#e2e8f0' }}
              labelStyle={{ color: '#a0aec0' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? "#22c55e" : "#ef4444"} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
