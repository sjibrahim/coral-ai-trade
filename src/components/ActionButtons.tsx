
import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, BarChart3, Wallet } from "lucide-react";

const ActionButtons = () => {
  const buttons = [
    {
      text: "Recharge",
      icon: <ArrowDownLeft className="w-5 h-5" />,
      link: "/deposit",
      primary: true,
    },
    {
      text: "Withdraw",
      icon: <ArrowUpRight className="w-5 h-5" />,
      link: "/withdraw",
    },
    {
      text: "Trade",
      icon: <BarChart3 className="w-5 h-5" />,
      link: "/market",
    },
    {
      text: "USDT",
      icon: <Wallet className="w-5 h-5" />,
      link: "/usdt-withdraw",
    },
  ];

  return (
    <div className="flex justify-between px-5 py-6">
      {buttons.map((button, index) => (
        <Link
          key={index}
          to={button.link}
          className="flex flex-col items-center text-center w-16"
        >
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              button.primary
                ? "bg-primary text-white shadow-xl shadow-primary/20"
                : "bg-white/10 text-white"
            } mb-1`}
          >
            {button.icon}
          </div>
          <span className="text-xs font-medium text-white">{button.text}</span>
        </Link>
      ))}
    </div>
  );
};

export default ActionButtons;
