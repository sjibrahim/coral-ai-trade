
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, Users, User, MessageCircle } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/home',
      onClick: () => navigate('/home')
    },
    { 
      icon: BarChart3, 
      label: 'Market', 
      path: '/market',
      onClick: () => navigate('/market')
    },
    { 
      icon: MessageCircle, 
      label: 'Telegram', 
      path: '/telegram',
      onClick: () => window.open('https://t.me/coraltrading', '_blank')
    },
    { 
      icon: Users, 
      label: 'Team', 
      path: '/team',
      onClick: () => navigate('/team')
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/profile',
      onClick: () => navigate('/profile')
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800/50 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive 
                  ? 'text-teal-400 bg-teal-400/10' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
