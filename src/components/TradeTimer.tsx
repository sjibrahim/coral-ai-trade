
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check, IndianRupee } from 'lucide-react';
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
  }, [open, duration, direction, currentPrice, startPrice, onComplete, isCompleted, timeRemaining, tradeApiResponse, updateProfile]);

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

  // Calculate price difference and percentage
  const priceDifference = endPrice - startPrice;
  const percentageChange = startPrice > 0 ? (priceDifference / startPrice) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-[#1E2032] border-none max-w-[300px] mx-auto rounded-2xl text-white">
        {isCompleted ? (
          // Trade result display redesigned to match reference image
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
            
            {/* Result display with more details */}
            <div className="w-full px-6 py-6">
              {/* Profit/Loss indicator */}
              <div className="flex justify-center mb-4">
                <div className={`rounded-full p-2 ${
                  result.type === 'Profit' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {result.type === 'Profit' ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              
              {/* Amount with INR symbol */}
              <div className="text-center">
                <h2 className={`text-5xl font-bold flex items-center justify-center gap-1 ${
                  result.type === 'Profit' ? 'text-green-500' : 'text-red-500'
                }`}>
                  <IndianRupee className="h-7 w-7" />
                  <span>{Math.floor(result.value || 0)}</span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {result.type === 'Profit' ? 'Profit' : 'Loss'}
                </p>
              </div>
              
              {/* Price details */}
              <div className="mt-4 pt-4 border-t border-gray-800/50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Start Price:</span>
                  <span className="text-gray-200">${startPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">End Price:</span>
                  <span className="text-gray-200">${endPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Change:</span>
                  <span className={`${priceDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {priceDifference >= 0 ? '+' : ''}{priceDifference.toFixed(2)} ({percentageChange.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Home button - made smaller and more elegant */}
            <Button 
              className="w-[calc(100%-3rem)] mx-auto h-10 rounded-lg bg-white/10 hover:bg-white/20 border-white/20 text-white"
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
              Go to home
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TradeTimer;
