
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
  hideNavbar?: boolean;
}

const MobileLayout = ({ 
  children, 
  title,
  showBackButton = false,
  rightActions,
  noScroll = false,
  hideNavbar = false
}: MobileLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const goBack = () => {
    navigate(-1);
  };
  
  // Pages where navbar should be hidden
  const hideNavbarPages = [
    '/deposit', '/withdraw', '/bank', '/transactions', 
    '/salary-record', '/contract-record', '/all-withdrawals',
    '/withdrawals', '/deposit-records', '/withdrawal-records', '/invite'
  ];
  
  const shouldHideNavbar = hideNavbar || hideNavbarPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-x-hidden">
      {/* Header */}
      {(title || showBackButton) && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-emerald-100/50">
          <div className="flex items-center justify-between px-4 h-16">
            {showBackButton && (
              <button 
                onClick={goBack}
                className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-emerald-700" />
              </button>
            )}
            
            {title && (
              <h1 className="text-lg font-bold text-emerald-800 flex-1 text-center">
                {title}
              </h1>
            )}
            
            {rightActions && (
              <div className="flex items-center space-x-2">
                {rightActions}
              </div>
            )}
            
            {!rightActions && showBackButton && <div className="w-10" />}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={shouldHideNavbar ? "min-h-screen pb-4" : "pb-20 min-h-screen"}>
        {children}
      </main>
      
      {/* Fixed Footer */}
      {!shouldHideNavbar && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MobileNavbar />
        </div>
      )}
    </div>
  );
};

export default MobileLayout;
