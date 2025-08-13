
import { Link } from "react-router-dom";
import { 
  Wallet, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Gift, 
  CreditCard, 
  HelpCircle,
  Info
} from "lucide-react";

const ActionGrid = () => {
  const actions = [
    {
      icon: <Wallet className="w-6 h-6" />,
      label: "Deposit",
      link: "/deposit",
      bg: "from-orange-400 to-orange-500"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: "Withdraw cash",
      link: "/withdraw",
      bg: "from-green-400 to-green-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Invite friends",
      link: "/invite",
      bg: "from-teal-400 to-teal-500"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: "Check in",
      link: "/checkin",
      bg: "from-purple-400 to-purple-500"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      label: "Promo rewards",
      link: "/rewards",
      bg: "from-red-400 to-red-500"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      label: "Bank Card",
      link: "/bank-details",
      bg: "from-blue-400 to-blue-500"
    },
    {
      icon: <Info className="w-6 h-6" />,
      label: "Instruction",
      link: "/support",
      bg: "from-cyan-400 to-cyan-500"
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      label: "Help",
      link: "/support",
      bg: "from-indigo-400 to-indigo-500"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.link}
          className="group flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50/50 transition-all duration-300"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.bg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">
              {action.icon}
            </div>
          </div>
          <span className="text-xs text-center text-gray-300 font-medium leading-tight">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default ActionGrid;
