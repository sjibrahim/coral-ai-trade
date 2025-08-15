
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/services/api";
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
  MapPin
} from "lucide-react";

const BankDetailsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    bank_name: '',
    branch_name: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.token) return;
      
      try {
        setIsLoading(true);
        const response = await getUserProfile(user.token);
        
        if (response.status && response.data) {
          setFormData({
            account_holder_name: response.data.account_holder_name || '',
            account_number: response.data.account_number || '',
            ifsc_code: response.data.ifsc_code || '',
            bank_name: response.data.bank_name || '',
            branch_name: response.data.branch_name || ''
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.token]);

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
    if (!formData.account_holder_name || !formData.account_number || !formData.ifsc_code || !formData.bank_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateUserProfile(user.token, formData);
      
      if (response.status) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          <div className="relative px-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Landmark className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Bank Account</h1>
              <p className="text-gray-400">Secure your financial information</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="px-6 -mt-4 mb-6">
          <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Bank details are encrypted</p>
                  <p className="text-xs text-gray-400">Your information is protected with advanced security</p>
                </div>
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="px-6 space-y-6">
          {/* Account Holder Name */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <Label htmlFor="account_holder_name" className="text-sm font-medium text-gray-300">
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
                  className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Number */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-400" />
                  <Label htmlFor="account_number" className="text-sm font-medium text-gray-300">
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
                  className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* IFSC Code */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <Label htmlFor="ifsc_code" className="text-sm font-medium text-gray-300">
                    IFSC Code *
                  </Label>
                </div>
                <Input
                  id="ifsc_code"
                  name="ifsc_code"
                  type="text"
                  placeholder="Enter IFSC code (e.g., SBIN0001234)"
                  value={formData.ifsc_code}
                  onChange={handleInputChange}
                  className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Name */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-400" />
                  <Label htmlFor="bank_name" className="text-sm font-medium text-gray-300">
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
                  className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Branch Name */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <Label htmlFor="branch_name" className="text-sm font-medium text-gray-300">
                    Branch Name
                  </Label>
                </div>
                <Input
                  id="branch_name"
                  name="branch_name"
                  type="text"
                  placeholder="Enter branch name (optional)"
                  value={formData.branch_name}
                  onChange={handleInputChange}
                  className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20"
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
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Bank Details
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
