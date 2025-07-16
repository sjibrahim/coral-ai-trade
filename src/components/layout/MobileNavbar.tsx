
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MobileNavbarProps {
  showBackButton?: boolean;
  title?: string;
}

const MobileNavbar = ({ showBackButton = false, title = "Trexo" }: MobileNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  const navItems = [
    { 
      icon: '🏠', 
      label: 'Home', 
      path: '/', 
      isActive: location.pathname === '/' 
    },
    { 
      icon: '📊', 
      label: 'Market', 
      path: '/market', 
      isActive: location.pathname === '/market' 
    },
    null, // Placeholder for center button
    { 
      icon: '📈', 
      label: 'Trade', 
      path: '/market', 
      isActive: location.pathname.includes('/coin/') 
    },
    { 
      icon: '👤', 
      label: 'Profile', 
      path: '/profile', 
      isActive: location.pathname === '/profile' 
    }
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 safe-x-padding">
        <div className="flex items-center justify-between h-14 px-4">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <div className="w-8" />
          )}
          
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 pb-safe">
        <div className="flex items-center justify-around h-16 px-4 relative">
          {navItems.map((item, index) => {
            if (item === null) {
              // Center floating plus button
              return (
                <div key={index} className="relative flex-1 flex justify-center">
                  <button
                    onClick={() => navigate('/deposit')}
                    className="absolute -top-6 w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Plus className="w-6 h-6 text-white relative z-10" />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors duration-200 ${
                  item.isActive 
                    ? 'text-emerald-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
                {item.isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileNavbar;
