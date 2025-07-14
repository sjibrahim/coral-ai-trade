
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Users, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-emerald-100/50">
      {/* Floating action bar design */}
      <div className="mx-4 mb-4 mt-2">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-2xl border border-emerald-400/20 p-1">
          <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-xl p-2">
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
        </div>
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
        "flex flex-col items-center justify-center transition-all duration-300 py-2 px-3 rounded-xl relative group min-w-[70px]",
        active ? "scale-105" : "hover:scale-105"
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-xl p-2 transition-all duration-300 shadow-lg",
        active 
          ? "text-emerald-600 bg-white shadow-emerald-500/30 scale-110" 
          : "text-white/80 bg-white/10 group-hover:text-white group-hover:bg-white/20 group-hover:shadow-white/20"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs mt-1 font-semibold transition-colors duration-300 font-trading",
        active ? "text-white" : "text-white/80 group-hover:text-white"
      )}>
        {label}
      </span>
      {active && (
        <div className="absolute -top-1 w-1 h-1 rounded-full bg-white animate-pulse shadow-lg"></div>
      )}
    </Link>
  );
};

export default MobileNavbar;
