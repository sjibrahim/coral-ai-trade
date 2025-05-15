
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IndianRupee, Check, Ban } from "lucide-react";

interface AmountInputProps {
  amount: string;
  onChange: (value: string) => void;
  minAmount: number;
  maxAmount?: number;
  quickAmounts: string[];
  className?: string;
  currencySymbol?: React.ReactNode;
}

const AmountInput = ({
  amount,
  onChange,
  minAmount,
  maxAmount,
  quickAmounts,
  className,
  currencySymbol = <IndianRupee className="h-5 w-5 text-white/70" />
}: AmountInputProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Handle decimal point (only one allowed)
    if (newValue.split('.').length > 2) return;
    
    onChange(newValue);
  };

  const isValidAmount = Number(amount) >= minAmount && (!maxAmount || Number(amount) <= maxAmount);

  const getStatusIcon = () => {
    if (!amount) return null;
    if (isValidAmount) return <Check className="h-4 w-4 text-green-500" />;
    return <Ban className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className={cn("bg-[#1a1c25] rounded-2xl p-5 shadow-lg", className)}>
      <div className="relative mb-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            {currencySymbol}
            <Input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              className="text-3xl font-bold text-white bg-transparent border-none p-0 h-auto w-36 text-center focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0"
              maxLength={10}
            />
          </div>
        </div>

        <div className="absolute right-0 top-0 flex items-center gap-2">
          {getStatusIcon()}
          {amount && (
            isValidAmount ? 
              <span className="text-xs text-green-500">Valid amount</span> : 
              <span className="text-xs text-red-500">Invalid amount</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((quickAmount) => (
          <button
            key={quickAmount}
            onClick={() => onChange(quickAmount)}
            className={cn(
              "py-1.5 rounded-full border text-center text-sm transition-all",
              amount === quickAmount
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            )}
          >
            ₹{quickAmount}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AmountInput;
