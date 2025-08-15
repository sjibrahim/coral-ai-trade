
import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, TrendingUp, TrendingDown } from 'lucide-react';

interface LiveTradeChartProps {
  symbol: string;
  currentPrice?: number;
  change?: number;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const LiveTradeChart: React.FC<LiveTradeChartProps> = ({
  symbol,
  currentPrice,
  change,
  onToggleFullscreen,
  isFullscreen = false
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
      // Send symbol to iframe
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'UPDATE_SYMBOL', symbol },
          '*'
        );
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [symbol]);

  const handleFullscreenToggle = () => {
    onToggleFullscreen?.();
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'w-full'}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">{symbol}</span>
            {currentPrice && (
              <span className="text-sm text-muted-foreground">₹{currentPrice.toLocaleString()}</span>
            )}
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              change >= 0 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>
        
        <button
          onClick={handleFullscreenToggle}
          className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-muted-foreground">Loading chart...</span>
          </div>
        </div>
      )}

      {/* Live Chart */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-64 md:h-80'}`}>
        <iframe
          ref={iframeRef}
          src="/trade-graph.html"
          className="w-full h-full border-0"
          title={`${symbol} Live Chart`}
        />
      </div>
    </div>
  );
};

export default LiveTradeChart;
