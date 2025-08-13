
import React from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';

const CoinPage = () => {
  const { coinId } = useParams();

  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">
          Coin Details: {coinId}
        </h1>
        <div className="bg-white/5 rounded-lg p-6 text-white">
          <p>Coin details page for {coinId}</p>
          <p className="text-gray-400 mt-2">Coming soon...</p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CoinPage;
