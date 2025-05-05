
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Users, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-background/60 backdrop-blur-lg border-t border-border/40 px-2 rounded-t-xl">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
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
        "flex flex-col items-center justify-center w-full h-full transition-all",
        active 
          ? "text-primary scale-110" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div className={cn(
        "flex items-center justify-center p-1.5 rounded-full",
        active && "bg-primary/10"
      )}>
        {icon}
      </div>
      <span className="text-xs mt-0.5">{label}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5 animate-pulse"></div>}
    </Link>
  );
};

export default MobileNavbar;
