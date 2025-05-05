
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Users, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-t border-border/40">
      <div className="flex justify-around items-center h-16">
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
          icon={<UserRound className="h-5 w-5" />} 
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
        "flex flex-col items-center justify-center w-full h-full transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default MobileNavbar;
