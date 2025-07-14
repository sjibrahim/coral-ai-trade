
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Shield, Lock, Key } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { updatePassword } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

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
    <MobileLayout showBackButton title="Security Settings">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pb-20">
        <div className="p-4 space-y-4">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-lg font-bold">Security Settings</h1>
                    <p className="text-emerald-100 text-sm">Change your password</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Password Change Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Change Password</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <label className="block text-gray-700 mb-2 text-sm font-medium">Current Password</label>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-50 p-3 pr-10 rounded-lg text-base border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                      required
                      placeholder="Enter current password"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-10 text-gray-400 hover:text-emerald-600 transition-colors"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-gray-700 mb-2 text-sm font-medium">New Password</label>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-50 p-3 pr-10 rounded-lg text-base border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                      required
                      placeholder="Enter new password"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-10 text-gray-400 hover:text-emerald-600 transition-colors"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-gray-700 mb-2 text-sm font-medium">Confirm New Password</label>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-50 p-3 pr-10 rounded-lg text-base border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                      required
                      placeholder="Confirm new password"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-10 text-gray-400 hover:text-emerald-600 transition-colors"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center text-yellow-700 text-sm">
                      <Lock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Password must be at least 8 characters long</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        UPDATING PASSWORD...
                      </span>
                    ) : (
                      "UPDATE PASSWORD"
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SecurityPage;
