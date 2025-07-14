
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Eye, EyeOff, Shield, Key, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updatePassword } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const SecurityPage = () => {
  const { updateProfile } = useAuth();
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({
          title: "Authentication error",
          description: "Please login again",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      const response = await updatePassword(token, formData.currentPassword, formData.newPassword);
      
      if (response.status) {
        // Update user profile to get latest data
        await updateProfile();
        
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        // Success notification
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully",
          duration: 3000,
        });
      } else {
        toast({
          title: "Update failed",
          description: response.msg || "Failed to update password",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating password",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MobileLayout showBackButton title="Security Settings">
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          {/* Header Card */}
          <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg mb-6">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-bold mb-1">Security Settings</h1>
              <p className="text-emerald-100 text-sm">Keep your account secure</p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Key className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                  <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                </div>

                <div className="relative">
                  <label className="block text-gray-700 text-base font-medium mb-2">Current Password</label>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 p-4 pr-12 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter current password"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-4 top-12 text-gray-400 hover:text-gray-600"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 text-base font-medium mb-2">New Password</label>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 p-4 pr-12 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter new password"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-4 top-12 text-gray-400 hover:text-gray-600"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 text-base font-medium mb-2">Confirm New Password</label>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 p-4 pr-12 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Confirm new password"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-4 top-12 text-gray-400 hover:text-gray-600"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Lock className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900 mb-1">Password Requirements</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Mix of letters and numbers recommended</li>
                        <li>• Avoid using personal information</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-base font-medium shadow-lg transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  UPDATING...
                </span>
              ) : (
                "UPDATE PASSWORD"
              )}
            </button>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SecurityPage;
