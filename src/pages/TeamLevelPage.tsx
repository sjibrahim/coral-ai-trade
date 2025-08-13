
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getTeamDetails } from "@/services/api";
import { 
  ArrowLeft, Users, Crown, Trophy, Star,
  Phone, Calendar, TrendingUp, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  invited_by: string;
  level: string;
  active_member: string;
  total_deposit: string;
  total_withdraw: string;
}

const TeamLevelPage = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const levelConfig = {
    "1": { 
      title: "Level 1 Members", 
      icon: Crown, 
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    },
    "2": { 
      title: "Level 2 Members", 
      icon: Trophy, 
      color: "from-blue-400 to-purple-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    "3": { 
      title: "Level 3 Members", 
      icon: Star, 
      color: "from-green-400 to-teal-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    }
  };

  const currentLevelConfig = levelConfig[level as keyof typeof levelConfig];

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await getTeamDetails(token);
        if (response.status && response.data) {
          // Filter members by the selected level
          const filteredMembers = response.data.filter((member: TeamMember) => member.level === level);
          setTeamMembers(filteredMembers);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch team details.",
          });
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
        toast({
          title: "Error",
          description: "Failed to connect to the server.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [level, toast]);

  if (!currentLevelConfig) {
    return <div>Invalid level</div>;
  }

  const activeMembersCount = teamMembers.filter(member => member.active_member === "1").length;
  const totalDeposits = teamMembers.reduce((sum, member) => sum + parseFloat(member.total_deposit || "0"), 0);
  const totalWithdrawals = teamMembers.reduce((sum, member) => sum + parseFloat(member.total_withdraw || "0"), 0);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate("/team")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r", currentLevelConfig.color)}>
              <currentLevelConfig.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">{currentLevelConfig.title}</span>
              <p className="text-xs text-gray-400">{teamMembers.length} Total Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="pb-8">
          {/* Stats Section */}
          <div className="px-4 py-6">
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-center">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">{activeMembersCount}</p>
                  <p className="text-xs text-gray-400">Active</p>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">₹{totalDeposits.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Deposits</p>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">₹{totalWithdrawals.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Withdrawals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="px-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading members...</p>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <currentLevelConfig.icon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No members found in this level</p>
              </div>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member, index) => (
                  <Card key={member.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r", currentLevelConfig.color)}>
                            <span className="text-white font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <h4 className="font-medium text-white text-sm">{member.phone}</h4>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                member.active_member === "1" 
                                  ? "bg-green-500/20 text-green-400" 
                                  : "bg-red-500/20 text-red-400"
                              )}>
                                {member.active_member === "1" ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>ID: {member.id}</span>
                              <span>Invited by: {member.invited_by}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-semibold text-green-400">
                            ₹{parseFloat(member.total_deposit || "0").toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Deposited
                          </div>
                          {parseFloat(member.total_withdraw || "0") > 0 && (
                            <div className="text-xs text-orange-400 mt-1">
                              ₹{parseFloat(member.total_withdraw).toLocaleString()} withdrawn
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLevelPage;
