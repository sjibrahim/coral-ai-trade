
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
}

const calculatePercentageChange = (currentPrice: number, previousPrice: number) => {
  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  return change.toFixed(2);
};

const formatDate = (timestamp: string) => {
  return timestamp; // Already formatted from the parent component
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const priceValue = payload[0].value;
      const priceFormatted = typeof priceValue === 'number' 
        ? formatPrice(priceValue) 
        : priceValue;
      
      return (
        <div className="custom-tooltip bg-[#1E2235]/90 backdrop-blur-sm border border-[#252A43]/70 p-2 rounded-md shadow-md">
          <p className="text-xs font-medium text-white">{priceFormatted}</p>
          {payload[0].payload.timestamp && (
            <p className="text-xs text-gray-400">{payload[0].payload.timestamp}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      {/* Price Statistics */}
      {currentPrice && showControls && (
        <div className="flex justify-between items-baseline mb-2">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {typeof currentPrice === 'number' ? formatPrice(currentPrice) : currentPrice}
            </h2>
            {previousPrice && (
              <div className={`flex items-center ${isIncreasing ? 'text-green-400' : 'text-red-400'}`}>
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
                      ? 'bg-[#252A43] text-white'
                      : 'bg-[#151824] text-gray-400 hover:bg-[#1A1F2C]'
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
      <div style={{ height: height, width: '100%' }} className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {areaChart ? (
            <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              {showGridLines && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#252A43" 
                  opacity={0.5}
                />
              )}
              <XAxis 
                dataKey="timestamp" 
                tick={false} 
                axisLine={{ stroke: '#252A43' }} 
                opacity={0.5}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 10, fill: '#666' }} 
                axisLine={false}
                tickLine={false}
                dx={-5}
              />
              {tooltipVisible && <Tooltip content={<CustomTooltip />} />}
              
              {/* Reference line at current price */}
              {currentPrice && (
                <ReferenceLine 
                  y={currentPrice} 
                  stroke={isIncreasing ? "#22c55e" : "#ef4444"} 
                  strokeWidth={1} 
                  strokeDasharray="3 3" 
                />
              )}
              
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
                animationDuration={300}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              {showGridLines && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#252A43" 
                  opacity={0.5}
                />
              )}
              <XAxis 
                dataKey="timestamp" 
                tick={false} 
                axisLine={{ stroke: '#252A43' }} 
                opacity={0.5}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 10, fill: '#666' }} 
                axisLine={false}
                tickLine={false}
                dx={-5}
              />
              {tooltipVisible && <Tooltip content={<CustomTooltip />} />}
              
              {/* Reference line at current price */}
              {currentPrice && (
                <ReferenceLine 
                  y={currentPrice} 
                  stroke={isIncreasing ? "#22c55e" : "#ef4444"} 
                  strokeWidth={1} 
                  strokeDasharray="3 3" 
                />
              )}
              
              <Line
                type="monotone"
                dataKey="price"
                stroke={isIncreasing ? "#22c55e" : "#ef4444"}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: isIncreasing ? "#22c55e" : "#ef4444" }}
                animationDuration={300}
                animationEasing="ease-in-out"
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
