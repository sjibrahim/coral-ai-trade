
import { Card, CardContent } from "@/components/ui/card";
import { Users, Crown, Trophy, Star } from "lucide-react";

interface MemberCardProps {
  member: {
    id: string;
    phone: string;
    active_member: string;
    total_deposit: string;
  };
  level: number;
}

const MemberCard = ({ member, level }: MemberCardProps) => {
  const levelColors = {
    1: "from-emerald-400 to-teal-500",
    2: "from-blue-400 to-cyan-500", 
    3: "from-purple-400 to-pink-500"
  };
  
  const levelBadges = {
    1: <Crown className="h-3 w-3" />,
    2: <Trophy className="h-3 w-3" />,
    3: <Star className="h-3 w-3" />
  };

  return (
    <Card className="mb-2 bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${levelColors[level]} flex items-center justify-center shadow-sm`}>
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <p className="font-medium text-gray-800 text-xs">{member.phone}</p>
                <div className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  member.active_member === "1" 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {levelBadges[level]}
                  <span className="ml-1 text-xs">{member.active_member === "1" ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">Contribution</p>
            <p className="font-bold text-emerald-600 text-sm">₹{parseFloat(member.total_deposit).toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
