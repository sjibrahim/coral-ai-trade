
import { cn } from "@/lib/utils";
import { Delete, ArrowLeft } from "lucide-react";
import React from "react";

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
  onConfirm?: () => void;
  confirmButtonText?: string;
  confirmButtonIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  deleteIcon?: "delete" | "backspace";
  clearText?: string;
}

const NumericKeypad = ({ 
  value, 
  onChange, 
  maxLength = 10,
  className,
  onConfirm,
  confirmButtonText = "CONFIRM",
  confirmButtonIcon,
  size = "md",
  deleteIcon = "delete",
  clearText = "clear"
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

  // Size classes for buttons
  const sizeClasses = {
    sm: "h-12 w-12 text-base",
    md: "h-14 w-14 text-lg",
    lg: "h-16 w-16 text-2xl",
  }[size];
  
  // Get the correct delete icon - using ArrowLeft instead of Backspace
  const DeleteIconComponent = deleteIcon === "backspace" ? ArrowLeft : Delete;
  
  return (
    <div className={cn("numeric-keypad", className)}>
      <div className="grid grid-cols-3 gap-x-6 gap-y-6">
        {/* First row */}
        <KeypadButton size={size} onClick={() => handleKeyPress('1')}>1</KeypadButton>
        <KeypadButton size={size} onClick={() => handleKeyPress('2')}>2</KeypadButton>
        <KeypadButton size={size} onClick={() => handleKeyPress('3')}>3</KeypadButton>
        
        {/* Second row */}
        <KeypadButton size={size} onClick={() => handleKeyPress('4')}>4</KeypadButton>
        <KeypadButton size={size} onClick={() => handleKeyPress('5')}>5</KeypadButton>
        <KeypadButton size={size} onClick={() => handleKeyPress('6')}>6</KeypadButton>
        
        {/* Third row */}
        <KeypadButton size={size} onClick={() => handleKeyPress('7')}>7</KeypadButton>
        <KeypadButton size={size} onClick={() => handleKeyPress('8')}>8</KeypadButton>
        <KeypadButton size={size} onClick={() => handleKeyPress('9')}>9</KeypadButton>
        
        {/* Fourth row */}
        <KeypadButton size={size} variant="secondary" onClick={() => handleKeyPress('clear')}>
          <span className="text-sm">{clearText}</span>
        </KeypadButton>
        <KeypadButton size={size} onClick={() => handleKeyPress('0')}>0</KeypadButton>
        <KeypadButton size={size} variant="secondary" onClick={() => handleKeyPress('delete')}>
          <DeleteIconComponent className={cn(
            size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-4 w-4"
          )} />
        </KeypadButton>
      </div>
      
      {onConfirm && (
        <button 
          onClick={onConfirm}
          disabled={!onConfirm}
          className={cn(
            "w-full py-3.5 rounded-xl bg-primary text-white text-base font-medium mt-6",
            "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
            "flex items-center justify-center gap-1.5",
            "hover:bg-primary/90 active:scale-[0.98]"
          )}
        >
          {confirmButtonIcon}
          {confirmButtonText}
        </button>
      )}
    </div>
  );
};

interface KeypadButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
  size?: "sm" | "md" | "lg";
}

const KeypadButton = ({ onClick, children, variant = 'default', size = "md" }: KeypadButtonProps) => {
  // Size classes
  const sizeClasses = {
    sm: "h-12 w-12 text-base",
    md: "h-14 w-14 text-lg",
    lg: "h-16 w-16 text-2xl",
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full font-medium flex items-center justify-center",
        "transition-all duration-200 active:scale-95",
        sizeClasses,
        variant === 'secondary' 
          ? "bg-transparent text-gray-400" 
          : "bg-transparent text-white"
      )}
    >
      {children}
    </button>
  );
};

export default NumericKeypad;
