
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ProfileOptionProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  className?: string;
  badge?: string | number;
}

const ProfileOption = ({ icon, label, to, className, badge }: ProfileOptionProps) => {
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl transition-all hover:bg-accent/30 border border-border/40 animate-fade-in",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/40 flex items-center justify-center">
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center">
        {badge && (
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs mr-2">
            {badge}
          </span>
        )}
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Link>
  );
};

export default ProfileOption;
