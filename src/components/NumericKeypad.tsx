
import { cn } from "@/lib/utils";
import { X, Delete } from "lucide-react";

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
}

const NumericKeypad = ({ 
  value, 
  onChange, 
  maxLength = 10,
  className 
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
    <div className={cn("numeric-keypad space-y-4", className)}>
      <div className="grid grid-cols-3 gap-4">
        <KeypadButton onClick={() => handleKeyPress('1')}>1</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('2')}>2</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('3')}>3</KeypadButton>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <KeypadButton onClick={() => handleKeyPress('4')}>4</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('5')}>5</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('6')}>6</KeypadButton>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <KeypadButton onClick={() => handleKeyPress('7')}>7</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('8')}>8</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('9')}>9</KeypadButton>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <KeypadButton variant="secondary" onClick={() => handleKeyPress('clear')}>
          <X className="h-5 w-5" />
        </KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('0')}>0</KeypadButton>
        <KeypadButton variant="secondary" onClick={() => handleKeyPress('delete')}>
          <Delete className="h-5 w-5" />
        </KeypadButton>
      </div>
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
        "h-16 w-16 rounded-full text-xl font-medium flex items-center justify-center",
        "bg-secondary/30 border border-white/5 shadow-lg hover:bg-secondary/60 transition-colors",
        variant === 'secondary' ? "bg-secondary/40 text-muted-foreground" : "text-foreground"
      )}
    >
      {children}
    </button>
  );
};

export default NumericKeypad;
