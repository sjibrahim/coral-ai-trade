
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
  keypadClassName?: string;
  buttonClassName?: string;
  confirmButtonClassName?: string;
  theme?: 'light' | 'dark' | 'trading';
}

const NumericKeypad = ({ 
  value, 
  onChange, 
  maxLength = 10,
  className,
  onConfirm,
  confirmButtonText = "CONFIRM",
  confirmButtonIcon,
  keypadClassName,
  buttonClassName,
  confirmButtonClassName,
  theme = 'dark'
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

  // Theme-based styles
  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          button: "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200",
          secondaryButton: "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300",
          confirmButton: "bg-blue-600 text-white hover:bg-blue-700"
        };
      case 'trading':
        return {
          button: "bg-[#1A1F2C]/80 text-gray-100 border-[#222]/50 hover:bg-[#1A1F2C]",
          secondaryButton: "bg-[#1A1F2C]/80 text-primary/90 border-[#222]/50 hover:bg-[#1A1F2C]",
          confirmButton: "bg-[#3861FB] text-white hover:bg-[#3861FB]/90"
        };
      case 'dark':
      default:
        return {
          button: "bg-[#14151F]/80 text-gray-100 border-[#222]/50 hover:bg-[#14151F]",
          secondaryButton: "bg-[#1A1F2C]/80 text-primary/90 border-[#222]/50 hover:bg-[#1A1F2C]",
          confirmButton: "bg-primary text-white hover:bg-primary/90"
        };
    }
  };

  const themeClasses = getThemeClasses();
  
  return (
    <div className={cn("numeric-keypad w-full max-w-xs", className)}>
      <div className={cn("grid grid-cols-3 gap-x-4 gap-y-4", keypadClassName)}>
        {/* First row */}
        <KeypadButton 
          onClick={() => handleKeyPress('1')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          1
        </KeypadButton>
        <KeypadButton 
          onClick={() => handleKeyPress('2')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          2
        </KeypadButton>
        <KeypadButton 
          onClick={() => handleKeyPress('3')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          3
        </KeypadButton>
        
        {/* Second row */}
        <KeypadButton 
          onClick={() => handleKeyPress('4')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          4
        </KeypadButton>
        <KeypadButton 
          onClick={() => handleKeyPress('5')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          5
        </KeypadButton>
        <KeypadButton 
          onClick={() => handleKeyPress('6')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          6
        </KeypadButton>
        
        {/* Third row */}
        <KeypadButton 
          onClick={() => handleKeyPress('7')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          7
        </KeypadButton>
        <KeypadButton 
          onClick={() => handleKeyPress('8')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          8
        </KeypadButton>
        <KeypadButton 
          onClick={() => handleKeyPress('9')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          9
        </KeypadButton>
        
        {/* Fourth row */}
        <KeypadButton 
          variant="secondary" 
          onClick={() => handleKeyPress('clear')}
          className={buttonClassName}
          themeClass={themeClasses.secondaryButton}
        >
          <span className="text-sm">clr</span>
        </KeypadButton>
        <KeypadButton 
          onClick={() => handleKeyPress('0')}
          className={buttonClassName}
          themeClass={themeClasses.button}
        >
          0
        </KeypadButton>
        <KeypadButton 
          variant="secondary" 
          onClick={() => handleKeyPress('delete')}
          className={buttonClassName}
          themeClass={themeClasses.secondaryButton}
        >
          <Delete className="h-5 w-5" />
        </KeypadButton>
      </div>
      
      {onConfirm && (
        <button 
          onClick={onConfirm}
          disabled={!onConfirm}
          className={cn(
            "w-full py-3.5 rounded-xl text-base font-medium mt-6",
            "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
            "flex items-center justify-center gap-1.5",
            "active:scale-[0.98]",
            themeClasses.confirmButton,
            confirmButtonClassName
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
  className?: string;
  themeClass?: string;
}

const KeypadButton = ({ 
  onClick, 
  children, 
  variant = 'default',
  className,
  themeClass
}: KeypadButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-14 w-14 rounded-full backdrop-blur-sm text-lg font-medium flex items-center justify-center",
        "transition-all duration-200 active:scale-95",
        "border shadow-sm hover:shadow-md",
        themeClass || (variant === 'secondary' 
          ? "bg-[#1A1F2C]/80 text-primary/90 border-[#222]/50" 
          : "bg-[#14151F]/80 text-gray-100 border-[#222]/50"),
        className
      )}
    >
      {children}
    </button>
  );
};

export default NumericKeypad;
