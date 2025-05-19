
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronLeft, Bell, Sparkles } from 'lucide-react';
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

  return (
    <div className="flex flex-col h-full w-full bg-[#0d0f17] text-foreground relative">
      {/* Enhanced background with animated elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Animated gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-transparent opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-purple-900/10 to-transparent opacity-20"></div>
        
        {/* Floating crypto symbols */}
        <div className="absolute top-[20%] left-[10%] text-blue-400/10 text-2xl font-bold animate-float" style={{animationDuration: '15s'}}>₿</div>
        <div className="absolute top-[40%] right-[15%] text-purple-400/10 text-2xl font-bold animate-float" style={{animationDuration: '18s', animationDelay: '2s'}}>Ξ</div>
        <div className="absolute top-[70%] left-[20%] text-green-400/10 text-xl font-bold animate-float" style={{animationDuration: '20s', animationDelay: '1s'}}>Ł</div>
        <div className="absolute top-[60%] right-[10%] text-orange-400/10 text-xl font-bold animate-float" style={{animationDuration: '22s', animationDelay: '3s'}}>Ð</div>
        
        {/* Animated circles */}
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="absolute bottom-[20%] right-[20%] w-24 h-24 rounded-full bg-blue-500/5 animate-float" style={{animationDuration: '25s'}}></div>
        <div className="absolute top-[30%] left-[30%] w-20 h-20 rounded-full bg-purple-500/5 animate-float" style={{animationDuration: '20s', animationDelay: '3s'}}></div>
      </div>
      
      {/* Header */}
      {(title || showBackButton) && (
        <header className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between bg-[#0d0f17]/90 backdrop-blur-md border-b border-white/5">
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
                className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse-glow"></span>
              </button>
            )}
            {title && (
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gradient">{title}</h1>
                <Sparkles className="h-3 w-3 text-blue-400/70 ml-1 animate-pulse-glow" />
              </div>
            )}
          </div>
          {rightActions ? (
            <div className="flex items-center gap-2">
              {rightActions}
            </div>
          ) : (
            <button className="p-1.5 rounded-full hover:bg-accent/50 transition-colors flex items-center justify-center relative animate-pulse-glow">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          )}
        </header>
      )}

      {/* Side Menu */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content with ScrollArea for reliable scrolling */}
      <main className="flex-1 overflow-hidden relative">
        {noScroll ? (
          <div className="h-[95%]">{children}</div>
        ) : (
          <ScrollArea className="h-[95%] w-full">{children}</ScrollArea>
        )}
      </main>

      {/* Bottom Navigation - Fixed position to avoid layout shift */}
      {shouldShowNavbar && <MobileNavbar />}
    </div>
  );
};

export default MobileLayout;
