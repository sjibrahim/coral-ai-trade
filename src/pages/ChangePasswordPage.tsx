
import MobileLayout from "@/components/layout/MobileLayout";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Success notification
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully",
      duration: 3000,
    });
    
    // Reset form
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  return (
    <MobileLayout showBackButton title="Change Password">
      <div className="p-4 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl p-5 space-y-6">
            <div className="relative">
              <label className="block text-muted-foreground mb-2">Current Password</label>
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full bg-muted p-3 pr-10 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-10 text-muted-foreground"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="relative">
              <label className="block text-muted-foreground mb-2">New Password</label>
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full bg-muted p-3 pr-10 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-10 text-muted-foreground"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="relative">
              <label className="block text-muted-foreground mb-2">Confirm New Password</label>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-muted p-3 pr-10 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-10 text-muted-foreground"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-primary text-white text-lg font-medium"
          >
            UPDATE PASSWORD
          </button>
        </form>
      </div>
    </MobileLayout>
  );
};

export default ChangePasswordPage;
