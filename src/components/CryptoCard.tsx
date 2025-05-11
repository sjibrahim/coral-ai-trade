
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoCardProps {
  id: string | number;
  name: string;
  symbol: string;
  price: number;
  change: number;
  logo: string;
  animationDelay?: number;
}

const CryptoCard = ({ id, name, symbol, price, change, logo, animationDelay = 0 }: CryptoCardProps) => {
  const isPositiveChange = change >= 0;
  const changeText = `${isPositiveChange ? '+' : ''}${change.toFixed(3)}%`;

  // Handle image error by using fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    // Use symbol as fallback
    target.style.display = 'none';
    target.nextElementSibling?.classList.remove('hidden');
  };

  return (
    <Link 
      to={`/coin/${id.toString()}`} 
      style={{ animationDelay: `${animationDelay}ms` }} 
      className="animate-fade-in hover:bg-blue-500/5 transition-colors"
    >
      <div className="flex items-center justify-between p-3.5 rounded-lg hover:bg-accent/30 border-b border-border/30 group transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary/40 backdrop-blur-sm flex items-center justify-center shadow-md overflow-hidden crypto-icon group-hover:scale-105 transition-transform">
            <img 
              src={logo} 
              alt={name} 
              className="w-6 h-6"
              onError={handleImageError}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center font-bold text-xs">
              {symbol.slice(0, 2)}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">{symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium text-sm">${price.toLocaleString()}</p>
          <p className={cn(
            "text-xs flex items-center justify-end gap-0.5",
            isPositiveChange ? "text-market-increase" : "text-market-decrease"
          )}>
            {isPositiveChange ? 
              <TrendingUp className="w-3 h-3" /> : 
              <TrendingDown className="w-3 h-3" />
            }
            {changeText}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;
