
import React from 'react';
import { Wifi, Zap, Activity } from 'lucide-react';

interface NetworkAnimationProps {
  isActive: boolean;
  phase: 'connecting' | 'trading' | 'analyzing';
}

const NetworkAnimation: React.FC<NetworkAnimationProps> = ({ isActive, phase }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Signal Waves */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-green-400/20 animate-signal-wave"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Orbital Nodes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-24 h-24">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="orbital-node animate-orbit"
              style={{
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${6 + i}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Reverse Orbital Nodes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-20 h-20">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="orbital-node animate-orbit-reverse bg-blue-400"
              style={{
                animationDelay: `${i * 1.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Data Stream Particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="data-particle animate-data-stream"
            style={{
              left: `${20 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Phase-specific icons */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center space-x-2 text-green-600">
          {phase === 'connecting' && <Wifi className="w-4 h-4 animate-pulse" />}
          {phase === 'trading' && <Zap className="w-4 h-4 animate-bounce" />}
          {phase === 'analyzing' && <Activity className="w-4 h-4 animate-pulse" />}
          <span className="text-xs font-medium">
            {phase === 'connecting' && 'Connecting...'}
            {phase === 'trading' && 'Trading...'}
            {phase === 'analyzing' && 'Analyzing...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NetworkAnimation;
