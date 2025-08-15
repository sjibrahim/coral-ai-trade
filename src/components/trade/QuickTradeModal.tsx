import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, X, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { placeTrade } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface QuickTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeType: 'call' | 'put';
  crypto: {
    name: string;
    symbol: string;
    price: number;
  };
  onTradeComplete: (result: any) => void;
}

const QuickTradeModal: React.FC<QuickTradeModalProps> = ({
  isOpen,
  onClose,
  tradeType,
  crypto,
  onTradeComplete
}) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState(100);
  const [duration, setDuration] = useState(60);
  const [isPlacing, setIsPlacing] = useState(false);

  const handleTrade = async () => {
    if (!user?.token) return;

    setIsPlacing(true);
    
    try {
      const response = await placeTrade(
        user.token,
        amount,
        crypto.symbol,
        tradeType,
        crypto.price,
        duration
      );

      if (response.success) {
        // Only pass trade setup information - no win/loss results yet
        onTradeComplete({
          tradeId: response.data?.trade_id || null,
          amount,
          duration,
          symbol: crypto.symbol,
          type: tradeType,
          entryPrice: crypto.price
        });
        
        toast({
          title: "Trade Placed",
          description: `${tradeType.toUpperCase()} trade of ₹${amount} placed successfully`,
        });
      } else {
        toast({
          title: "Trade Failed",
          description: response.message || "Failed to place trade",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Trade placement error:', error);
      toast({
        title: "Error",
        description: "Failed to place trade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto w-[90%] bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 p-0 overflow-hidden rounded-2xl">
        <div className="relative p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/10 text-white"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="text-center space-y-6">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${
                tradeType === 'call' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {tradeType === 'call' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {tradeType === 'call' ? 'BUY' : 'PUT'} {crypto.symbol}
                </h3>
                <p className="text-gray-400 text-sm">₹{crypto.price.toFixed(2)}</p>
              </div>
            </div>

            {/* User Balance */}
            {user && (
              <div className="bg-gray-800/50 rounded-xl p-3 flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">Balance:</span>
                <span className="text-white font-semibold">₹{user.wallet || '0'}</span>
              </div>
            )}

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Investment Amount</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[100, 500, 1000, 5000].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value)}
                    className={cn(
                      "py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                      amount === value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    )}
                  >
                    ₹{value}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Enter custom amount"
              />
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Trade Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 120, 300].map((value) => (
                  <button
                    key={value}
                    onClick={() => setDuration(value)}
                    className={cn(
                      "py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                      duration === value
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    )}
                  >
                    {value}s
                  </button>
                ))}
              </div>
            </div>

            {/* Trade Button */}
            <Button
              onClick={handleTrade}
              disabled={isPlacing}
              className={cn(
                "w-full h-12 rounded-xl font-semibold text-white shadow-lg",
                tradeType === 'call'
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              )}
            >
              {isPlacing ? 'Placing Trade...' : `${tradeType === 'call' ? 'BUY' : 'PUT'} - ₹${amount} for ${duration}s`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickTradeModal;
