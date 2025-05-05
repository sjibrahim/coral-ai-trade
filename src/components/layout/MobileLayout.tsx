
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronLeft, Bell } from 'lucide-react';
import { useState } from 'react';
import MobileNavbar from './MobileNavbar';
import SideMenu from './SideMenu';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  rightActions?: ReactNode;
}

const MobileLayout = ({ 
  children, 
  title,
  showBackButton = false,
  rightActions 
}: MobileLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const goBack = () => {
    navigate(-1);
  };
  
  // Only show the navbar on main pages
  const shouldShowNavbar = ['/home', '/market', '/team', '/profile', '/'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      {(title || showBackButton) && (
        <header className="sticky top-0 z-20 px-4 py-4 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/40">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <button 
                onClick={goBack} 
                className="p-2 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="h-6 w-6 text-primary" />
              </button>
            ) : (
              <button 
                onClick={toggleMenu} 
                className="p-2 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
            {title && (
              <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{title}</h1>
            )}
          </div>
          {rightActions ? (
            <div className="flex items-center gap-2">
              {rightActions}
            </div>
          ) : (
            <button className="p-2 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}
        </header>
      )}

      {/* Side Menu */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      {shouldShowNavbar && <MobileNavbar />}
    </div>
  );
};

export default MobileLayout;
