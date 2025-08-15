
import { Link } from "react-router-dom";

const ActionGrid = () => {
  const actions = [
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/dad254440ae366e04554ed8f859a8852.png",
      label: "Deposit",
      link: "/deposit",
      bg: "from-orange-400 to-orange-500"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241016/286eb16971a5d58fe9f7c36785814e6a.png",
      label: "Withdraw cash",
      link: "/withdraw",
      bg: "from-green-400 to-green-500"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241016/65a414680fd6bab6f3590a88e97584bf.png",
      label: "Invite friends",
      link: "/invite",
      bg: "from-teal-400 to-teal-500"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241016/aef64e6784fa317a3baee12d67337107.png",
      label: "Check in",
      link: "/checkin",
      bg: "from-purple-400 to-purple-500"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/0e2980bd04f45fa515fc0aa5688da83b.png",
      label: "Promo rewards",
      link: "/rewards",
      bg: "from-red-400 to-red-500"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/c34a3a2fd6b48b9b1b3a5032b50a7aaa.png",
      label: "Bank Card",
      link: "/bank-details",
      bg: "from-blue-400 to-blue-500"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/178523e6a82fdc9243f46a2736b6b466.png",
      label: "Instruction",
      link: "/support",
      bg: "from-cyan-400 to-cyan-500"
    },
    {
      iconUrl: "https://tnl-icons.duckdns.org/green/dash/upload/20241005/178523e6a82fdc9243f46a2736b6b466.png",
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
            <img 
              src={action.iconUrl} 
              alt={action.label}
              className="w-6 h-6 object-contain"
            />
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
