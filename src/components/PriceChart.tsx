
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  data: { time: string; price: number }[];
  isPositive: boolean;
}

const PriceChart = ({ data: initialData, isPositive }: PriceChartProps) => {
  const [activeTimeframe, setActiveTimeframe] = useState('1m');
  const [data, setData] = useState(initialData);
  
  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add slight random variation to the last price point
      const lastPrice = data[data.length - 1].price;
      const change = (Math.random() - 0.5) * 50; // Random value between -25 and 25
      const newPrice = Math.max(lastPrice + change, 100); // Ensure price doesn't go below 100
      
      // Clone the data and replace the last item
      const newData = [...data];
      newData[newData.length - 1] = {
        ...newData[newData.length - 1],
        price: newPrice
      };
      
      setData(newData);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [data]);
  
  const timeframes = [
    { id: '1m', label: '1m' },
    { id: '3m', label: '3m' },
    { id: '5m', label: '5m' },
    { id: '15m', label: '15m' },
    { id: 'area', label: 'Area' },
  ];

  // Get the min and max values for better chart scaling
  const minValue = Math.min(...data.map(d => d.price)) - 100;
  const maxValue = Math.max(...data.map(d => d.price)) + 100;

  // Current price (latest data point)
  const currentPrice = data[data.length - 1]?.price;

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
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: '#a0aec0' }}
              axisLine={{ stroke: '#2d3748' }}
              tickLine={false}
            />
            <YAxis 
              domain={[minValue, maxValue]} 
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
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <ReferenceLine 
              y={currentPrice} 
              stroke="#4b5563" 
              strokeDasharray="3 3" 
              label={{ 
                value: `$${currentPrice.toFixed(2)}`,
                fill: '#a0aec0',
                position: 'right'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? "#22c55e" : "#ef4444"} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 1 }}
              fill="url(#colorPrice)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
