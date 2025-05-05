
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
              <button onClick={goBack} className="p-2 rounded-full hover:bg-accent/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-accent/50 transition-colors">
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
            {title && <h1 className="text-xl font-semibold">{title}</h1>}
          </div>
          {rightActions && (
            <div className="flex items-center gap-2">
              {rightActions}
            </div>
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
