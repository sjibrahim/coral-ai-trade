
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Users, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-[#0F1219] backdrop-blur-lg border-t border-border/20 h-16 pb-safe">
      <div className="flex justify-between items-center h-full px-8 max-w-md mx-auto">
        <NavItem 
          to="/home" 
          icon={<Home className="h-6 w-6" />} 
          label="Home" 
          active={isActive('/home') || isActive('/')} 
        />
        <NavItem 
          to="/market" 
          icon={<LayoutDashboard className="h-6 w-6" />} 
          label="Market" 
          active={isActive('/market')} 
        />
        <NavItem 
          to="/team" 
          icon={<Users className="h-6 w-6" />} 
          label="Team" 
          active={isActive('/team')} 
        />
        <NavItem 
          to="/profile" 
          icon={<UserCircle className="h-6 w-6" />} 
          label="Profile" 
          active={isActive('/profile')} 
        />
      </div>
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
        "flex flex-col items-center justify-center transition-all",
        active ? "scale-110" : ""
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-full transition-colors",
        active 
          ? "text-primary" 
          : "text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs mt-0.5",
        active ? "text-primary" : "text-muted-foreground"
      )}>
        {label}
      </span>
      {active && <div className="w-1 h-1 rounded-full bg-primary mt-0.5"></div>}
    </Link>
  );
};

export default MobileNavbar;
