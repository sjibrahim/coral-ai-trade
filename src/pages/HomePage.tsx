
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Wallet, 
  Users, 
  Gift, 
  DollarSign, 
  ChevronRight,
  Play,
  Star,
  Zap,
  Shield,
  Award,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, refreshUserData, generalSettings } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=300&fit=crop",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=300&fit=crop", 
    "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=300&fit=crop"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const marketData = [
    { symbol: "BTC", price: "$45,231.50", change: "+2.45%", isUp: true },
    { symbol: "ETH", price: "$3,124.80", change: "+1.23%", isUp: true },
    { symbol: "BNB", price: "$312.45", change: "-0.87%", isUp: false },
    { symbol: "ADA", price: "$1.23", change: "+5.67%", isUp: true }
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-blue-500/15 backdrop-blur-xl p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Hello {user?.name || 'Trader'}</h1>
              <p className="text-emerald-300 text-sm">Welcome to CORAL</p>
            </div>
            
            {/* AI Bot Visual */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white/20 rounded-md"></div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent rounded-full opacity-60 animate-pulse"></div>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Image Slider */}
        <div className="relative mx-4 mt-4 mb-6">
          <div className="relative h-48 rounded-xl overflow-hidden">
            {sliderImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">Trade with AI</h3>
                  <p className="text-sm opacity-80">Smart trading solutions</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Slider Dots */}
          <div className="flex justify-center mt-3 gap-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-emerald-400 w-6' : 'bg-white/30'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Action Grid */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 p-4">
              <Button 
                onClick={() => navigate('/deposit')}
                className="w-full h-auto flex-col gap-3 bg-transparent hover:bg-white/10 p-4"
              >
                <Wallet className="w-8 h-8 text-blue-400" />
                <span className="text-white font-medium">Deposit</span>
              </Button>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border-emerald-500/30 p-4">
              <Button 
                onClick={() => navigate('/withdraw')}
                className="w-full h-auto flex-col gap-3 bg-transparent hover:bg-white/10 p-4"
              >
                <DollarSign className="w-8 h-8 text-emerald-400" />
                <span className="text-white font-medium">Withdraw</span>
              </Button>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30 p-4">
              <Button 
                onClick={() => navigate('/team')}
                className="w-full h-auto flex-col gap-3 bg-transparent hover:bg-white/10 p-4"
              >
                <Users className="w-8 h-8 text-purple-400" />
                <span className="text-white font-medium">Team</span>
              </Button>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30 p-4">
              <Button 
                onClick={() => navigate('/invite')}
                className="w-full h-auto flex-col gap-3 bg-transparent hover:bg-white/10 p-4"
              >
                <Gift className="w-8 h-8 text-orange-400" />
                <span className="text-white font-medium">Invite</span>
              </Button>
            </Card>
          </div>
        </div>

        {/* Promotional Video Section */}
        <div className="px-4 mb-6">
          <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Learn Trading</h3>
              <Button size="sm" variant="outline" className="border-blue-400 text-blue-400">
                View All
              </Button>
            </div>
            
            <div className="relative bg-slate-900/50 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
                <Button className="bg-blue-500/20 hover:bg-blue-500/30 rounded-full p-4">
                  <Play className="w-8 h-8 text-blue-400" fill="currentColor" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h4 className="text-white font-medium text-sm">AI Trading Basics</h4>
                <p className="text-slate-300 text-xs">Learn how to trade with AI assistance</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Market Trends */}
        <div className="px-4 mb-6">
          <Card className="bg-slate-800/30 border-slate-600/30">
            <div className="p-4 border-b border-slate-600/30">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Market Trends
                </h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => navigate('/market')}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  View More <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {marketData.map((crypto) => (
                <div key={crypto.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{crypto.symbol[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{crypto.symbol}</p>
                      <p className="text-slate-400 text-sm">{crypto.price}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    crypto.isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {crypto.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span className="text-xs font-medium">{crypto.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Features Footer - Overlapping */}
        <div className="px-4 pb-20">
          <Card className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border-emerald-500/30 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-400/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-white font-semibold mb-4 text-center">Why Choose CORAL?</h3>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-white text-sm font-medium">AI Powered</p>
                  <p className="text-slate-400 text-xs">Smart algorithms</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-white text-sm font-medium">Secure</p>
                  <p className="text-slate-400 text-xs">Bank-grade security</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-white text-sm font-medium">Trusted</p>
                  <p className="text-slate-400 text-xs">Industry leader</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
