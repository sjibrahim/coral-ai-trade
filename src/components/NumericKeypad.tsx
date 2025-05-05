
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        <KeypadButton variant="secondary" onClick={() => handleKeyPress('clear')}>Clear</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('0')}>0</KeypadButton>
        <KeypadButton variant="secondary" onClick={() => handleKeyPress('delete')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
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
    <Button
      type="button"
      onClick={onClick}
      variant={variant}
      className="h-14 rounded-full text-lg font-medium flex items-center justify-center"
    >
      {children}
    </Button>
  );
};

export default NumericKeypad;
