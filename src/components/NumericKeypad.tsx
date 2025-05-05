
import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";
import React from "react";

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
  onConfirm?: () => void;
  confirmButtonText?: string;
  confirmButtonIcon?: React.ReactNode;
  fixedConfirmButton?: boolean;
}

const NumericKeypad = ({ 
  value, 
  onChange, 
  maxLength = 10,
  className,
  onConfirm,
  confirmButtonText = "CONFIRM",
  confirmButtonIcon,
  fixedConfirmButton = false
}: NumericKeypadProps) => {
  
  const handleKeyPress = (key: string) => {
    if (key === 'clear') {
      onChange('');
      return;
    }
    
    if (key === 'delete') {
      onChange(value.slice(0, -1));
      return;
    }
    
    // Don't add more digits if we've reached max length
    if (value.length >= maxLength && key !== '.') return;
    
    // Handle decimal point
    if (key === '.') {
      // Don't add another decimal if one already exists
      if (value.includes('.')) return;
      
      // If value is empty, add a leading zero
      if (value === '') {
        onChange('0.');
        return;
      }
    }
    
    onChange(value + key);
  };
  
  const renderConfirmButton = () => {
    if (!onConfirm) return null;
    
    return (
      <button 
        onClick={onConfirm}
        disabled={!onConfirm}
        className={cn(
          "w-full py-4 rounded-xl bg-primary text-white text-base font-medium",
          "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
          "flex items-center justify-center gap-1.5",
          "hover:bg-primary/90 active:scale-[0.98] shadow-lg"
        )}
      >
        {confirmButtonIcon}
        {confirmButtonText}
      </button>
    );
  };
  
  return (
    <div className={cn("numeric-keypad w-full max-w-xs", className)}>
      <div className="grid grid-cols-3 gap-x-4 gap-y-4">
        {/* First row */}
        <KeypadButton onClick={() => handleKeyPress('1')}>1</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('2')}>2</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('3')}>3</KeypadButton>
        
        {/* Second row */}
        <KeypadButton onClick={() => handleKeyPress('4')}>4</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('5')}>5</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('6')}>6</KeypadButton>
        
        {/* Third row */}
        <KeypadButton onClick={() => handleKeyPress('7')}>7</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('8')}>8</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('9')}>9</KeypadButton>
        
        {/* Fourth row */}
        <KeypadButton variant="secondary" onClick={() => handleKeyPress('clear')}>
          <span className="text-sm">clr</span>
        </KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('0')}>0</KeypadButton>
        <KeypadButton variant="secondary" onClick={() => handleKeyPress('delete')}>
          <Delete className="h-5 w-5" />
        </KeypadButton>
      </div>
      
      {!fixedConfirmButton && onConfirm && (
        <div className="mt-6">
          {renderConfirmButton()}
        </div>
      )}
    </div>
  );
};

interface KeypadButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
}

const KeypadButton = ({ onClick, children, variant = 'default' }: KeypadButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-14 w-14 rounded-full backdrop-blur-sm text-lg font-medium flex items-center justify-center",
        "transition-all duration-200 active:scale-95",
        "border shadow-sm hover:shadow-md",
        variant === 'secondary' 
          ? "bg-[#1A1F2C]/80 text-primary/90 border-[#222]/50" 
          : "bg-[#14151F]/80 text-gray-100 border-[#222]/50"
      )}
    >
      {children}
    </button>
  );
};

export default NumericKeypad;
