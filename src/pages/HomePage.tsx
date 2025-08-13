
import { useState, useEffect } from "react";
import { Eye, EyeOff, Bot } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMarketData } from "@/services/api";
import PromotionalBanner from "@/components/PromotionalBanner";
import ActionGrid from "@/components/ActionGrid";
import PromotionalVideo from "@/components/PromotionalVideo";
import CoinsList from "@/components/CoinsList";
import BottomNavigation from "@/components/BottomNavigation";

interface CryptoData {
  id: string | number;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  market_cap?: string;
  volume_24h?: string;
  rank?: string;
  status?: string | number;
  picks?: number | string;
  home?: number | string;
  change?: number;
}

const HomePage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const { user } = useAuth();
  
  const walletAmount = user?.wallet ? parseFloat(user.wallet) : 0;
  const incomeAmount = user?.income ? parseFloat(user.income) : 0;
  const totalBalance = walletAmount + incomeAmount;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Scrollable content */}
      <div className="pb-20"> {/* Add padding bottom for navigation */}
        {/* Top header with logo and icons */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">TC</span>
            </div>
            <span className="text-lg font-bold text-white">TCPatel</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs">📅</span>
            </div>
            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs">🎮</span>
            </div>
            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs">📱</span>
            </div>
          </div>
        </div>

        {/* Future tagline */}
        <div className="px-4 mb-6">
          <p className="text-gray-400 text-sm flex items-center">
            <span className="mr-2">🔊</span>
            for the future and intelligently control every risk
          </p>
        </div>

        {/* Promotional Banner Carousel */}
        <PromotionalBanner />

        {/* Action Grid */}
        <ActionGrid />

        {/* Promotional Video */}
        <PromotionalVideo />

        {/* Coins List Section */}
        <CoinsList />
      </div>

      {/* AI Assistant Button */}
      <div className="fixed bottom-24 right-4 z-40">
        <button className="w-14 h-14 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Bot className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default HomePage;
