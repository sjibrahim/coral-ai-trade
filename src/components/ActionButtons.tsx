
import { ArrowDownCircle, ArrowUpCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const ActionButtons = () => {
  return (
    <div className="flex justify-around items-center p-4">
      <ActionButton icon={<ArrowDownCircle size={28} />} label="DEPOSIT" to="/deposit" />
      <ActionButton icon={<ArrowUpCircle size={28} />} label="WITHDRAW" to="/withdraw" />
      <ActionButton icon={<Share2 size={28} />} label="INVITE" to="/invite" />
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const ActionButton = ({ icon, label, to }: ActionButtonProps) => {
  return (
    <Link to={to} className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
        {icon}
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </Link>
  );
};

export default ActionButtons;
