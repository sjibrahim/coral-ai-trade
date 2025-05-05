import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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
  showHorizontalLine?: boolean;
  currentPriceLabel?: string;
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
  showHorizontalLine = false,
  currentPriceLabel,
}: PriceChartProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [isIncreasing, setIsIncreasing] = useState<boolean | null>(null);

  // Generate time labels for the chart based on current time
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  
  useEffect(() => {
    if (currentPrice && previousPrice) {
      setIsIncreasing(currentPrice > previousPrice);
    } else if (data.length > 1) {
      setIsIncreasing(data[data.length - 1].price > data[0].price);
    }
    
    // Generate time labels
    const now = new Date();
    const labels = [];
    
    // Go back in time based on the number of data points
    for (let i = data.length; i >= 0; i -= Math.ceil(data.length / 6)) {
      const time = new Date(now.getTime() - (i * 60000));
      labels.push(`${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`);
    }
    
    setTimeLabels(labels);
    
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

  // Custom tick formatter for Y axis
  const formatYAxis = (value: number) => {
    return `${value.toFixed(0)}.00`;
  };

  // Custom tick formatter for X axis to show time
  const formatXAxis = (value: string, index: number) => {
    // Use pre-generated time labels if available
    if (timeLabels.length > index) {
      return timeLabels[index];
    }
    return formatDate(value);
  };

  // Modified chart style to match the reference image
  return (
    <div className="w-full h-full relative">
      {/* Price Statistics */}
      {currentPrice && showControls && (
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
      <div style={{ height: height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {timeframe === 'Area' || areaChart ? (
            <AreaChart data={data}>
              {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
              <XAxis 
                dataKey="timestamp"
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={formatXAxis}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                orientation="right"
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={formatYAxis}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              {tooltipVisible && <Tooltip content={<CustomTooltip />} />}
              {showHorizontalLine && currentPrice && (
                <ReferenceLine 
                  y={currentPrice} 
                  stroke="#F25F5C" 
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{ 
                    value: currentPriceLabel || currentPrice?.toString(), 
                    position: 'right',
                    fill: '#F25F5C',
                    fontSize: 12
                  }} 
                />
              )}
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGradient)"
                activeDot={{ r: 4, fill: "#3b82f6" }}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={formatXAxis}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                orientation="right"
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={formatYAxis}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              {tooltipVisible && <Tooltip content={<CustomTooltip />} />}
              {showHorizontalLine && currentPrice && (
                <ReferenceLine 
                  y={currentPrice} 
                  stroke="#F25F5C" 
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{ 
                    value: currentPriceLabel || currentPrice?.toString(), 
                    position: 'right',
                    fill: '#F25F5C',
                    fontSize: 12
                  }} 
                />
              )}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6" }}
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
