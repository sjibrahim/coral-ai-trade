
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  UserRound, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Share2, 
  FileText,
  Building, 
  Lock, 
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
        <div className="p-4">
          <MenuItem to="/home" icon={<Home />} onClick={onClose}>Home</MenuItem>
          <MenuItem to="/invite" icon={<Share2 />} onClick={onClose}>Invite</MenuItem>
          <MenuItem to="/deposit" icon={<ArrowDownCircle />} onClick={onClose}>Deposit</MenuItem>
          <MenuItem to="/withdraw" icon={<ArrowUpCircle />} onClick={onClose}>Withdraw</MenuItem>
          <MenuItem to="/deposit-records" icon={<FileText />} onClick={onClose}>Deposit Records</MenuItem>
          <MenuItem to="/withdrawal-records" icon={<FileText />} onClick={onClose}>Withdrawal Records</MenuItem>
          <MenuItem to="/contract-record" icon={<FileText />} onClick={onClose}>Contract Record</MenuItem>
          <MenuItem to="/commission-record" icon={<FileText />} onClick={onClose}>Commission Record</MenuItem>
          <MenuItem to="/salary-record" icon={<FileText />} onClick={onClose}>Salary Record</MenuItem>
          <MenuItem to="/bank" icon={<Building />} onClick={onClose}>Bank Details</MenuItem>
          <MenuItem to="/change-password" icon={<Lock />} onClick={onClose}>Change Password</MenuItem>
          <MenuItem to="/support" icon={<HelpCircle />} onClick={onClose}>Support</MenuItem>
          <MenuItem to="/market" icon={<LayoutDashboard />} onClick={onClose}>Market</MenuItem>
          <MenuItem to="/team" icon={<Users />} onClick={onClose}>Team</MenuItem>
          <MenuItem to="/coin" icon={<Coins />} onClick={onClose}>Coin</MenuItem>
          <MenuItem to="/profile" icon={<UserRound />} onClick={onClose}>Profile</MenuItem>
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
      className="flex items-center gap-3 px-4 py-3 text-foreground rounded-lg hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export default SideMenu;
