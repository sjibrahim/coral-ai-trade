
import React from "react";
import { cn } from "@/lib/utils";

interface PaymentMethod {
  id: string;
  name: string;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onSelect: (id: string) => void;
}

const PaymentMethodSelector = ({ 
  methods, 
  selectedMethod, 
  onSelect 
}: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Payment Channel</h3>
      <div className="grid grid-cols-4 gap-2">
        {methods.map(method => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all",
              selectedMethod === method.id
                ? "border-blue-600 bg-blue-600/10 text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            )}
          >
            <span className="text-sm whitespace-nowrap">{method.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
