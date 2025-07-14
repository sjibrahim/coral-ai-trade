
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Users, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
      <div className="flex justify-between items-center h-16 px-6 max-w-md mx-auto">
        <NavItem 
          to="/home" 
          icon={<Home className="h-5 w-5" />} 
          label="Home" 
          active={isActive('/home') || isActive('/')} 
        />
        <NavItem 
          to="/market" 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          label="Market" 
          active={isActive('/market')} 
        />
        <NavItem 
          to="/team" 
          icon={<Users className="h-5 w-5" />} 
          label="Team" 
          active={isActive('/team')} 
        />
        <NavItem 
          to="/profile" 
          icon={<UserCircle className="h-5 w-5" />} 
          label="Profile" 
          active={isActive('/profile')} 
        />
      </div>
      <div className="h-safe"></div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300 py-2 px-3 rounded-xl relative group",
        active ? "scale-105" : "hover:scale-105"
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-full p-2 transition-all duration-300",
        active 
          ? "text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg" 
          : "text-gray-600 group-hover:text-emerald-600 group-hover:bg-emerald-50"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs mt-1 font-medium transition-colors duration-300",
        active ? "text-emerald-600" : "text-gray-600 group-hover:text-emerald-600"
      )}>
        {label}
      </span>
      {active && (
        <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
      )}
    </Link>
  );
};

export default MobileNavbar;
