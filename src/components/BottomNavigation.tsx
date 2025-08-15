
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, Send, BarChart3, User } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/home",
      isCenter: false,
      isExternal: false
    },
    {
      icon: Users,
      label: "Team",
      path: "/team",
      isCenter: false,
      isExternal: false
    },
    {
      icon: Send,
      label: "Telegram",
      path: "https://t.me/your_telegram_channel",
      isCenter: true,
      isExternal: true
    },
    {
      icon: BarChart3,
      label: "Invest",
      path: "/market",
      isCenter: false,
      isExternal: false
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      isCenter: false,
      isExternal: false
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          
          if (item.isExternal) {
            return (
              <a
                key={index}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300",
                  item.isCenter && "relative"
                )}
              >
                {item.isCenter ? (
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 -mt-6">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className={cn(
                    "w-6 h-6 mb-1 transition-colors duration-300 flex items-center justify-center",
                    "opacity-60"
                  )}>
                    <IconComponent className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <span className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  item.isCenter ? "text-white mt-1" : "text-gray-400"
                )}>
                  {item.label}
                </span>
              </a>
            );
          }
          
          return (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300",
                item.isCenter && "relative"
              )}
            >
              <div className={cn(
                "w-6 h-6 mb-1 transition-colors duration-300 flex items-center justify-center",
                isActive(item.path) ? "opacity-100" : "opacity-60"
              )}>
                <IconComponent className={cn(
                  "w-6 h-6",
                  isActive(item.path) ? "text-white" : "text-gray-400"
                )} />
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                isActive(item.path) ? "text-teal-400" : "text-gray-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
