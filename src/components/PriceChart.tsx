
import React, { useRef, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartProps } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

// Define the data structure
interface ChartData {
  timestamp: number;
  price: number;
}

interface PriceChartProps {
  data: ChartData[];
  timeRange?: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
  showControls?: boolean;
  height?: number;
  className?: string;
}

const PriceChart = ({
  data = [],
  timeRange = '1D',
  showControls = false,
  height = 200,
  className
}: PriceChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  useEffect(() => {
    if (data.length > 0) {
      setCurrentPrice(data[data.length - 1].price);
    }
  }, [data]);
  
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-40 text-muted-foreground">No price data available</div>;
  }
  
  // Calculate price change
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = firstPrice !== 0 ? (priceChange / firstPrice) * 100 : 0;
  const isPriceUp = priceChange >= 0;
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    
    switch (timeRange) {
      case '1D':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1W':
        return date.toLocaleDateString([], { weekday: 'short' });
      case '1M':
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
      default:
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0].payload.timestamp);
      return (
        <div className="bg-background/80 backdrop-blur-md p-2 rounded-lg border border-border shadow-lg">
          <p className="text-xs text-muted-foreground mb-1">
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="font-medium text-sm">
            ₹{payload[0].value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  const renderCustomizedDot = (props: any) => {
    const { cx, cy, index, dataKey } = props;
    
    // Only show dot for the last data point
    if (index === data.length - 1) {
      return (
        <svg x={cx - 6} y={cy - 6} width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="5" fill={isPriceUp ? 'var(--market-increase)' : 'var(--market-decrease)'} stroke="var(--background)" strokeWidth="1.5" />
        </svg>
      );
    }
    return null;
  };

  // Format the current price for display
  const formattedPrice = typeof currentPrice === 'number' 
    ? currentPrice.toFixed(2) 
    : 'N/A';
  
  return (
    <div className={cn("w-full chart-container", className)} ref={chartRef}>
      {currentPrice !== null && (
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-semibold">₹{formattedPrice}</span>
          <span className={cn(
            "text-sm font-medium",
            isPriceUp ? "text-market-increase" : "text-market-decrease"
          )}>
            {isPriceUp ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </span>
        </div>
      )}
      
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              minTickGap={30}
            />
            <YAxis 
              domain={['dataMin', 'dataMax']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              orientation="right"
              mirror
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPriceUp ? 'var(--market-increase)' : 'var(--market-decrease)'} 
              dot={false}
              activeDot={{ r: 4, fill: isPriceUp ? 'var(--market-increase)' : 'var(--market-decrease)' }}
              strokeWidth={1.5}
              isAnimationActive={false}
              animationDuration={0}
              animationEasing="linear"
              connectNulls
              dot={renderCustomizedDot}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {showControls && (
        <div className="flex justify-center gap-2 mt-4">
          {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((range) => (
            <button
              key={range}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                timeRange === range 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceChart;
