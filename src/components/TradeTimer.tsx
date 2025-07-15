
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import NetworkAnimation from '@/components/trade/NetworkAnimation';
import EnhancedTimerCircle from '@/components/trade/EnhancedTimerCircle';
import SignalBars from '@/components/trade/SignalBars';
import TradingStatusMessages from '@/components/trade/TradingStatusMessages';

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
  const [isConnecting, setIsConnecting] = useState(true);
  const [networkPhase, setNetworkPhase] = useState<'connecting' | 'trading' | 'analyzing'>('connecting');
  const [signalStrength, setSignalStrength] = useState(0);
  const [result, setResult] = useState<{
    value: number | null;
    type: 'Profit' | 'Loss' | null;
  }>({ value: null, type: null });
  const [endPrice, setEndPrice] = useState(currentPrice);
  const { updateProfile } = useAuth();

  // Simulate connection phase
  useEffect(() => {
    if (!open) return;

    if (timeRemaining === duration && !isCompleted) {
      setIsConnecting(true);
      setSignalStrength(0);
      
      // Connection simulation
      const connectionTimer = setTimeout(() => {
        setIsConnecting(false);
        setSignalStrength(100);
        setNetworkPhase('trading');
      }, 3000);

      return () => clearTimeout(connectionTimer);
    }
  }, [open, timeRemaining, duration, isCompleted]);

  // Signal strength animation
  useEffect(() => {
    if (isConnecting) {
      const interval = setInterval(() => {
        setSignalStrength(prev => Math.min(prev + Math.random() * 20, 85));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isConnecting]);

  // Network phase management
  useEffect(() => {
    if (!isConnecting && !isCompleted) {
      const totalProgress = (duration - timeRemaining) / duration;
      
      if (totalProgress < 0.1) {
        setNetworkPhase('connecting');
      } else if (totalProgress < 0.9) {
        setNetworkPhase('trading');
      } else {
        setNetworkPhase('analyzing');
      }
    }
  }, [timeRemaining, duration, isConnecting, isCompleted]);

  useEffect(() => {
    if (!open) return;
    
    // Reset state when modal opens
    if (timeRemaining === 0 && !isCompleted) {
      setTimeRemaining(duration);
      setIsCompleted(false);
      setIsConnecting(true);
      setResult({ value: null, type: null });
    }
    
    // Only start the timer if not completed and not connecting
    if (!isCompleted && !isConnecting && timeRemaining > 0) {
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
  }, [open, duration, direction, currentPrice, startPrice, onComplete, isCompleted, timeRemaining, tradeApiResponse, updateProfile, isConnecting]);

  // Reset state when modal is closed
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsCompleted(false);
      setTimeRemaining(duration);
      setIsConnecting(true);
      setResult({ value: null, type: null });
      setSignalStrength(0);
      setNetworkPhase('connecting');
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
                result.type === 'Profit' ? 'bg-green-500 animate-bounce' : 'bg-red-500 animate-pulse'
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

  // Trade Progress Modal - Enhanced with Network Animations (removed animate-breathing)
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[90vw] max-w-sm mx-auto bg-white border-none rounded-3xl p-0 overflow-hidden">
        <div className="relative p-6 network-container">
          {/* Network Animation Overlay */}
          <NetworkAnimation 
            isActive={true} 
            phase={networkPhase}
          />

          {/* Enhanced Timer Circle */}
          <EnhancedTimerCircle
            timeRemaining={timeRemaining}
            duration={duration}
            direction={direction}
            isConnecting={isConnecting}
          />

          {/* Trading Status Messages */}
          <TradingStatusMessages
            timeRemaining={timeRemaining}
            duration={duration}
            direction={direction}
          />

          {/* Signal Strength and Status */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <SignalBars strength={signalStrength} isActive={!isConnecting} />
              <span className="text-xs text-gray-500">
                {Math.round(signalStrength)}%
              </span>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              isConnecting ? 'bg-yellow-400 animate-pulse' : 'bg-green-400 animate-pulse'
            }`} />
          </div>

          {/* Price Info Grid with Enhanced Effects (removed animate-breathing) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-gray-200/50 animate-fade-in-scale">
              <p className="text-xs text-gray-500 mb-1">Direction</p>
              <p className={`text-lg font-bold ${
                direction === 'Call' ? 'text-green-600' : 'text-red-600'
              }`}>
                {direction}
              </p>
            </div>
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-gray-200/50 animate-fade-in-scale">
              <p className="text-xs text-gray-500 mb-1">Start Price</p>
              <p className="text-lg font-bold text-gray-900">
                ${startPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Current Price with Enhanced Animations (removed animate-breathing) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 text-center border border-blue-200/50">
            <p className="text-xs text-blue-600 mb-1">Current Price</p>
            <p className="text-xl font-bold text-blue-700 animate-pulse">
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
            className="w-full h-12 rounded-2xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-200 transform active:scale-95"
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
