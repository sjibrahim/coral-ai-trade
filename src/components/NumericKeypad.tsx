
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
  confirmDisabled?: boolean;
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
  clearText = "clr",
  confirmDisabled = false,
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

  // Size classes for buttons - darker styling to match the reference design
  const sizeClasses = {
    sm: "h-12 w-12 text-lg",
    md: "h-16 w-16 text-2xl",
    lg: "h-[76px] w-[76px] text-3xl",
  }[size];
  
  // Get the correct delete icon - using ArrowLeft for backspace
  const DeleteIconComponent = deleteIcon === "backspace" ? ArrowLeft : Delete;
  
  return (
    <div className={cn("numeric-keypad w-full", className)}>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
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
      
      {/* Confirm Button - shown only if onConfirm is provided */}
      {onConfirm && (
        <button 
          onClick={onConfirm}
          disabled={confirmDisabled}
          className={cn(
            "force-full-blue py-4 rounded-lg text-white text-lg font-medium transition-all cursor-not-allowed",
            confirmDisabled 
              ? "bg-blue-600/50 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          )}
        >
          {confirmButtonIcon && <span className="mr-2">{confirmButtonIcon}</span>}
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
    sm: "h-12 w-12 text-lg",
    md: "h-16 w-16 text-2xl",
    lg: "h-[76px] w-[76px] text-2xl font-medium",
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full",
        "transition-all duration-200 active:scale-95",
        "bg-[#1a1e2a] hover:bg-[#232736]", // Darker button color to match the design
        "border border-white/5",
        sizeClasses,
        variant === 'secondary' 
          ? "text-gray-300" 
          : "text-white"
      )}
    >
      {children}
    </button>
  );
};

export default NumericKeypad;
