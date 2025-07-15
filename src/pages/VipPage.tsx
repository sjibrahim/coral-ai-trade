
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Star, Zap, Gift, TrendingUp, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const VipPage = () => {
  const { user } = useAuth();

  // Sample VIP levels data
  const vipLevels = [
    { level: 1, investment: 100, dailyIncome: 5, benefits: "Basic benefits", icon: Star },
    { level: 2, investment: 500, dailyIncome: 30, benefits: "Enhanced benefits", icon: Crown },
    { level: 3, investment: 1000, dailyIncome: 70, benefits: "Premium benefits", icon: Zap },
  ];
  
  return (
    <MobileLayout showBackButton hideNavbar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
        <div className="px-3 py-4">
          {/* Hero Header */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 p-6 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-white/10 transform -translate-x-4 translate-y-4"></div>
            
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center mb-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Crown className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold">VIP Program</h1>
              </div>
              <p className="text-amber-100 text-sm">Unlock exclusive benefits and higher returns</p>
            </div>
          </div>

          {/* VIP Levels */}
          <div className="space-y-4">
            {vipLevels.map((vip, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-lg">
                      <vip.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">VIP Level {vip.level}</h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Investment Required</p>
                      <p className="font-medium text-gray-800">₹{vip.investment}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Daily Income</p>
                      <p className="text-emerald-600 font-medium">+₹{vip.dailyIncome}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Benefits</p>
                      <p className="font-medium text-gray-800">{vip.benefits}</p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white">
                    Upgrade to VIP {vip.level}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Additional Benefits Card */}
          <Card className="mt-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center space-x-2 text-gray-800">
                <Gift className="w-5 h-5 text-amber-500" />
                <span>Additional Benefits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Enjoy additional benefits such as dedicated support, higher withdrawal limits, and exclusive events as you climb the VIP ladder.
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default VipPage;
