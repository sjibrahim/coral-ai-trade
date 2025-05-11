
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TradeTimerProps {
  open: boolean;
  onClose: () => void;
  duration: number;
  direction: 'Call' | 'Put';
  startPrice: number;
  onComplete: (currentPrice: number) => void;
  currentPrice: number;
}

const TradeTimer: React.FC<TradeTimerProps> = ({
  open,
  onClose,
  duration,
  direction,
  startPrice,
  onComplete,
  currentPrice,
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
            
            // Determine profit/loss
            const priceDifference = currentPrice - startPrice;
            const isProfit = (direction === 'Call' && priceDifference > 0) || 
                            (direction === 'Put' && priceDifference < 0);
            
            setResult({
              value: Math.abs(priceDifference * 100), // Sample calculation
              type: isProfit ? 'Profit' : 'Loss'
            });
            
            onComplete(currentPrice);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [open, duration, direction, currentPrice, startPrice, onComplete, isCompleted, timeRemaining]);

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
      <DialogContent className="bg-[#1E2032] border-none max-w-[300px] rounded-2xl text-white">
        {isCompleted ? (
          // Result display styled like timer modal
          <div className="flex flex-col items-center justify-center py-10 relative">
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
            
            <div className={`text-7xl font-bold mb-10 ${
              result.type === 'Profit' ? 'text-market-increase' : 'text-market-decrease'
            }`}>
              {result.type === 'Loss' ? '-' : '+'}
              {Math.floor(result.value || 0)}
            </div>
            
            <Button 
              className="w-full py-6 px-4 text-lg rounded-lg bg-[#2C2F3E] hover:bg-[#3A3E52] border-none"
              onClick={handleClose}
            >
              Go to Home
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
              <p className="text-gray-400">Starting price: ${startPrice.toFixed(2)}</p>
              <p className="text-gray-400">Current price: ${currentPrice.toFixed(2)}</p>
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
