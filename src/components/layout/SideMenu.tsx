
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Share2, 
  FileText,
  Building, 
  KeySquare, 
  HelpCircle, 
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Side menu */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-72 bg-sidebar z-40 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="mb-8 flex items-center justify-center">
            <div className="bg-gradient-to-r from-primary to-blue-400 p-0.5 rounded-xl">
              <div className="bg-sidebar px-6 py-3 rounded-xl">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  CryptoTrader
                </h1>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs uppercase text-muted-foreground ml-4">Main</p>
              <MenuItem to="/home" icon={<Home />} onClick={onClose}>Home</MenuItem>
              <MenuItem to="/market" icon={<LayoutDashboard />} onClick={onClose}>Market</MenuItem>
              <MenuItem to="/team" icon={<Users />} onClick={onClose}>Team</MenuItem>
              <MenuItem to="/profile" icon={<UserCircle />} onClick={onClose}>Profile</MenuItem>
              <MenuItem to="/coin" icon={<Coins />} onClick={onClose}>Coin</MenuItem>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-xs uppercase text-muted-foreground ml-4">Transactions</p>
              <MenuItem to="/invite" icon={<Share2 />} onClick={onClose}>Invite</MenuItem>
              <MenuItem to="/deposit" icon={<ArrowDownCircle />} onClick={onClose}>Deposit</MenuItem>
              <MenuItem to="/withdraw" icon={<ArrowUpCircle />} onClick={onClose}>Withdraw</MenuItem>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-xs uppercase text-muted-foreground ml-4">Records</p>
              <MenuItem to="/deposit-records" icon={<FileText />} onClick={onClose}>Deposit Records</MenuItem>
              <MenuItem to="/withdrawal-records" icon={<FileText />} onClick={onClose}>Withdrawal Records</MenuItem>
              <MenuItem to="/contract-record" icon={<FileText />} onClick={onClose}>Contract Record</MenuItem>
              <MenuItem to="/commission-record" icon={<FileText />} onClick={onClose}>Commission Record</MenuItem>
              <MenuItem to="/salary-record" icon={<FileText />} onClick={onClose}>Salary Record</MenuItem>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-xs uppercase text-muted-foreground ml-4">Account</p>
              <MenuItem to="/bank" icon={<Building />} onClick={onClose}>Bank Details</MenuItem>
              <MenuItem to="/change-password" icon={<KeySquare />} onClick={onClose}>Change Password</MenuItem>
              <MenuItem to="/support" icon={<HelpCircle />} onClick={onClose}>Support</MenuItem>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-0 w-full px-6">
            <div className="glass-card p-4 rounded-lg text-center space-y-2">
              <p className="text-sm text-muted-foreground">Need help with trading?</p>
              <Link 
                to="/support" 
                onClick={onClose}
                className="block w-full py-2 bg-primary/80 hover:bg-primary rounded-md transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface MenuItemProps {
  to: string;
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
}

const MenuItem = ({ to, icon, children, onClick }: MenuItemProps) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2.5 text-foreground rounded-lg hover:bg-white/5 transition-colors group"
      onClick={onClick}
    >
      <span className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>
      <span className="group-hover:translate-x-0.5 transition-transform">{children}</span>
    </Link>
  );
};

export default SideMenu;
