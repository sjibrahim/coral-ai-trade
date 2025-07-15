import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Moon, Globe, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  // Sample settings data (replace with actual data fetching)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Implement notification settings update logic here
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
    // Implement dark mode settings update logic here
  };
  
  return (
    <MobileLayout showBackButton title="Settings">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Account Settings */}
        <Card className="bg-card rounded-xl p-5">
          <CardHeader className="p-0 mb-4 space-y-0.5">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <Link to="/profile" className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary/50 transition-colors">
              <span className="text-base font-medium">Edit Profile</span>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link to="/change-password" className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary/50 transition-colors">
              <span className="text-base font-medium">Change Password</span>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="bg-card rounded-xl p-5">
          <CardHeader className="p-0 mb-4 space-y-0.5">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>App Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between rounded-lg p-3">
              <span className="text-base font-medium">Notifications</span>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={handleNotificationsToggle} />
            </div>
            <div className="flex items-center justify-between rounded-lg p-3">
              <span className="text-base font-medium">Dark Mode</span>
              <Switch id="dark-mode" checked={darkModeEnabled} onCheckedChange={handleDarkModeToggle} />
            </div>
            <Link to="/support" className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary/50 transition-colors">
              <span className="text-base font-medium">Support</span>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-card rounded-xl p-5">
          <CardHeader className="p-0 mb-4 space-y-0.5">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <Link to="/security" className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary/50 transition-colors">
              <span className="text-base font-medium">Security Options</span>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;
