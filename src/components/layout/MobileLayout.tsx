
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-x-hidden">
      {/* Main Content */}
      <main className="pb-20 min-h-screen">
        {children}
      </main>
      <MobileNavbar />
    </div>
  );
};

export default MobileLayout;
