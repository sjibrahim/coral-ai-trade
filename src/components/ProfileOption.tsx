
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ProfileOptionProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  className?: string;
  badge?: string | number;
  onClick?: () => void;
}

const ProfileOption = ({ icon, label, to, className, badge, onClick }: ProfileOptionProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center justify-between p-3.5 rounded-lg transition-all hover:bg-accent/20 border border-border/30 animate-fade-in bg-card/40",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary/30 backdrop-blur-sm border border-border/30 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center">
        {badge && (
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs mr-1.5">
            {badge}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  );
};

export default ProfileOption;
