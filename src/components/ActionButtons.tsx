
import { ArrowDownCircle, ArrowUpCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const ActionButtons = () => {
  return (
    <div className="flex justify-around items-center px-4 py-2">
      <ActionButton icon={<ArrowDownCircle size={22} />} label="DEPOSIT" to="/deposit" color="bg-blue-500" />
      <ActionButton icon={<ArrowUpCircle size={22} />} label="WITHDRAW" to="/withdraw" color="bg-green-500" />
      <ActionButton icon={<Share2 size={22} />} label="INVITE" to="/invite" color="bg-purple-500" />
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  color: string;
}

const ActionButton = ({ icon, label, to, color }: ActionButtonProps) => {
  return (
    <Link to={to} className="flex flex-col items-center animate-fade-in group">
      <div className={cn(
        `w-12 h-12 rounded-full ${color} bg-opacity-20 text-primary flex items-center justify-center mb-1.5`,
        "backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-all",
        "shadow-lg animate-pulse-glow"
      )}>
        {icon}
      </div>
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </Link>
  );
};

export default ActionButtons;
