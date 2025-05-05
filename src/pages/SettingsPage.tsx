
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Bell, ChevronRight, CreditCard, Key, Lock, LogOut, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  return (
    <MobileLayout showBackButton title="Settings">
      <div className="flex flex-col h-full p-4 max-w-md mx-auto pb-8">
        {/* User Profile Section */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-border/40">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
              JD
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold">John Doe</h2>
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
          </div>
          <Link to="/profile" className="w-full py-2 bg-primary/20 hover:bg-primary/30 transition-colors rounded-lg text-sm font-medium text-primary flex items-center justify-center">
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Link>
        </div>
        
        {/* Settings Groups */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-1">Account Settings</h3>
            <div className="space-y-1 rounded-lg overflow-hidden bg-card/50 border border-border/30">
              <SettingsItem 
                icon={<CreditCard className="w-4 h-4" />} 
                label="Bank Details" 
                to="/bank"
              />
              <SettingsItem 
                icon={<Key className="w-4 h-4" />} 
                label="Change Password" 
                to="/change-password"
              />
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-1">Notifications</h3>
            <div className="space-y-1 rounded-lg overflow-hidden bg-card/50 border border-border/30">
              <SettingsItemWithSwitch 
                icon={<Bell className="w-4 h-4" />} 
                label="Push Notifications" 
                value={true}
              />
              <SettingsItemWithSwitch 
                icon={<Bell className="w-4 h-4" />} 
                label="Email Notifications" 
                value={false}
              />
            </div>
          </div>
          
          {/* Security */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-1">Security</h3>
            <div className="space-y-1 rounded-lg overflow-hidden bg-card/50 border border-border/30">
              <SettingsItemWithSwitch 
                icon={<Shield className="w-4 h-4" />} 
                label="Two-Factor Authentication" 
                value={false}
              />
              <SettingsItemWithSwitch 
                icon={<Lock className="w-4 h-4" />} 
                label="Biometric Login" 
                value={true}
              />
            </div>
          </div>
          
          {/* Logout */}
          <Button variant="destructive" className="w-full flex items-center gap-2 mt-6">
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            App Version: 1.0.0
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const SettingsItem = ({ icon, label, to }: SettingsItemProps) => {
  return (
    <Link 
      to={to} 
      className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <span>{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </Link>
  );
};

interface SettingsItemWithSwitchProps {
  icon: React.ReactNode;
  label: string;
  value: boolean;
}

const SettingsItemWithSwitch = ({ icon, label, value }: SettingsItemWithSwitchProps) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <span>{label}</span>
      </div>
      <Switch checked={value} />
    </div>
  );
};

export default SettingsPage;
