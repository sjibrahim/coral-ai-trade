
import React from 'react';

interface EnhancedTimerCircleProps {
  timeRemaining: number;
  duration: number;
  direction: 'Call' | 'Put';
  isConnecting: boolean;
}

const EnhancedTimerCircle: React.FC<EnhancedTimerCircleProps> = ({
  timeRemaining,
  duration,
  direction,
  isConnecting,
}) => {
  const progress = (duration - timeRemaining) / duration;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="transparent" 
          stroke="#f1f5f9" 
          strokeWidth="3"
        />
        
        {/* Outer Glow Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="47" 
          fill="transparent" 
          stroke={direction === 'Call' ? "#10b981" : "#ef4444"}
          strokeWidth="1" 
          opacity="0.3"
          className="animate-pulse"
        />
        
        {/* Progress Circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="transparent" 
          stroke={direction === 'Call' ? "#10b981" : "#ef4444"}
          strokeWidth="4" 
          strokeDasharray={circumference} 
          strokeDashoffset={isConnecting ? circumference : strokeDashoffset}
          className={`transition-all duration-1000 ease-linear ${isConnecting ? 'animate-pulse' : ''}`}
          strokeLinecap="round"
        />
        
        {/* Radar Sweep Effect */}
        {isConnecting && (
          <g>
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor={direction === 'Call' ? "#10b981" : "#ef4444"} stopOpacity="0.5" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <line
              x1="50"
              y1="50"
              x2="95"
              y2="50"
              stroke="url(#radarGradient)"
              strokeWidth="2"
              className="animate-radar-sweep"
              style={{ transformOrigin: '50px 50px' }}
            />
          </g>
        )}
        
        {/* Center Dot */}
        <circle 
          cx="50" 
          cy="50" 
          r="2" 
          fill={direction === 'Call' ? "#10b981" : "#ef4444"}
          className="animate-pulse"
        />
        
        {/* Connection Lines */}
        {isConnecting && (
          <g strokeDasharray="5,5" className="animate-connection-line">
            <line x1="20" y1="20" x2="80" y2="20" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
            <line x1="20" y1="80" x2="80" y2="80" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
            <line x1="20" y1="20" x2="20" y2="80" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
            <line x1="80" y1="20" x2="80" y2="80" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
          </g>
        )}
      </svg>
      
      {/* Timer Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold transition-all duration-300 ${
          isConnecting ? 'animate-pulse text-gray-400' : 'text-gray-900'
        }`}>
          {isConnecting ? '••' : `${timeRemaining}s`}
        </span>
        <span className="text-xs text-gray-500">
          {isConnecting ? 'connecting' : 'remaining'}
        </span>
      </div>
      
      {/* Breathing Background Effect */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${
        direction === 'Call' 
          ? 'from-green-400/10 to-emerald-400/10' 
          : 'from-red-400/10 to-rose-400/10'
      } animate-breathing -z-10`} />
    </div>
  );
};

export default EnhancedTimerCircle;
