
import React, { useState, useEffect } from 'react';

interface TradingStatusMessagesProps {
  timeRemaining: number;
  duration: number;
  direction: 'Call' | 'Put';
}

const TradingStatusMessages: React.FC<TradingStatusMessagesProps> = ({
  timeRemaining,
  duration,
  direction,
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [phase, setPhase] = useState<'connecting' | 'trading' | 'analyzing'>('connecting');

  const messages = {
    connecting: [
      'Connecting to exchange...',
      'Establishing secure connection...',
      'Authenticating with market...',
    ],
    trading: [
      `Executing ${direction} position...`,
      'Monitoring market movements...',
      'Processing trade signals...',
      'Analyzing price action...',
    ],
    analyzing: [
      'Calculating final results...',
      'Processing trade outcome...',
      'Finalizing position...',
    ],
  };

  useEffect(() => {
    const totalProgress = (duration - timeRemaining) / duration;
    
    if (totalProgress < 0.1) {
      setPhase('connecting');
    } else if (totalProgress < 0.9) {
      setPhase('trading');
    } else {
      setPhase('analyzing');
    }
  }, [timeRemaining, duration]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages[phase].length);
    }, 2000);

    return () => clearInterval(interval);
  }, [phase, messages]);

  return (
    <div className="text-center mb-6">
      <div className="h-12 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-lg animate-pulse" />
          <p className="relative text-sm text-gray-600 font-medium px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 animate-fade-in-scale">
            {messages[phase][currentMessage]}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2 mt-2">
        {messages[phase].map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentMessage ? 'bg-green-500 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TradingStatusMessages;
