
import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign, Users } from 'lucide-react';

interface ModernMarketStatsProps {
  marketCap?: string;
  volume24h?: string;
  high24h?: number;
  low24h?: number;
  currentPrice: number;
  change: number;
}

const ModernMarketStats: React.FC<ModernMarketStatsProps> = ({
  marketCap,
  volume24h,
  high24h,
  low24h,
  currentPrice,
  change
}) => {
  const stats = [
    {
      icon: DollarSign,
      label: '24h High',
      value: high24h ? `₹${high24h.toLocaleString()}` : `₹${(currentPrice * 1.05).toLocaleString()}`,
      change: '+2.3%',
      positive: true
    },
    {
      icon: TrendingDown,
      label: '24h Low',
      value: low24h ? `₹${low24h.toLocaleString()}` : `₹${(currentPrice * 0.95).toLocaleString()}`,
      change: '-1.8%',
      positive: false
    },
    {
      icon: Activity,
      label: 'Volume',
      value: volume24h || '₹2.3B',
      change: '+12.5%',
      positive: true
    },
    {
      icon: BarChart3,
      label: 'Market Cap',
      value: marketCap || '₹1.2T',
      change: '+5.2%',
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card/30 backdrop-blur-sm rounded-xl p-4 border border-border/30 hover:bg-card/50 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${
              stat.positive 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-red-500/10 text-red-400'
            }`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className={`text-xs font-medium ${
              stat.positive ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.change}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-bold text-foreground">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModernMarketStats;
