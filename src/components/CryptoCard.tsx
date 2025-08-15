
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CryptoCardProps {
  id: string | number;
  name: string;
  symbol: string;
  price: number;
  change: number;
  logo: string;
  binance_symbol?: string;
  animationDelay?: number;
  market_cap?: string;
  volume_24h?: string;
  rank?: string;
}

const CryptoCard = ({ 
  id, 
  name, 
  symbol, 
  price, 
  change, 
  logo, 
  binance_symbol,
  market_cap,
  volume_24h,
  rank,
  animationDelay = 0 
}: CryptoCardProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    // Ensure we always have a proper binance_symbol
    const safeBinanceSymbol = binance_symbol || `${symbol.toUpperCase()}USDT`;
    
    console.log('CryptoCard navigation:', { 
      id, 
      name, 
      symbol, 
      binance_symbol: safeBinanceSymbol,
      price,
      change 
    });
    
    // Navigate to coin detail page and pass the complete crypto object as state
    navigate(`/coin/${id}`, { 
      state: { 
        crypto: {
          id: String(id), // Ensure id is always a string
          name,
          symbol: symbol.toLowerCase(),
          binance_symbol: safeBinanceSymbol,
          price,
          change,
          logo,
          market_cap: market_cap || 'N/A',
          volume_24h: volume_24h || 'N/A',
          rank: rank || 'N/A'
        }
      }
    });
  };
  
  return (
    <div 
      className="p-4 hover:bg-gray-700/30 cursor-pointer transition-all duration-200"
      onClick={handleCardClick}
      style={{ 
        animation: `fade-in 0.5s ease-out forwards`,
        animationDelay: `${animationDelay}ms`,
        opacity: 0
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
            <img 
              src={logo} 
              alt={name} 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://raw.githubusercontent.com/Pymmdrza/CryptoIconsCDN/mainx/PNG/${symbol.toUpperCase()}.png`;
              }}
            />
          </div>
          <div>
            <h3 className="font-medium text-white text-base">{name}</h3>
            <p className="text-sm text-gray-400 uppercase">{symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium text-white text-base">
            ${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
          <div className={cn("text-sm flex items-center justify-end", 
            change >= 0 ? "text-green-400" : "text-red-400")}>
            {change >= 0 ? (
              <ArrowUp className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
