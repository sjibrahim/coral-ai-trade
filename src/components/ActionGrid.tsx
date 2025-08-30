

import { Link } from "react-router-dom";

interface ActionGridProps {
  hideCheckin?: boolean;
  hideRewards?: boolean;
}

const ActionGrid = ({ hideCheckin = false, hideRewards = false }: ActionGridProps) => {
  const allActions = [
    {
      icon: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/dad254440ae366e04554ed8f859a8852.png",
      label: "Deposit",
      link: "/deposit"
    },
    {
      icon: "https://tnl-icons.duckdns.org/green/dash/upload/20241016/286eb16971a5d58fe9f7c36785814e6a.png",
      label: "Withdraw cash",
      link: "/withdraw"
    },
    {
      icon: "https://tnl-icons.duckdns.org/green/dash/upload/20241016/65a414680fd6bab6f3590a88e97584bf.png",
      label: "Invite friends",
      link: "/invite"
    },
    {
      icon: "https://tnl-icons.duckdns.org/green/dash/upload/20241016/aef64e6784fa317a3baee12d67337107.png",
      label: "Check in",
      link: "/checkin"
    },
    {
      icon: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/0e2980bd04f45fa515fc0aa5688da83b.png",
      label: "Promo rewards",
      link: "/rewards"
    },
    {
      icon: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/c34a3a2fd6b48b9b1b3a5032b50a7aaa.png",
      label: "Bank Card",
      link: "/bank-details"
    },
    {
      icon: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/178523e6a82fdc9243f46a2736b6b466.png",
      label: "Instruction",
      link: "/support"
    },
    {
      icon: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/178523e6a82fdc9243f46a2736b6b466.png",
      label: "Help",
      link: "/support"
    }
  ];

  // Filter out actions based on props
  const actions = allActions.filter(action => {
    if (hideCheckin && action.label === "Check in") return false;
    if (hideRewards && action.label === "Promo rewards") return false;
    return true;
  });

  return (
    <div className="grid grid-cols-3 gap-3 p-2">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.link}
          className="flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-gray-50/10 transition-all duration-300"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src={action.icon} 
              alt={action.label}
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="text-[10px] text-center text-gray-300 font-medium leading-tight max-w-[60px]">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default ActionGrid;

