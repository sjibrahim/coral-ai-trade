import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { updateBankDetails } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  CreditCard, 
  User, 
  Save, 
  Shield, 
  Lock,
  CheckCircle,
  AlertCircle,
  Landmark,
  Hash,
  MapPin,
  Sparkles,
  ArrowRight
} from "lucide-react";

const BankDetailsPage = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_number: '',
    account_ifsc: '',
    bank_name: '',
    usdt_address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || '',
        bank_name: '', // Remove reference to user.bank_name since it doesn't exist in User type
        usdt_address: user.usdt_address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.token) return;

    // Validate required fields
    if (!formData.account_holder_name || !formData.account_number || !formData.account_ifsc || !formData.bank_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateBankDetails(user.token, formData);
      
      if (response.status) {
        // Update user profile to get latest data
        await updateProfile();
        toast({
          title: "Success",
          description: "Bank details updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to update bank details",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating bank details",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MobileLayout showBackButton title="Bank Details">
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
          <div className="relative px-6 py-12">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-lg opacity-60 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Landmark className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Bank Account</h1>
              <p className="text-gray-400 text-lg">Secure your financial gateway</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="px-6 -mt-6 mb-8">
          <Card className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border-emerald-500/20 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-lg animate-pulse" />
                  <div className="relative w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Shield className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-white flex items-center gap-2">
                    Bank details are encrypted
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </p>
                  <p className="text-gray-400 mt-1">Protected with military-grade security</p>
                </div>
                <Lock className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="px-6 space-y-6">
          {/* Account Holder Name */}
          <Card className="bg-gray-900/40 border-gray-700/30 backdrop-blur-xl shadow-2xl hover:bg-gray-900/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <Label htmlFor="account_holder_name" className="text-lg font-medium text-gray-200">
                    Account Holder Name *
                  </Label>
                </div>
                <Input
                  id="account_holder_name"
                  name="account_holder_name"
                  type="text"
                  placeholder="Enter full name as per bank records"
                  value={formData.account_holder_name}
                  onChange={handleInputChange}
                  className="h-14 bg-gray-950/50 border-gray-600/50 text-white text-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-inner"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Number */}
          <Card className="bg-gray-900/40 border-gray-700/30 backdrop-blur-xl shadow-2xl hover:bg-gray-900/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Hash className="w-5 h-5 text-purple-400" />
                  </div>
                  <Label htmlFor="account_number" className="text-lg font-medium text-gray-200">
                    Account Number *
                  </Label>
                </div>
                <Input
                  id="account_number"
                  name="account_number"
                  type="text"
                  placeholder="Enter your bank account number"
                  value={formData.account_number}
                  onChange={handleInputChange}
                  className="h-14 bg-gray-950/50 border-gray-600/50 text-white text-lg placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl shadow-inner"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* IFSC Code */}
          <Card className="bg-gray-900/40 border-gray-700/30 backdrop-blur-xl shadow-2xl hover:bg-gray-900/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <Label htmlFor="account_ifsc" className="text-lg font-medium text-gray-200">
                    IFSC Code *
                  </Label>
                </div>
                <Input
                  id="account_ifsc"
                  name="account_ifsc"
                  type="text"
                  placeholder="Enter IFSC code (e.g., SBIN0001234)"
                  value={formData.account_ifsc}
                  onChange={handleInputChange}
                  className="h-14 bg-gray-950/50 border-gray-600/50 text-white text-lg placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl shadow-inner"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Name */}
          <Card className="bg-gray-900/40 border-gray-700/30 backdrop-blur-xl shadow-2xl hover:bg-gray-900/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-400" />
                  </div>
                  <Label htmlFor="bank_name" className="text-lg font-medium text-gray-200">
                    Bank Name *
                  </Label>
                </div>
                <Input
                  id="bank_name"
                  name="bank_name"
                  type="text"
                  placeholder="Enter your bank name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  className="h-14 bg-gray-950/50 border-gray-600/50 text-white text-lg placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl shadow-inner"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* USDT Address */}
          <Card className="bg-gray-900/40 border-gray-700/30 backdrop-blur-xl shadow-2xl hover:bg-gray-900/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-yellow-400" />
                  </div>
                  <Label htmlFor="usdt_address" className="text-lg font-medium text-gray-200">
                    USDT Address
                  </Label>
                </div>
                <Input
                  id="usdt_address"
                  name="usdt_address"
                  type="text"
                  placeholder="Enter USDT wallet address (optional)"
                  value={formData.usdt_address}
                  onChange={handleInputChange}
                  className="h-14 bg-gray-950/50 border-gray-600/50 text-white text-lg placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl shadow-inner"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="pb-8">
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="w-full h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl disabled:opacity-50 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
              {isSaving ? (
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Changes...
                </div>
              ) : (
                <div className="flex items-center gap-3 relative z-10">
                  <Save className="w-6 h-6" />
                  Save Bank Details
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default BankDetailsPage;
