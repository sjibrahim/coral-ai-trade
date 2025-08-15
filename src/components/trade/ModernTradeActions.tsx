
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Zap, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModernTradeActionsProps {
  symbol: string;
  currentPrice: number;
  onTrade?: (type: 'call' | 'put', amount: number, duration: number) => void;
}

const ModernTradeActions: React.FC<ModernTradeActionsProps> = ({
  symbol,
  currentPrice,
  onTrade
}) => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [activeType, setActiveType] = useState<'call' | 'put' | null>(null);

  const amounts = [50, 100, 250, 500, 1000, 2500];
  const durations = [30, 60, 120, 300];

  const handleTrade = (type: 'call' | 'put') => {
    setActiveType(type);
    onTrade?.(type, selectedAmount, selectedDuration);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Amount Selection */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Investment Amount
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {amounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                selectedAmount === amount
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-card hover:bg-card/80 text-foreground border border-border/50'
              }`}
            >
              ₹{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Trade Duration
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {durations.map((duration) => (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                selectedDuration === duration
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {duration}s
            </button>
          ))}
        </div>
      </div>

      {/* Trade Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => handleTrade('call')}
          disabled={activeType !== null}
          className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 h-auto flex flex-col gap-1 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>CALL</span>
          </div>
          <span className="text-xs opacity-90">Price will rise</span>
          {activeType === 'call' && (
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          )}
        </Button>

        <Button
          onClick={() => handleTrade('put')}
          disabled={activeType !== null}
          className="relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-4 h-auto flex flex-col gap-1 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            <span>PUT</span>
          </div>
          <span className="text-xs opacity-90">Price will fall</span>
          {activeType === 'put' && (
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          )}
        </Button>
      </div>

      {/* Trade Summary */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Investment:</span>
          <span className="font-medium">₹{selectedAmount}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-muted-foreground">Potential Return:</span>
          <span className="font-medium text-green-400">₹{(selectedAmount * 1.8).toFixed(0)}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium">{selectedDuration}s</span>
        </div>
      </div>
    </div>
  );
};

export default ModernTradeActions;
