
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
  currencySymbol = <IndianRupee className="h-4 w-4 text-emerald-600" />
}: AmountInputProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    if (newValue.split('.').length > 2) return;
    onChange(newValue);
  };

  const isValidAmount = Number(amount) >= minAmount && (!maxAmount || Number(amount) <= maxAmount);

  const getStatusIcon = () => {
    if (!amount) return null;
    if (isValidAmount) return <Check className="h-3 w-3 text-emerald-500" />;
    return <Ban className="h-3 w-3 text-red-500" />;
  };

  return (
    <div className={cn("bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50", className)}>
      <div className="relative mb-3">
        <div className="flex items-center justify-center">
          <div className="flex items-center bg-emerald-50 rounded-lg px-3 py-2">
            {currencySymbol}
            <Input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none p-0 h-auto w-32 text-center focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0"
              maxLength={10}
            />
          </div>
        </div>

        <div className="absolute right-0 top-0 flex items-center gap-1">
          {getStatusIcon()}
          {amount && (
            <span className={cn(
              "text-xs font-medium",
              isValidAmount ? "text-emerald-600" : "text-red-500"
            )}>
              {isValidAmount ? "Valid" : "Invalid"}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((quickAmount) => (
          <button
            key={quickAmount}
            onClick={() => onChange(quickAmount)}
            className={cn(
              "py-1.5 rounded-lg text-center text-xs font-medium transition-all",
              amount === quickAmount
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
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
