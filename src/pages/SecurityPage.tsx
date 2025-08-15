
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Eye, EyeOff, Shield, Key, Lock, CheckCircle } from "lucide-react";
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
    <MobileLayout showBackButton title="Security Settings" hideFooter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="p-4 space-y-6">
          {/* Header Card */}
          <Card className="bg-gradient-to-r from-emerald-500/20 to-green-600/20 border-emerald-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-xl font-bold mb-2 text-white">Security Settings</h1>
              <p className="text-emerald-300 text-sm">Keep your account secure with a strong password</p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                    <Key className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Change Password</h2>
                  <p className="text-sm text-gray-400">Update your password to enhance security</p>
                </div>

                <div className="relative">
                  <label className="block text-gray-300 text-sm font-medium mb-3">Current Password</label>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 p-4 pr-12 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter current password"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-300 transition-colors"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <div className="relative">
                  <label className="block text-gray-300 text-sm font-medium mb-3">New Password</label>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 p-4 pr-12 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter new password"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-300 transition-colors"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <div className="relative">
                  <label className="block text-gray-300 text-sm font-medium mb-3">Confirm New Password</label>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 p-4 pr-12 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm new password"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-300 transition-colors"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-start">
                    <Lock className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-300 mb-2">Password Requirements</h3>
                      <ul className="text-sm text-blue-200 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-blue-400 mr-2" />
                          At least 8 characters long
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-blue-400 mr-2" />
                          Mix of letters and numbers recommended
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-blue-400 mr-2" />
                          Avoid using personal information
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-base font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  UPDATING PASSWORD...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Shield className="w-5 h-5 mr-2" />
                  UPDATE PASSWORD
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SecurityPage;
