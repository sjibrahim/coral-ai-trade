
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, TrendingUp, BarChart3, User } from "lucide-react";

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
      isCenter: false
    },
    {
      icon: Users,
      label: "Team",
      path: "/team",
      isCenter: false
    },
    {
      icon: TrendingUp,
      label: "Trade",
      path: "/trade",
      isCenter: true
    },
    {
      icon: BarChart3,
      label: "Invest",
      path: "/market",
      isCenter: false
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      isCenter: false
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300",
                item.isCenter && "relative"
              )}
            >
              {item.isCenter ? (
                <div className="w-14 h-14 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 -mt-6">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className={cn(
                  "w-6 h-6 mb-1 transition-colors duration-300 flex items-center justify-center",
                  isActive(item.path) ? "opacity-100" : "opacity-60"
                )}>
                  <IconComponent className={cn(
                    "w-6 h-6",
                    isActive(item.path) ? "text-white" : "text-gray-400"
                  )} />
                </div>
              )}
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                item.isCenter ? "text-white mt-1" : 
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
