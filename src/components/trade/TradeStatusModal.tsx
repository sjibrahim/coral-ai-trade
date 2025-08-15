
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Clock, Target, Zap, CheckCircle, XCircle } from 'lucide-react';
import TradingStatusMessages from './TradingStatusMessages';
import { placeTrade } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface TradeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeData: {
    type: 'call' | 'put';
    amount: number;
    duration: number;
    symbol: string;
    entryPrice: number;
  };
}

const TradeStatusModal: React.FC<TradeStatusModalProps> = ({
  isOpen,
  onClose,
  tradeData
}) => {
  const { user } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(tradeData.duration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<'win' | 'loss' | null>(null);
  const [currentPrice, setCurrentPrice] = useState(tradeData.entryPrice);
  const [isPlacingTrade, setIsPlacingTrade] = useState(false);
  const [tradeId, setTradeId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setTimeRemaining(tradeData.duration);
    setIsCompleted(false);
    setResult(null);
    setCurrentPrice(tradeData.entryPrice);
    setIsPlacingTrade(false);
    setTradeId(null);

    // Place the trade when modal opens
    const handleTradePlacement = async () => {
      if (!user?.token) return;

      setIsPlacingTrade(true);
      
      try {
        console.log('Placing trade:', tradeData);
        
        const response = await placeTrade(
          user.token,
          tradeData.amount,
          tradeData.symbol,
          tradeData.type,
          tradeData.entryPrice,
          tradeData.duration
        );

        console.log('Trade response:', response);

        if (response.success) {
          setTradeId(response.data?.trade_id || 'trade_' + Date.now());
          toast({
            title: "Trade Placed Successfully",
            description: `${tradeData.type.toUpperCase()} trade for ₹${tradeData.amount} has been placed`,
          });
        } else {
          toast({
            title: "Trade Failed",
            description: response.message || "Failed to place trade",
            variant: "destructive",
          });
          // Close modal if trade placement failed
          setTimeout(() => onClose(), 2000);
          return;
        }
      } catch (error) {
        console.error('Trade placement error:', error);
        toast({
          title: "Error",
          description: "Failed to place trade. Please try again.",
          variant: "destructive",
        });
        setTimeout(() => onClose(), 2000);
        return;
      } finally {
        setIsPlacingTrade(false);
      }
    };

    handleTradePlacement();

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsCompleted(true);
          // Simulate random result
          const randomResult = Math.random() > 0.5 ? 'win' : 'loss';
          setResult(randomResult);
          return 0;
        }
        return prev - 1;
      });

      // Simulate price changes
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 100;
        return prev + change;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, tradeData, user?.token, onClose]);

  const progress = ((tradeData.duration - timeRemaining) / tradeData.duration) * 100;
  const priceDifference = currentPrice - tradeData.entryPrice;
  const isProfitable = tradeData.type === 'call' ? priceDifference > 0 : priceDifference < 0;

  if (isPlacingTrade) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md mx-auto w-[90%] bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 p-0 overflow-hidden rounded-2xl">
          <div className="relative p-6">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`p-3 rounded-full animate-pulse ${
                  tradeData.type === 'call' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Placing Trade...
                  </h3>
                  <p className="text-gray-400 text-sm">{tradeData.symbol}</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className={`font-medium ${
                    tradeData.type === 'call' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tradeData.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-medium">₹{tradeData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white font-medium">{tradeData.duration}s</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto w-[90%] bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 p-0 overflow-hidden rounded-2xl">
        <div className="relative p-6">
          {!isCompleted ? (
            // Trading in progress
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${
                  tradeData.type === 'call' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {tradeData.type === 'call' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {tradeData.type.toUpperCase()} Trade Active
                  </h3>
                  <p className="text-gray-400 text-sm">{tradeData.symbol}</p>
                </div>
              </div>

              {/* Timer Circle */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                    className={tradeData.type === 'call' ? 'text-green-400' : 'text-red-400'}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{timeRemaining}</div>
                    <div className="text-xs text-gray-400">seconds</div>
                  </div>
                </div>
              </div>

              <TradingStatusMessages 
                timeRemaining={timeRemaining}
                duration={tradeData.duration}
                direction={tradeData.type === 'call' ? 'Call' : 'Put'}
              />

              {/* Price Info */}
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry Price:</span>
                  <span className="text-white font-medium">₹{tradeData.entryPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Price:</span>
                  <span className={`font-medium ${
                    priceDifference > 0 ? 'text-green-400' : priceDifference < 0 ? 'text-red-400' : 'text-white'
                  }`}>
                    ₹{currentPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Investment:</span>
                  <span className="text-white font-medium">₹{tradeData.amount}</span>
                </div>
                {tradeId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Trade ID:</span>
                    <span className="text-white font-medium text-xs">{tradeId}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Trade completed
            <div className="text-center space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                result === 'win' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {result === 'win' ? (
                  <CheckCircle className="w-10 h-10 text-green-400" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-400" />
                )}
              </div>

              <div>
                <h3 className={`text-2xl font-bold ${
                  result === 'win' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result === 'win' ? 'Trade Won!' : 'Trade Lost'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {tradeData.type.toUpperCase()} trade on {tradeData.symbol}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Investment:</span>
                  <span className="text-white font-medium">₹{tradeData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Result:</span>
                  <span className={`font-bold ${
                    result === 'win' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result === 'win' ? `+₹${(tradeData.amount * 0.8).toFixed(0)}` : `-₹${tradeData.amount}`}
                  </span>
                </div>
                {tradeId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Trade ID:</span>
                    <span className="text-white font-medium text-xs">{tradeId}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
              >
                Continue Trading
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeStatusModal;
