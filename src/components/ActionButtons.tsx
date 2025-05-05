
import { ArrowDownCircle, ArrowUpCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const ActionButtons = () => {
  return (
    <div className="flex justify-around items-center p-4">
      <ActionButton icon={<ArrowDownCircle size={28} />} label="DEPOSIT" to="/deposit" color="bg-blue-500" />
      <ActionButton icon={<ArrowUpCircle size={28} />} label="WITHDRAW" to="/withdraw" color="bg-green-500" />
      <ActionButton icon={<Share2 size={28} />} label="INVITE" to="/invite" color="bg-purple-500" />
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
    <Link to={to} className="flex flex-col items-center animate-fade-in">
      <div className={`w-14 h-14 rounded-full ${color} bg-opacity-20 text-primary flex items-center justify-center mb-2 backdrop-blur-sm shadow-lg border border-white/10 hover:scale-110 transition-transform animate-pulse-glow`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </Link>
  );
};

export default ActionButtons;
