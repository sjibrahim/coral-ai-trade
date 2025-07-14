
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

interface TradeTimerProps {
  open: boolean;
  onClose: () => void;
  duration: number;
  direction: 'Call' | 'Put';
  startPrice: number;
  onComplete: (currentPrice: number) => void;
  currentPrice: number;
  tradeApiResponse?: {
    status?: 'win' | 'loss';
    profit?: number;
    lost_amount?: number;
    new_balance?: number;
    trade_amount?: number;
  } | null;
}

const TradeTimer: React.FC<TradeTimerProps> = ({
  open,
  onClose,
  duration,
  direction,
  startPrice,
  onComplete,
  currentPrice,
  tradeApiResponse = null,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<{
    value: number | null;
    type: 'Profit' | 'Loss' | null;
  }>({ value: null, type: null });
  const [endPrice, setEndPrice] = useState(currentPrice);
  const { updateProfile } = useAuth();
  
  // Calculate the progress for the circular timer
  const progress = (duration - timeRemaining) / duration;
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    if (!open) return;
    
    // Reset state when modal opens
    if (timeRemaining === 0 && !isCompleted) {
      setTimeRemaining(duration);
      setIsCompleted(false);
      setResult({ value: null, type: null });
    }
    
    // Only start the timer if not completed
    if (!isCompleted && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCompleted(true);
            setEndPrice(currentPrice);
            
            // When timer completes, check if we have an API response
            if (tradeApiResponse) {
              // Use API response to determine profit/loss
              const isProfit = tradeApiResponse.status === 'win';
              const resultValue = isProfit 
                ? (tradeApiResponse.profit || 0)
                : (tradeApiResponse.lost_amount || 0);
                
              setResult({
                value: resultValue,
                type: isProfit ? 'Profit' : 'Loss'
              });
              
              // Update the user's profile to get the latest wallet balance
              updateProfile().then(() => {
                console.log('Profile updated after trade completion');
              }).catch(error => {
                console.error('Failed to update profile after trade:', error);
              });
            } else {
              // Fallback to calculating from price difference
              const priceDifference = currentPrice - startPrice;
              const isProfit = (direction === 'Call' && priceDifference > 0) || 
                             (direction === 'Put' && priceDifference < 0);
              
              setResult({
                value: Math.abs(priceDifference * 100), // Sample calculation
                type: isProfit ? 'Profit' : 'Loss'
              });
            }
            
            onComplete(currentPrice);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [open, duration, direction, currentPrice, startPrice, onComplete, isCompleted, timeRemaining, tradeApiResponse, updateProfile]);

  // Reset state when modal is closed
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsCompleted(false);
      setTimeRemaining(duration);
      setResult({ value: null, type: null });
    }, 300);
  };

  const priceDifference = endPrice - startPrice;
  const percentageChange = startPrice > 0 ? (priceDifference / startPrice) * 100 : 0;

  if (!open) return null;

  if (isCompleted) {
    // Trade Result Modal - Compact Mobile Design
    return (
      <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="w-[90vw] max-w-sm mx-auto bg-white border-none rounded-3xl p-0 overflow-hidden">
          <div className="relative">
            {/* Background gradient */}
            <div className={`absolute inset-0 ${
              result.type === 'Profit' 
                ? 'bg-gradient-to-br from-green-50 to-emerald-100' 
                : 'bg-gradient-to-br from-red-50 to-rose-100'
            }`} />
            
            {/* Content */}
            <div className="relative p-6 text-center">
              {/* Close button */}
              <div className="absolute top-4 right-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full h-8 w-8 bg-white/80 hover:bg-white"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Result icon */}
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                result.type === 'Profit' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {result.type === 'Profit' ? (
                  <TrendingUp className="h-8 w-8 text-white" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-white" />
                )}
              </div>
              
              {/* Result text */}
              <h2 className={`text-xl font-bold mb-2 ${
                result.type === 'Profit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.type === 'Profit' ? 'Trade Won!' : 'Trade Lost'}
              </h2>
              
              {/* Amount */}
              <div className={`text-3xl font-bold flex items-center justify-center gap-1 mb-4 ${
                result.type === 'Profit' ? 'text-green-600' : 'text-red-600'
              }`}>
                <IndianRupee className="h-6 w-6" />
                <span>{Math.floor(result.value || 0)}</span>
              </div>
              
              {/* Trade details */}
              <div className="bg-white/70 rounded-2xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Direction:</span>
                  <span className={`font-medium ${
                    direction === 'Call' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {direction}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entry:</span>
                  <span className="font-medium">${startPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exit:</span>
                  <span className="font-medium">${endPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Change:</span>
                  <span className={`font-medium ${priceDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceDifference >= 0 ? '+' : ''}{priceDifference.toFixed(2)} ({percentageChange.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              {/* Action button */}
              <Button 
                className="w-full h-12 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-medium"
                onClick={handleClose}
              >
                Continue Trading
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Trade Progress Modal - Compact Mobile Design
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[90vw] max-w-sm mx-auto bg-white border-none rounded-3xl p-0 overflow-hidden">
        <div className="p-6">
          {/* Timer Circle */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="transparent" 
                stroke="#f1f5f9" 
                strokeWidth="6"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="transparent" 
                stroke="#10b981" 
                strokeWidth="6" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
              {/* Animated dots */}
              <circle 
                cx="50" 
                cy="5" 
                r="2" 
                fill="#10b981"
                className="animate-pulse"
                style={{
                  transformOrigin: '50px 50px',
                  animation: 'spin 2s linear infinite'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{timeRemaining}s</span>
              <span className="text-xs text-gray-500">remaining</span>
            </div>
          </div>

          {/* Trade in progress text */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Trade in progress...</h3>
            <p className="text-sm text-gray-500">
              {direction} position active
            </p>
          </div>

          {/* Price Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Direction</p>
              <p className={`text-lg font-bold ${
                direction === 'Call' ? 'text-green-600' : 'text-red-600'
              }`}>
                {direction}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Start Price</p>
              <p className="text-lg font-bold text-gray-900">
                ${startPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Current Price */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-center">
            <p className="text-xs text-blue-600 mb-1">Current Price</p>
            <p className="text-xl font-bold text-blue-700">
              ${currentPrice.toFixed(2)}
            </p>
            <p className={`text-sm font-medium mt-1 ${
              (currentPrice - startPrice) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(currentPrice - startPrice) >= 0 ? '+' : ''}{(currentPrice - startPrice).toFixed(2)}
            </p>
          </div>

          {/* Cancel button */}
          <Button 
            variant="outline"
            className="w-full h-12 rounded-2xl border-2 border-green-500 text-green-600 hover:bg-green-50"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeTimer;
