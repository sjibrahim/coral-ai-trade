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
    <MobileLayout showBackButton title="VIP Program">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* VIP Intro Card */}
        <Card className="bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-xl">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-amber-600 rounded-full">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Unlock Exclusive VIP Benefits</h2>
              <p className="text-sm text-amber-100">Upgrade your VIP level for higher returns and exclusive perks.</p>
            </div>
          </CardContent>
        </Card>
        
        {/* VIP Levels */}
        <div className="space-y-4">
          {vipLevels.map((vip, index) => (
            <Card key={index} className="bg-card rounded-xl p-5 border border-border/40">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-secondary rounded-full">
                  <vip.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">VIP Level {vip.level}</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Investment Required</p>
                  <p className="font-medium">₹{vip.investment}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Daily Income</p>
                  <p className="text-green-500 font-medium">+₹{vip.dailyIncome}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Benefits</p>
                  <p className="font-medium">{vip.benefits}</p>
                </div>
              </div>
              
              <Button className="w-full mt-4">
                Upgrade to VIP {vip.level}
              </Button>
            </Card>
          ))}
        </div>
        
        {/* Additional Benefits Card */}
        <Card className="bg-card rounded-xl p-5 border border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Gift className="w-4 h-4 text-muted-foreground" />
              <span>More Benefits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Enjoy additional benefits such as dedicated support, higher withdrawal limits, and exclusive events as you climb the VIP ladder.
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default VipPage;
