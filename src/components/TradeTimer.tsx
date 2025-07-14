
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check, TrendingUp, TrendingDown, IndianRupee, Clock } from 'lucide-react';
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
  const circumference = 2 * Math.PI * 50; // 50 is the radius of the circle
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
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!open) return null;

  if (isCompleted) {
    // Trade Result Modal - Mobile Optimized
    return (
      <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="w-[95vw] max-w-sm mx-auto bg-white border-none rounded-2xl text-gray-900 p-0">
          <div className="relative overflow-hidden">
            {/* Background gradient */}
            <div className={`absolute inset-0 ${
              result.type === 'Profit' 
                ? 'bg-gradient-to-br from-green-50 to-emerald-100' 
                : 'bg-gradient-to-br from-red-50 to-rose-100'
            }`} />
            
            {/* Content */}
            <div className="relative p-6">
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
              
              {/* Result display */}
              <div className="text-center pt-4">
                {/* Result icon */}
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  result.type === 'Profit' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {result.type === 'Profit' ? (
                    <TrendingUp className="h-10 w-10 text-white" />
                  ) : (
                    <TrendingDown className="h-10 w-10 text-white" />
                  )}
                </div>
                
                {/* Result text */}
                <h2 className={`text-2xl font-bold mb-2 ${
                  result.type === 'Profit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.type === 'Profit' ? 'Trade Won!' : 'Trade Lost'}
                </h2>
                
                {/* Amount */}
                <div className="mb-6">
                  <div className={`text-4xl font-bold flex items-center justify-center gap-1 ${
                    result.type === 'Profit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <IndianRupee className="h-8 w-8" />
                    <span>{Math.floor(result.value || 0)}</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {result.type === 'Profit' ? 'Profit earned' : 'Amount lost'}
                  </p>
                </div>
                
                {/* Trade details */}
                <div className="bg-white/70 rounded-xl p-4 mb-6 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Trade Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Direction:</span>
                      <span className={`font-medium ${
                        direction === 'Call' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {direction}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entry Price:</span>
                      <span className="font-medium">${startPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exit Price:</span>
                      <span className="font-medium">${endPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Change:</span>
                      <span className={`font-medium ${priceDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {priceDifference >= 0 ? '+' : ''}{priceDifference.toFixed(2)} ({percentageChange.toFixed(2)}%)
                      </span>
                    </div>
                    {tradeApiResponse?.trade_amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Investment:</span>
                        <span className="font-medium">₹{tradeApiResponse.trade_amount}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action button */}
                <Button 
                  className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium"
                  onClick={handleClose}
                >
                  Continue Trading
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Trade Progress Modal - Mobile Optimized
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[95vw] max-w-sm mx-auto bg-white border-none rounded-2xl text-gray-900 p-0">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-900">Trade in Progress</h2>
            </div>
            <p className="text-gray-600 text-sm">
              {direction} trade on {startPrice.toFixed(2)} USD
            </p>
          </div>

          {/* Timer Circle */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                fill="transparent" 
                stroke="#f3f4f6" 
                strokeWidth="8"
              />
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                fill="transparent" 
                stroke="#3b82f6" 
                strokeWidth="8" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{timeRemaining}</span>
              <span className="text-sm text-gray-500">seconds</span>
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Start Price</span>
              <span className="font-medium">${startPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Current Price</span>
              <span className="font-medium">${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Change</span>
              <span className={`font-medium ${
                (currentPrice - startPrice) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(currentPrice - startPrice) >= 0 ? '+' : ''}{(currentPrice - startPrice).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Status indicator */}
          <div className={`p-3 rounded-xl text-center ${
            direction === 'Call' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <p className={`text-sm font-medium ${
              direction === 'Call' ? 'text-green-700' : 'text-red-700'
            }`}>
              Waiting for {direction} trade to complete...
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeTimer;
