
import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
  onConfirm?: () => void;
  confirmButtonText?: string;
}

const NumericKeypad = ({ 
  value, 
  onChange, 
  maxLength = 10,
  className,
  onConfirm,
  confirmButtonText = "CONFIRM"
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
  
  return (
    <div className={cn("numeric-keypad w-full max-w-xs", className)}>
      <div className="grid grid-cols-3 gap-x-8 gap-y-6">
        <KeypadButton onClick={() => handleKeyPress('1')}>1</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('2')}>2</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('3')}>3</KeypadButton>
        
        <KeypadButton onClick={() => handleKeyPress('4')}>4</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('5')}>5</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('6')}>6</KeypadButton>
        
        <KeypadButton onClick={() => handleKeyPress('7')}>7</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('8')}>8</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('9')}>9</KeypadButton>
        
        <KeypadButton variant="secondary" onClick={() => handleKeyPress('clear')}>
          <span className="text-sm">clr</span>
        </KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('0')}>0</KeypadButton>
        <KeypadButton variant="secondary" onClick={() => handleKeyPress('delete')}>
          <Delete className="h-5 w-5" />
        </KeypadButton>
      </div>
      
      {onConfirm && (
        <button 
          onClick={onConfirm}
          disabled={!onConfirm}
          className="w-full py-4 rounded-xl bg-blue-600 text-white text-base font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
}

const KeypadButton = ({ onClick, children, variant = 'default' }: KeypadButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-14 w-14 rounded-full bg-[#14151F]/80 border border-[#222] text-xl font-medium flex items-center justify-center shadow-md",
        variant === 'secondary' ? "text-blue-300" : "text-gray-100"
      )}
    >
      {children}
    </button>
  );
};

export default NumericKeypad;
