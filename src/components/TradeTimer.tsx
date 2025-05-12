
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, CircleArrowRight, Check, IndianRupee } from 'lucide-react';

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
  
  // Calculate the progress for the circular timer
  const progress = (duration - timeRemaining) / duration;
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle

  useEffect(() => {
    if (!open) return;
    
    // Don't reset state if we're showing the completed result
    if (!isCompleted && timeRemaining === 0) {
      setTimeRemaining(duration);
    }
    
    // Only start the timer if not completed
    if (!isCompleted) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCompleted(true);
            
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
              
              console.log('Trade completed with result:', {
                isProfit,
                resultValue,
                tradeApiResponse
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
  }, [open, duration, direction, currentPrice, startPrice, onComplete, isCompleted, timeRemaining, tradeApiResponse]);

  // Reset state when modal is closed
  const handleClose = () => {
    onClose();
    // Delay the reset to prevent flickering during close animation
    setTimeout(() => {
      setIsCompleted(false);
      setTimeRemaining(duration);
      setResult({ value: null, type: null });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-[#1E2032] border-none max-w-[300px] mx-auto rounded-2xl text-white">
        {isCompleted ? (
          // Redesigned result screen based on the image
          <div className="flex flex-col items-center justify-center py-6 relative">
            {/* Close button */}
            <div className="absolute top-2 right-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 bg-gray-700/50 hover:bg-gray-600/50"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Result icon circle */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              result.type === 'Profit' ? 'bg-green-900/30' : 'bg-red-900/30'
            }`}>
              <Check className={`h-12 w-12 ${
                result.type === 'Profit' ? 'text-green-500' : 'text-red-500'
              }`} />
            </div>
            
            {/* Result title */}
            <div className="text-center mb-6">
              <h2 className="text-xl text-gray-300 font-medium mb-4">
                {result.type === 'Profit' ? 'TRADE PROFIT' : 'TRADE LOSS'}
              </h2>
              
              {/* Result amount with INR symbol */}
              <div className="flex items-center justify-center text-6xl font-bold mb-2">
                <div className={`rounded-full bg-green-500/20 p-2 mr-2 ${
                  result.type === 'Profit' ? 'text-green-500' : 'text-red-500'
                }`}>
                  <IndianRupee className="h-10 w-10" />
                </div>
                <span className={
                  result.type === 'Profit' ? 'text-green-500' : 'text-red-500'
                }>{Math.floor(result.value || 0)}</span>
              </div>
            </div>
            
            {/* Price comparison panel */}
            <div className="bg-[#252739] w-full rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Start Price</p>
                  <p className="font-medium">₹{startPrice.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">End Price</p>
                  <p className="font-medium">₹{currentPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {/* Go to Home button */}
            <Button 
              className="bg-[#252739] hover:bg-[#313450] text-white rounded-xl py-3 w-full flex items-center justify-center gap-2"
              onClick={handleClose}
            >
              <span>Go to Home</span>
              <CircleArrowRight className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-36 h-36 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="transparent" 
                  stroke="#2C2F3E" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="transparent" 
                  stroke="#0E6FFF" 
                  strokeWidth="8" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={circumference * (1 - progress)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold">{timeRemaining}</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-gray-400">Starting price: ₹{startPrice.toFixed(2)}</p>
              <p className="text-gray-400">Current price: ₹{currentPrice.toFixed(2)}</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 px-8 py-2 rounded-full text-gray-400 border-gray-700"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TradeTimer;
