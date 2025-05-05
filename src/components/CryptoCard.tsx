
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoCardProps {
  id: string;
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

  return (
    <Link to={`/coin/${id}`} style={{ animationDelay: `${animationDelay}ms` }} className="animate-fade-in">
      <div className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-accent/30 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center shadow-md">
            <img src={logo} alt={name} className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">${price.toLocaleString()}</p>
          <p className={cn(
            "text-sm flex items-center justify-end gap-0.5",
            isPositiveChange ? "text-market-increase" : "text-market-decrease"
          )}>
            {isPositiveChange ? 
              <TrendingUp className="w-3.5 h-3.5" /> : 
              <TrendingDown className="w-3.5 h-3.5" />
            }
            {changeText}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;
