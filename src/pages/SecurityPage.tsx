
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updatePassword } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

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
        await updateProfile();
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
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
    <MobileLayout showBackButton title="Change Password" noScroll>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="text-center mb-6 pt-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Change Password</h1>
            <p className="text-gray-400 text-sm">Enter your current and new password</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">Current Password</label>
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 p-3 pr-12 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-200"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* New Password */}
            <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 p-3 pr-12 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-200"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 p-3 pr-12 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-200"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-4">
              <p className="text-gray-300 text-sm mb-2">Password Requirements:</p>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Mix of letters and numbers recommended</li>
                <li>• Avoid using personal information</li>
              </ul>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SecurityPage;
