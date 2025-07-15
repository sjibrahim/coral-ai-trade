
import React from 'react';

interface SignalBarsProps {
  strength: number; // 0-100
  isActive: boolean;
}

const SignalBars: React.FC<SignalBarsProps> = ({ strength, isActive }) => {
  const bars = 4;
  const activeBars = Math.ceil((strength / 100) * bars);

  return (
    <div className="flex items-end space-x-1 h-6">
      {[...Array(bars)].map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-sm transition-all duration-300 ${
            i < activeBars && isActive
              ? 'bg-green-500 animate-signal-bars'
              : 'bg-gray-300'
          }`}
          style={{
            height: `${((i + 1) / bars) * 100}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SignalBars;
