
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Bar, BarChart, ComposedChart, ReferenceLine
} from 'recharts';
import { ArrowUp, ArrowDown, Maximize, Minimize, ChevronLeft, X } from 'lucide-react';

interface ChartDataPoint {
  timestamp: string;
  price: number;
  volume?: number;
  high?: number;
  low?: number;
}

interface MobileOptimizedChartProps {
  data: ChartDataPoint[];
  timeframe?: string;
  currentPrice?: number;
  previousPrice?: number;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  onClose?: () => void;
  symbol?: string;
}

const MobileOptimizedChart = ({
  data,
  timeframe = '24h',
  currentPrice,
  previousPrice,
  onToggleFullscreen,
  isFullscreen = false,
  onClose,
  symbol = "BTC"
}: MobileOptimizedChartProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [isIncreasing, setIsIncreasing] = useState<boolean | null>(null);
  
  // Determine if price is increasing or decreasing
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
  
  const calculatePercentageChange = (currentPrice: number, previousPrice: number) => {
    const change = ((currentPrice - previousPrice) / previousPrice) * 100;
    return change.toFixed(2);
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  const formatFullDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Get min and max values for better scaling
  const priceMin = useMemo(() => Math.min(...data.map(d => d.price)) * 0.99, [data]);
  const priceMax = useMemo(() => Math.max(...data.map(d => d.price)) * 1.01, [data]);
  
  // Custom tooltip component with improved design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const price = payload.find((p: any) => p.dataKey === 'price')?.value;
      const volume = payload.find((p: any) => p.dataKey === 'volume')?.value;
      const high = payload.find((p: any) => p.dataKey === 'high')?.value;
      const low = payload.find((p: any) => p.dataKey === 'low')?.value;
      const timestamp = payload[0]?.payload?.timestamp;
      
      return (
        <div className="bg-[#1A1F2C]/95 backdrop-blur-md border border-gray-800 px-4 py-3 rounded-lg shadow-xl">
          <div className="text-sm font-medium text-gray-200 mb-2">
            {timestamp && formatFullDate(timestamp)}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between gap-6">
              <span className="text-sm text-gray-400">Price:</span>
              <span className="text-sm font-medium text-white">{price && formatPrice(price)}</span>
            </div>
            {high && (
              <div className="flex justify-between gap-6">
                <span className="text-sm text-gray-400">High:</span>
                <span className="text-sm font-medium text-green-500">{formatPrice(high)}</span>
              </div>
            )}
            {low && (
              <div className="flex justify-between gap-6">
                <span className="text-sm text-gray-400">Low:</span>
                <span className="text-sm font-medium text-red-500">{formatPrice(low)}</span>
              </div>
            )}
            {volume && (
              <div className="flex justify-between gap-6">
                <span className="text-sm text-gray-400">Volume:</span>
                <span className="text-sm font-medium text-blue-400">${volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full h-full ${isFullscreen ? 'fullscreen-chart' : ''}`}>
      {isFullscreen ? (
        <div className="w-full h-full flex flex-col">
          {/* Fullscreen header */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#14151F]/95 backdrop-blur-md border-b border-gray-800 mb-2">
            <div className="flex items-center">
              <button 
                onClick={onClose}
                className="mr-2 p-2 rounded-full hover:bg-gray-800"
              >
                <ChevronLeft className="h-5 w-5 text-gray-400" />
              </button>
              <h3 className="text-lg font-bold text-white">{symbol}/USD Chart</h3>
            </div>
            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-full hover:bg-gray-800"
              aria-label="Exit fullscreen"
            >
              <Minimize className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          
          {/* Price display */}
          <div className="px-4 flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {typeof currentPrice === 'number' ? formatPrice(currentPrice) : currentPrice}
              </h2>
              {previousPrice && (
                <div className={`flex items-center ${isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="mr-1">
                    {isIncreasing ? (
                      <ArrowUp className="h-3 w-3 inline" />
                    ) : (
                      <ArrowDown className="h-3 w-3 inline" />
                    )}
                  </span>
                  <span className="text-sm">
                    {calculatePercentageChange(
                      typeof currentPrice === 'number' ? currentPrice : 0,
                      typeof previousPrice === 'number' ? previousPrice : 0
                    )}%
                  </span>
                </div>
              )}
            </div>
            
            {/* Timeframe selector */}
            <div className="flex space-x-2">
              {['1h', '24h', '7d', '30d'].map(tf => (
                <button
                  key={tf}
                  onClick={() => handleTimeframeChange(tf)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    selectedTimeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1A1F2C] text-gray-300 hover:bg-[#252A39]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          {/* Main chart area */}
          <div className="flex-1 mt-4 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isIncreasing ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isIncreasing ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3348" vertical={false} opacity={0.6} />
                
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                  axisLine={{ stroke: '#2D3348' }}
                  tickFormatter={formatDate}
                  padding={{ left: 0, right: 5 }}
                />
                
                <YAxis 
                  yAxisId="price"
                  domain={[priceMin, priceMax]} 
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  tickFormatter={formatPrice}
                  axisLine={false}
                  tickLine={false}
                  width={75}
                />
                
                <YAxis 
                  yAxisId="volume"
                  domain={[0, 'dataMax']} 
                  orientation="left"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ 
                    stroke: '#8884d8', 
                    strokeWidth: 1, 
                    strokeDasharray: '5 5', 
                    strokeOpacity: 0.6 
                  }}
                  wrapperStyle={{ zIndex: 100 }}
                />
                
                <Area
                  yAxisId="price"
                  type="monotone"
                  dataKey="price"
                  stroke={isIncreasing ? "#22c55e" : "#ef4444"}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGradient)"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff", fill: isIncreasing ? "#22c55e" : "#ef4444" }}
                />
                
                {data[0]?.high && (
                  <>
                    <Line
                      yAxisId="price"
                      type="monotone"
                      dataKey="high"
                      stroke="#22c55e"
                      strokeWidth={1.5}
                      dot={false}
                      strokeDasharray="3 3"
                      activeDot={false}
                    />
                    <Line
                      yAxisId="price"
                      type="monotone"
                      dataKey="low"
                      stroke="#ef4444"
                      strokeWidth={1.5}
                      dot={false}
                      strokeDasharray="3 3"
                      activeDot={false}
                    />
                  </>
                )}
                
                <Bar
                  yAxisId="volume"
                  dataKey="volume"
                  fill="url(#volumeGradient)"
                  opacity={0.7}
                  barSize={12}
                  radius={[2, 2, 0, 0]}
                />
                
                {/* Current price reference line */}
                {currentPrice && (
                  <ReferenceLine 
                    yAxisId="price"
                    y={currentPrice} 
                    stroke={isIncreasing ? "#22c55e" : "#ef4444"}
                    strokeDasharray="3 3" 
                    strokeWidth={1.5}
                    label={{
                      position: 'right',
                      value: 'Current',
                      fill: isIncreasing ? "#22c55e" : "#ef4444",
                      fontSize: 10
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        // Non-fullscreen compact view
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <div>
              <h2 className="text-xl font-bold">
                {typeof currentPrice === 'number' ? formatPrice(currentPrice) : currentPrice}
              </h2>
              {previousPrice && (
                <div className={`flex items-center ${isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="mr-1">
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
            
            {onToggleFullscreen && (
              <button 
                onClick={onToggleFullscreen}
                className="p-1.5 rounded-full bg-[#1A1F2C] hover:bg-[#252A39]"
                aria-label="Enter fullscreen"
              >
                <Maximize className="h-4 w-4 text-gray-300" />
              </button>
            )}
          </div>
          
          <div style={{ height: 200, width: '100%' }} className="mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isIncreasing ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isIncreasing ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                
                <YAxis domain={['auto', 'auto']} hide />
                
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#8884d8', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isIncreasing ? "#22c55e" : "#ef4444"}
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorGradient)"
                  activeDot={{ r: 4, fill: isIncreasing ? "#22c55e" : "#ef4444" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex space-x-1.5 justify-center">
            {['1h', '24h', '7d', '30d'].map(tf => (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs ${
                  selectedTimeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1A1F2C] text-gray-300 hover:bg-[#252A39]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedChart;
