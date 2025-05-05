
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CryptoCardProps {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  logo: string;
}

const CryptoCard = ({ id, name, symbol, price, change, logo }: CryptoCardProps) => {
  const isPositiveChange = change >= 0;
  const changeText = `${isPositiveChange ? '+' : ''}${change.toFixed(3)}%`;

  return (
    <Link to={`/coin/${id}`}>
      <div className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-accent/30 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
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
            "text-sm",
            isPositiveChange ? "text-market-increase" : "text-market-decrease"
          )}>
            {changeText}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;
