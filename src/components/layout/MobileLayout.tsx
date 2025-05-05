
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
  noScroll?: boolean;
}

const MobileLayout = ({ 
  children, 
  title,
  showBackButton = false,
  rightActions,
  noScroll = false
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
  
  // Calculate content style - either scrollable or fixed height
  const contentStyle = noScroll 
    ? "flex-1 flex flex-col" 
    : "flex-1 overflow-y-auto webkit-overflow-scrolling-touch pb-safe";

  return (
    <div className="flex flex-col h-full w-full bg-[#0d0f17] text-foreground relative">
      {/* Header */}
      {(title || showBackButton) && (
        <header className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between bg-[#0d0f17]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <button 
                onClick={goBack} 
                className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={toggleMenu} 
                className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
            {title && (
              <h1 className="text-xl font-semibold">{title}</h1>
            )}
          </div>
          {rightActions ? (
            <div className="flex items-center gap-2">
              {rightActions}
            </div>
          ) : (
            <button className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          )}
        </header>
      )}

      {/* Side Menu */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content */}
      <main className={contentStyle}>
        {children}
      </main>

      {/* Bottom Navigation - Fixed position to avoid layout shift */}
      {shouldShowNavbar && <MobileNavbar />}
    </div>
  );
};

export default MobileLayout;
