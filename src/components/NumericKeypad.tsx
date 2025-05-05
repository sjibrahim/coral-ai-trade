
import { cn } from "@/lib/utils";

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
        <Button onClick={() => handleKeyPress('1')}>1</Button>
        <Button onClick={() => handleKeyPress('2')}>2</Button>
        <Button onClick={() => handleKeyPress('3')}>3</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Button onClick={() => handleKeyPress('4')}>4</Button>
        <Button onClick={() => handleKeyPress('5')}>5</Button>
        <Button onClick={() => handleKeyPress('6')}>6</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Button onClick={() => handleKeyPress('7')}>7</Button>
        <Button onClick={() => handleKeyPress('8')}>8</Button>
        <Button onClick={() => handleKeyPress('9')}>9</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Button onClick={() => handleKeyPress('clear')}>clr</Button>
        <Button onClick={() => handleKeyPress('0')}>0</Button>
        <Button onClick={() => handleKeyPress('delete')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center"
    >
      {children}
    </button>
  );
};

export default NumericKeypad;
