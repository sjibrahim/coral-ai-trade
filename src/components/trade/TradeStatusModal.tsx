
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TradeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeResult: {
    status: 'win' | 'loss';
    win?: number;
    lost_amount?: number;
    new_balance: number;
    amount: number;
    duration: number;
    symbol: string;
    type: 'call' | 'put';
    entryPrice: number;
  };
}

const TradeStatusModal: React.FC<TradeStatusModalProps> = ({
  isOpen,
  onClose,
  tradeResult
}) => {
  const { user, refreshUserData } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(tradeResult.duration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(tradeResult.entryPrice);

  useEffect(() => {
    if (!isOpen) return;

    setTimeRemaining(tradeResult.duration);
    setIsCompleted(false);
    setCurrentPrice(tradeResult.entryPrice);

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsCompleted(true);
          // Refresh user data to update balance
          refreshUserData();
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
  }, [isOpen, tradeResult, refreshUserData]);

  const progress = ((tradeResult.duration - timeRemaining) / tradeResult.duration) * 100;
  const priceDifference = currentPrice - tradeResult.entryPrice;
  const isProfitable = tradeResult.type === 'call' ? priceDifference > 0 : priceDifference < 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto w-[90%] bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 p-0 overflow-hidden rounded-2xl">
        <div className="relative p-6">
          {!isCompleted ? (
            // Trading in progress
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${
                  tradeResult.type === 'call' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {tradeResult.type === 'call' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {tradeResult.type.toUpperCase()} Trade Active
                  </h3>
                  <p className="text-gray-400 text-sm">{tradeResult.symbol}</p>
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
                    className={tradeResult.type === 'call' ? 'text-green-400' : 'text-red-400'}
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

              {/* Price Info */}
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry Price:</span>
                  <span className="text-white font-medium">₹{tradeResult.entryPrice.toFixed(2)}</span>
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
                  <span className="text-white font-medium">₹{tradeResult.amount}</span>
                </div>
              </div>
            </div>
          ) : (
            // Trade completed
            <div className="text-center space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                tradeResult.status === 'win' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {tradeResult.status === 'win' ? (
                  <CheckCircle className="w-10 h-10 text-green-400" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-400" />
                )}
              </div>

              <div>
                <h3 className={`text-2xl font-bold ${
                  tradeResult.status === 'win' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tradeResult.status === 'win' ? 'Trade Won!' : 'Trade Lost'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {tradeResult.type.toUpperCase()} trade on {tradeResult.symbol}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Investment:</span>
                  <span className="text-white font-medium">₹{tradeResult.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Result:</span>
                  <span className={`font-bold ${
                    tradeResult.status === 'win' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tradeResult.status === 'win' 
                      ? `+₹${tradeResult.win}` 
                      : `-₹${tradeResult.lost_amount}`
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">New Balance:</span>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-bold">₹{tradeResult.new_balance}</span>
                  </div>
                </div>
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
