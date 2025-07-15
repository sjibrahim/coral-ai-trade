
import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, Star, Crown } from "lucide-react";

interface TeamStatsCardProps {
  activeLevel1: number;
  activeLevel2: number;
  activeLevel3: number;
  level1Total: number;
  level2Total: number;
  level3Total: number;
}

const TeamStatsCard = ({
  activeLevel1,
  activeLevel2,
  activeLevel3,
  level1Total,
  level2Total,
  level3Total,
}: TeamStatsCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-600 text-white border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold mb-1">My Network</h1>
          <p className="text-emerald-100 text-sm">Build your trading empire</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Level 1", active: activeLevel1, total: level1Total, icon: Crown, color: "bg-yellow-400" },
            { label: "Level 2", active: activeLevel2, total: level2Total, icon: Trophy, color: "bg-blue-400" },
            { label: "Level 3", active: activeLevel3, total: level3Total, icon: Star, color: "bg-purple-400" }
          ].map((level, idx) => (
            <div key={idx} className="bg-white/15 rounded-xl p-3 backdrop-blur-sm text-center">
              <div className={`h-3 w-3 rounded-full ${level.color} mx-auto mb-2`}></div>
              <p className="text-white/90 text-xs font-medium mb-1">{level.label}</p>
              <p className="text-white text-lg font-bold">{level.active}/{level.total}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamStatsCard;
