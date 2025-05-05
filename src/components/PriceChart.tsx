
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Bar, BarChart, ComposedChart
} from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface PriceChartProps {
  data: {
    timestamp: string;
    price: number;
    volume?: number;
    high?: number;
    low?: number;
  }[];
  timeframe?: string;
  showControls?: boolean;
  height?: number | string;
  currentPrice?: number;
  previousPrice?: number;
  showGridLines?: boolean;
  tooltipVisible?: boolean;
  areaChart?: boolean;
  showVolume?: boolean;
  enhancedTooltip?: boolean;
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
  showVolume = false,
  enhancedTooltip = false,
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
  
  const EnhancedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const priceData = payload.find((p: any) => p.dataKey === 'price');
      const volumeData = payload.find((p: any) => p.dataKey === 'volume');
      const highData = payload.find((p: any) => p.dataKey === 'high');
      const lowData = payload.find((p: any) => p.dataKey === 'low');
      
      const price = priceData?.value;
      const volume = volumeData?.value;
      const high = highData?.value;
      const low = lowData?.value;
      
      return (
        <div className="custom-tooltip bg-[#1A1F2C]/95 backdrop-blur-md border border-gray-800 px-3 py-2 rounded-md shadow-xl">
          <div className="text-xs font-medium text-gray-300 mb-1">
            {payload[0].payload.timestamp && formatDate(payload[0].payload.timestamp)}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-4">
              <span className="text-xs text-gray-400">Price:</span>
              <span className="text-xs font-medium text-white">{formatPrice(price)}</span>
            </div>
            {high && (
              <div className="flex justify-between gap-4">
                <span className="text-xs text-gray-400">High:</span>
                <span className="text-xs font-medium text-market-increase">{formatPrice(high)}</span>
              </div>
            )}
            {low && (
              <div className="flex justify-between gap-4">
                <span className="text-xs text-gray-400">Low:</span>
                <span className="text-xs font-medium text-market-decrease">{formatPrice(low)}</span>
              </div>
            )}
            {volume && (
              <div className="flex justify-between gap-4">
                <span className="text-xs text-gray-400">Volume:</span>
                <span className="text-xs font-medium text-blue-400">${volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };
  
  const SimpleTooltip = ({ active, payload }: any) => {
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

  // Determine which type of chart to render
  const renderChart = () => {
    if (showVolume) {
      return (
        <ComposedChart data={data}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />}
          <XAxis 
            dataKey="timestamp" 
            tick={false} 
            axisLine={{ stroke: '#333' }} 
            padding={{ left: 5, right: 5 }}
          />
          <YAxis 
            yAxisId="price" 
            domain={['auto', 'auto']} 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 10, fill: '#999' }}
            orientation="right"
            width={40}
          />
          <YAxis 
            yAxisId="volume" 
            domain={[0, 'dataMax']} 
            hide 
          />
          {enhancedTooltip ? 
            <Tooltip content={<EnhancedTooltip />} cursor={{ stroke: '#555', strokeDasharray: '3 3' }} /> : 
            tooltipVisible && <Tooltip content={<SimpleTooltip />} />
          }
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isIncreasing ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
              <stop offset="95%" stopColor={isIncreasing ? "#22c55e" : "#ef4444"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area 
            yAxisId="price"
            type="monotone" 
            dataKey="price" 
            stroke={isIncreasing ? "#22c55e" : "#ef4444"} 
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorGradient)"
            activeDot={{ r: 4, fill: isIncreasing ? "#22c55e" : "#ef4444" }}
          />
          {data[0]?.high && (
            <>
              <Line 
                yAxisId="price"
                type="monotone" 
                dataKey="high" 
                stroke="#22c55e" 
                strokeWidth={1}
                dot={false}
                strokeDasharray="3 3"
                activeDot={false}
              />
              <Line 
                yAxisId="price"
                type="monotone" 
                dataKey="low" 
                stroke="#ef4444" 
                strokeWidth={1}
                dot={false}
                strokeDasharray="3 3"
                activeDot={false}
              />
            </>
          )}
          <Bar 
            yAxisId="volume" 
            dataKey="volume" 
            fill="#3b82f6" 
            opacity={0.3} 
            barSize={6}
          />
        </ComposedChart>
      );
    } else if (areaChart) {
      return (
        <AreaChart data={data}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
          <XAxis 
            dataKey="timestamp" 
            tick={false} 
            axisLine={{ stroke: '#333' }} 
          />
          <YAxis domain={['auto', 'auto']} hide />
          {enhancedTooltip ? 
            <Tooltip content={<EnhancedTooltip />} cursor={{ stroke: '#555', strokeDasharray: '3 3' }} /> : 
            tooltipVisible && <Tooltip content={<SimpleTooltip />} />
          }
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
      );
    } else {
      return (
        <LineChart data={data}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
          <XAxis 
            dataKey="timestamp" 
            tick={false} 
            axisLine={{ stroke: '#333' }} 
          />
          <YAxis domain={['auto', 'auto']} hide />
          {enhancedTooltip ? 
            <Tooltip content={<EnhancedTooltip />} cursor={{ stroke: '#555', strokeDasharray: '3 3' }} /> : 
            tooltipVisible && <Tooltip content={<SimpleTooltip />} />
          }
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
      );
    }
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
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
