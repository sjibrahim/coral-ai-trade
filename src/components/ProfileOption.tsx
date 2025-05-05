
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProfileOptionProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  className?: string;
}

const ProfileOption = ({ icon, label, to, className }: ProfileOptionProps) => {
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl transition-all hover:bg-accent/30 border border-border/40",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
};

export default ProfileOption;
