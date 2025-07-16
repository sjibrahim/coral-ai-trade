import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, Users, UserCircle, ChevronLeft, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavbarProps {
  showBackButton?: boolean;
  title?: string;
}

const MobileNavbar = ({ showBackButton = false, title = "Trexo" }: MobileNavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleDepositClick = () => {
    navigate('/deposit');
  };

  if (showBackButton) {
    // Show header with back button instead of bottom navigation
    return (
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          onClick={() => window.history.back()}
          className="mr-3 p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </header>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-emerald-100/50">
      {/* Mobile-friendly floating navigation */}
      <div className="px-2 py-2">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg border border-emerald-400/20 p-1">
          <div className="flex justify-around items-center bg-white/10 backdrop-blur-sm rounded-xl py-2 px-1">
            <NavItem 
              to="/home" 
              icon={<Home className="h-4 w-4" />} 
              label="Home" 
              active={isActive('/home') || isActive('/')} 
            />
            <NavItem 
              to="/market" 
              icon={<LayoutDashboard className="h-4 w-4" />} 
              label="Market" 
              active={isActive('/market')} 
            />
            
            {/* Center Plus Button - Similar to reference */}
            <button
              onClick={handleDepositClick}
              className="flex flex-col items-center justify-center transition-all duration-300 py-1 px-2 rounded-xl relative group"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Plus className="h-5 w-5 text-emerald-600 font-bold" />
              </div>
              <span className="text-xs mt-1 font-medium text-white/90">
                Deposit
              </span>
            </button>
            
            <NavItem 
              to="/team" 
              icon={<Users className="h-4 w-4" />} 
              label="Team" 
              active={isActive('/team')} 
            />
            <NavItem 
              to="/profile" 
              icon={<UserCircle className="h-4 w-4" />} 
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
        "flex flex-col items-center justify-center transition-all duration-300 py-1 px-2 rounded-xl relative group",
        active ? "scale-105" : "hover:scale-105"
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-lg p-2 transition-all duration-300",
        active 
          ? "text-emerald-600 bg-white shadow-md scale-105" 
          : "text-white/80 bg-white/10 group-hover:text-white group-hover:bg-white/20"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs mt-1 font-medium transition-colors duration-300",
        active ? "text-white font-semibold" : "text-white/80 group-hover:text-white"
      )}>
        {label}
      </span>
      {active && (
        <div className="absolute -top-0.5 w-1 h-1 rounded-full bg-white shadow-sm"></div>
      )}
    </Link>
  );
};

export default MobileNavbar;
