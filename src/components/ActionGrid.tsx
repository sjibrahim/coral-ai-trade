
import { Link } from "react-router-dom";

const ActionGrid = () => {
  const actions = [
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/dad254440ae366e04554ed8f859a8852.png",
      label: "Deposit",
      link: "/deposit"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241016/286eb16971a5d58fe9f7c36785814e6a.png",
      label: "Withdraw cash",
      link: "/withdraw"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241016/65a414680fd6bab6f3590a88e97584bf.png",
      label: "Invite friends",
      link: "/invite"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241016/aef64e6784fa317a3baee12d67337107.png",
      label: "Check in",
      link: "/checkin"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/0e2980bd04f45fa515fc0aa5688da83b.png",
      label: "Promo rewards",
      link: "/rewards"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/c34a3a2fd6b48b9b1b3a5032b50a7aaa.png",
      label: "Bank Card",
      link: "/bank-details"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/178523e6a82fdc9243f46a2736b6b466.png",
      label: "Instruction",
      link: "/support"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/178523e6a82fdc9243f46a2736b6b466.png",
      label: "Help",
      link: "/support"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.link}
          className="group flex flex-col items-center space-y-3 p-2 hover:scale-105 transition-all duration-300"
        >
          <div className="w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <img 
              src={action.iconUrl} 
              alt={action.label}
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-xs text-center text-white font-medium leading-tight max-w-16">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default ActionGrid;
