
import MobileLayout from "@/components/layout/MobileLayout";
import { mockTeamStats } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TeamPage = () => {
  const [activeLevel, setActiveLevel] = useState('Level 1');
  
  const levels = [
    'Level 1',
    'Level 2',
    'Level 3'
  ];
  
  return (
    <MobileLayout title="Team">
      <div className="p-4 space-y-6 animate-fade-in pb-20">
        {/* Team Stats */}
        <div className="bg-card rounded-xl p-5">
          {mockTeamStats.levels.map((level) => (
            <div key={level.id} className="flex justify-between py-3">
              <span className="text-lg font-medium">{level.id}</span>
              <span className="text-lg">
                <span className="text-primary">{level.current}</span>
                <span className="text-muted-foreground">/{level.total}</span>
              </span>
            </div>
          ))}
        </div>
        
        {/* Level Tabs */}
        <div className="flex rounded-lg overflow-hidden">
          {levels.map((level) => (
            <button
              key={level}
              className={cn(
                "flex-1 py-3 text-center transition-colors",
                activeLevel === level 
                  ? "bg-primary text-white" 
                  : "bg-card text-muted-foreground"
              )}
              onClick={() => setActiveLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
        
        {/* Team Members */}
        <div className="space-y-4">
          {mockTeamStats.members.map((member) => (
            <div key={member.id} className="bg-card rounded-xl p-4 border border-border/40">
              <p className="text-lg font-medium mb-2">{member.id}</p>
              <div className="flex justify-between text-muted-foreground">
                <div>
                  <p>Amount</p>
                  <p>₹{member.amount}</p>
                </div>
                <div className="text-right">
                  <p>Date</p>
                  <p>{member.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default TeamPage;
