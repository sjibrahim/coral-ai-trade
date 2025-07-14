
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Users, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-emerald-200/50 shadow-2xl">
      <div className="flex justify-between items-center h-18 px-6 max-w-md mx-auto py-2">
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
        "flex flex-col items-center justify-center transition-all duration-300 py-3 px-4 rounded-2xl relative group min-h-[60px]",
        active ? "scale-105" : "hover:scale-105"
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-2xl p-3 transition-all duration-300 shadow-lg",
        active 
          ? "text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/30" 
          : "text-gray-600 bg-gray-100/50 group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:shadow-emerald-200/50"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs mt-2 font-semibold transition-colors duration-300",
        active ? "text-emerald-600" : "text-gray-600 group-hover:text-emerald-600"
      )}>
        {label}
      </span>
      {active && (
        <div className="absolute -bottom-2 w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 animate-pulse shadow-lg"></div>
      )}
    </Link>
  );
};

export default MobileNavbar;
