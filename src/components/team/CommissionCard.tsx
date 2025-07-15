
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Trophy, Star } from "lucide-react";

interface CommissionCardProps {
  level1Commission: string;
  level2Commission: string;
  level3Commission: string;
}

const CommissionCard = ({
  level1Commission,
  level2Commission,
  level3Commission,
}: CommissionCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Crown className="w-5 h-5 text-yellow-500 mr-2" />
          Commission Rates
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { level: "L1", rate: level1Commission, icon: Crown, color: "from-emerald-400 to-teal-500" },
            { level: "L2", rate: level2Commission, icon: Trophy, color: "from-blue-400 to-cyan-500" },
            { level: "L3", rate: level3Commission, icon: Star, color: "from-purple-400 to-pink-500" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/70 backdrop-blur-sm border-0 shadow-sm rounded-xl p-3 text-center">
              <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2`}>
                <item.icon className="h-3 w-3 text-white" />
              </div>
              <p className="text-xs text-gray-600 mb-1">{item.level} Commission</p>
              <p className="text-sm font-bold text-gray-800">{item.rate}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionCard;
