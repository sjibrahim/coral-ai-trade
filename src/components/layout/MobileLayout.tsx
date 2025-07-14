
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronLeft, Bell, Sparkles, Receipt } from 'lucide-react';
import { useState } from 'react';
import MobileNavbar from './MobileNavbar';
import SideMenu from './SideMenu';
import { ScrollArea } from "../ui/scroll-area";

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

  // Add withdrawal-related paths to display receipt icon instead of bell
  const isWithdrawalPage = ['/withdraw', '/usdt-withdraw', '/withdrawals', '/all-withdrawals'].includes(location.pathname);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-slate-50 via-white to-green-50/30 text-foreground relative overflow-hidden">
      {/* Light theme background with subtle patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Subtle gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-50/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-blue-50/20 to-transparent"></div>
      </div>
      
      {/* Header */}
      {(title || showBackButton) && (
        <header className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <button 
                onClick={goBack} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
            ) : (
              <button 
                onClick={toggleMenu} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center relative"
              >
                {menuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </button>
            )}
            {title && (
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                <Sparkles className="h-4 w-4 text-emerald-500 ml-2 animate-pulse" />
              </div>
            )}
          </div>
          {rightActions ? (
            <div className="flex items-center gap-2">
              {rightActions}
            </div>
          ) : (
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center relative">
              {isWithdrawalPage ? (
                <Receipt className="h-5 w-5 text-gray-700" />
              ) : (
                <Bell className="h-5 w-5 text-gray-700" />
              )}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}
        </header>
      )}

      {/* Side Menu */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content with proper scrolling */}
      <main className="flex-1 overflow-auto relative">
        {noScroll ? (
          <div className="h-full">{children}</div>
        ) : (
          <div className="h-full overflow-y-auto">{children}</div>
        )}
      </main>

      {/* Bottom Navigation - Premium Design */}
      {shouldShowNavbar && <MobileNavbar />}
    </div>
  );
};

export default MobileLayout;
