
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface PriceChartProps {
  data: {
    timestamp: string;
    price: number;
  }[];
  timeframe?: string;
  showControls?: boolean;
  height?: number | string;
  currentPrice?: number;
  previousPrice?: number;
  showGridLines?: boolean;
  tooltipVisible?: boolean;
  areaChart?: boolean;
}

const calculatePercentageChange = (currentPrice: number, previousPrice: number) => {
  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  return change.toFixed(2);
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const PriceChart = ({
  data,
  timeframe = '24h',
  showControls = true,
  height = 180,
  currentPrice,
  previousPrice,
  showGridLines = false,
  tooltipVisible = true,
  areaChart = false,
}: PriceChartProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [isIncreasing, setIsIncreasing] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentPrice && previousPrice) {
      setIsIncreasing(currentPrice > previousPrice);
    } else if (data.length > 1) {
      setIsIncreasing(data[data.length - 1].price > data[0].price);
    }
  }, [currentPrice, previousPrice, data]);

  const handleTimeframeChange = (newTimeframe: string) => {
    setSelectedTimeframe(newTimeframe);
    // In a real app, this would fetch new data based on timeframe
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString()}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  const renderCustomizedDot = (props: any) => {
    const { cx, cy, index } = props;
    
    // Only show dots at certain intervals or at the end
    if (index === data.length - 1 || index % Math.ceil(data.length / 5) === 0) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill={isIncreasing ? "#22c55e" : "#ef4444"}
          stroke={isIncreasing ? "#22c55e" : "#ef4444"}
          strokeWidth={1}
        />
      );
    }
    return null;
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const priceValue = payload[0].value;
      const priceFormatted = typeof priceValue === 'number' 
        ? formatPrice(priceValue) 
        : priceValue;
      
      return (
        <div className="custom-tooltip bg-background/80 backdrop-blur-sm border border-border p-2 rounded-md shadow-md">
          <p className="text-xs font-medium">{priceFormatted}</p>
          {payload[0].payload.timestamp && (
            <p className="text-xs text-muted-foreground">{formatDate(payload[0].payload.timestamp)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Price Statistics */}
      {currentPrice && (
        <div className="flex justify-between items-baseline mb-2">
          <div>
            <h2 className="text-2xl font-bold">
              {typeof currentPrice === 'number' ? formatPrice(currentPrice) : currentPrice}
            </h2>
            {previousPrice && (
              <div className={`flex items-center ${isIncreasing ? 'text-market-increase' : 'text-market-decrease'}`}>
                <span className="text-sm mr-1">
                  {isIncreasing ? (
                    <ArrowUp className="h-3 w-3 inline" />
                  ) : (
                    <ArrowDown className="h-3 w-3 inline" />
                  )}
                </span>
                <span className="text-xs">
                  {calculatePercentageChange(
                    typeof currentPrice === 'number' ? currentPrice : 0,
                    typeof previousPrice === 'number' ? previousPrice : 0
                  )}%
                </span>
              </div>
            )}
          </div>
          
          {/* Timeframe controls */}
          {showControls && (
            <div className="flex space-x-1.5 text-xs">
              {['1h', '24h', '7d', '30d'].map(tf => (
                <button
                  key={tf}
                  onClick={() => handleTimeframeChange(tf)}
                  className={`px-2 py-1 rounded-md ${
                    selectedTimeframe === tf
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground hover:bg-accent/80'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {areaChart ? (
            <AreaChart data={data}>
              {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
              <XAxis 
                dataKey="timestamp" 
                tick={false} 
                axisLine={{ stroke: '#333' }} 
              />
              <YAxis domain={['auto', 'auto']} hide />
              {tooltipVisible && <Tooltip content={<CustomTooltip />} />}
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isIncreasing ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isIncreasing ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isIncreasing ? "#22c55e" : "#ef4444"} 
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorGradient)"
                activeDot={{ r: 4, fill: isIncreasing ? "#22c55e" : "#ef4444" }}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
              <XAxis 
                dataKey="timestamp" 
                tick={false} 
                axisLine={{ stroke: '#333' }} 
              />
              <YAxis domain={['auto', 'auto']} hide />
              {tooltipVisible && <Tooltip content={<CustomTooltip />} />}
              <Line
                type="monotone"
                dataKey="price"
                stroke={isIncreasing ? "#22c55e" : "#ef4444"}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: isIncreasing ? "#22c55e" : "#ef4444" }}
                animationDuration={500}
                animationEasing="linear"
                connectNulls
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
