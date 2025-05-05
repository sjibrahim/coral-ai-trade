
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  data: {
    timestamp: number;
    price: number;
  }[];
  period?: '1H' | '24H' | '7D' | '30D' | 'ALL';
  percentChange: number;
  currentPrice: number;
  height?: number | string;
  lineColor?: string;
  showLabels?: boolean;
  showGrid?: boolean;
  className?: string;
  showCurrentPriceMarker?: boolean;
  showTooltip?: boolean;
}

const PriceChart = ({
  data,
  percentChange,
  currentPrice,
  height = 150,
  lineColor,
  showLabels = false,
  showGrid = false,
  className,
  showCurrentPriceMarker = true,
  showTooltip = false,
}: PriceChartProps) => {
  const chartData = data.map(item => ({
    timestamp: item.timestamp,
    price: item.price,
  }));

  const color = lineColor || (percentChange >= 0 ? 'hsl(var(--market-increase))' : 'hsl(var(--market-decrease))');
  const strokeWidth = 1.5;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-md border border-border/40 p-2 rounded-md text-xs shadow-lg">
          <p className="text-foreground">${parseFloat(payload[0].value).toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Safe formatting for reference line label
  const formatReferenceLinePrice = (value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return String(value);
  };

  return (
    <div className={cn("w-full overflow-hidden", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          {showLabels && (
            <>
              <XAxis 
                dataKey="timestamp" 
                hide={!showLabels} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis 
                hide={!showLabels}
                domain={['dataMin', 'dataMax']}
                axisLine={false}
                tickLine={false}
                tickCount={3}
                tickFormatter={(value) => `$${value}`}
              />
            </>
          )}
          {showCurrentPriceMarker && (
            <ReferenceLine 
              y={currentPrice} 
              stroke={color} 
              strokeDasharray="3 3"
              strokeOpacity={0.7}
              label={{
                position: 'left',
                fill: color,
                fontSize: 10,
                value: `$${formatReferenceLinePrice(currentPrice)}`,
                backgroundColor: '#000'
              }}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={strokeWidth}
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: 'white', strokeWidth: 1 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
