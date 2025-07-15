import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Key, Smartphone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const SecurityPage = () => {
  // Sample data for security options
  const securityOptions = [
    {
      id: "change-password",
      title: "Change Password",
      description: "Update your password regularly to keep your account secure.",
      icon: Lock,
      link: "/change-password",
    },
    {
      id: "two-factor-auth",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security with 2FA.",
      icon: Shield,
      link: "/security", // This should ideally link to a 2FA setup page
    },
    {
      id: "update-email",
      title: "Update Email",
      description: "Keep your email address up to date.",
      icon: Mail,
      link: "/profile", // Link to profile settings where email can be updated
    },
    {
      id: "update-phone",
      title: "Update Phone Number",
      description: "Keep your phone number updated for verification.",
      icon: Smartphone,
      link: "/profile", // Link to profile settings where phone number can be updated
    },
  ];
  
  return (
    <MobileLayout showBackButton title="Security Settings">
      <div className="p-4 space-y-4 animate-fade-in">
        {securityOptions.map((option) => (
          <Card key={option.id} className="bg-card rounded-xl border border-border/50">
            <CardContent className="flex items-center space-x-4 p-4">
              <div className="rounded-md bg-muted p-2">
                <option.icon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">{option.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              <Link to={option.link} className="ml-auto">
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </MobileLayout>
  );
};

export default SecurityPage;
