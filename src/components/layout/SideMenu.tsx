
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  LineChart,
  PlusCircle,
  ArrowDownCircle,
  Clock,
  FileText,
  Users,
  Award,
  User,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SideMenu = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: LineChart, label: "Market", path: "/market" },
    { icon: PlusCircle, label: "Deposit", path: "/deposit" },
    { icon: ArrowDownCircle, label: "Withdraw", path: "/withdraw" },
    { 
      icon: Clock, 
      label: "Records", 
      path: "#",
      subItems: [
        { label: "Deposit Records", path: "/deposit-records" },
        { label: "Withdrawal Records", path: "/withdrawal-records" },
        { label: "Transaction Records", path: "/transaction-records" },
        { label: "Contract Records", path: "/contract-record" },
        { label: "Salary Records", path: "/commission-record" },
      ]
    },
    { icon: Users, label: "My Team", path: "/team" },
    { icon: Award, label: "Rewards", path: "/rewards" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LifeBuoy, label: "Support", path: "/support" },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Logo section */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
              <img 
                src="https://ik.imagekit.io/spmcumfu9/nexbit_logo.jpeg" 
                alt="Nexbit Logo" 
                className="w-6 h-6 object-contain rounded-sm" 
              />
            </div>
            <div>
              <h2 className="font-bold">Nexbit</h2>
              <p className="text-xs text-muted-foreground">Trading Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation links - Scrollable */}
        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-3">
            {menuItems.map((item) => (
              <div key={item.label}>
                <NavLink
                  to={item.path !== "#" ? item.path : "#"}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      item.path !== "#" && isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
                
                {/* Sub-items if any */}
                {item.subItems && (
                  <div className="ml-7 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-1.5 rounded-md text-xs transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`
                        }
                      >
                        <span>{subItem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Logout button */}
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
