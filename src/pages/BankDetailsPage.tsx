import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { updateBankDetails } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Save, CreditCard, Building2, User, Shield } from "lucide-react";

const BankDetailsPage = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_number: '',
    account_ifsc: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For account number, only allow digits
    if (name === 'account_number') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.token) return;

    // Validate required fields
    if (!formData.account_holder_name || !formData.account_number || !formData.account_ifsc) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateBankDetails(user.token, {
        ...formData,
        bank_name: '',
        usdt_address: user.usdt_address || ''
      });
      
      if (response.status) {
        await updateProfile();
        toast({
          title: "Success",
          description: "Bank details updated successfully",
        });
        navigate("/home");
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

  const isValidForm = formData.account_holder_name && formData.account_number && formData.account_ifsc;

  return (
    <MobileLayout 
      showBackButton 
      title="Bank Details" 
      hideFooter
      headerAction={
        <button
          onClick={() => navigate("/home")}
          className="text-white hover:bg-gray-800 rounded-lg transition-colors p-2"
        >
          Home
        </button>
      }
    >
      <div className="min-h-screen bg-gray-900 flex flex-col">
        
        <div className="flex-1 px-4 py-6 space-y-4 pb-24">

          {/* Header Section */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="text-center mb-3">
              <div className="flex items-center justify-center mb-2">
                <CreditCard className="w-6 h-6 text-[#00e8be] mr-2" />
                <h2 className="text-white font-semibold text-lg">Bank Account Details</h2>
              </div>
              <p className="text-gray-400 text-sm">
                Add your bank details for withdrawals
              </p>
            </div>
          </div>

          {/* Account Holder Name */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-3">
              <User className="w-4 h-4 text-[#00e8be] mr-2" />
              <Label htmlFor="account_holder_name" className="text-white font-medium text-sm">
                Account Holder Name
              </Label>
            </div>
            <Input
              id="account_holder_name"
              name="account_holder_name"
              type="text"
              placeholder="Enter full name as per bank records"
              value={formData.account_holder_name}
              onChange={handleInputChange}
              className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-[#00e8be] focus:ring-1 focus:ring-[#00e8be] h-12"
              disabled={isSaving}
            />
          </div>

          {/* Account Number */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-3">
              <CreditCard className="w-4 h-4 text-[#00e8be] mr-2" />
              <Label htmlFor="account_number" className="text-white font-medium text-sm">
                Account Number
              </Label>
            </div>
            <Input
              id="account_number"
              name="account_number"
              type="text"
              inputMode="numeric"
              placeholder="Enter your bank account number"
              value={formData.account_number}
              onChange={handleInputChange}
              className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-[#00e8be] focus:ring-1 focus:ring-[#00e8be] h-12"
              disabled={isSaving}
            />
          </div>

          {/* IFSC Code */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-3">
              <Building2 className="w-4 h-4 text-[#00e8be] mr-2" />
              <Label htmlFor="account_ifsc" className="text-white font-medium text-sm">
                IFSC Code
              </Label>
            </div>
            <Input
              id="account_ifsc"
              name="account_ifsc"
              type="text"
              placeholder="Enter IFSC code (e.g., SBIN0000123)"
              value={formData.account_ifsc}
              onChange={handleInputChange}
              className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-[#00e8be] focus:ring-1 focus:ring-[#00e8be] h-12"
              disabled={isSaving}
            />
          </div>

          {/* Security Notice */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700/30 p-3">
            <div className="flex items-center mb-2">
              <Shield className="w-4 h-4 text-green-400 mr-2" />
              <h4 className="text-green-400 font-medium text-sm">Secure & Protected</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Your bank details are encrypted and stored securely. This information is only used for withdrawal processing.
            </p>
          </div>

          {/* Important Note */}
          <div className="bg-blue-900/20 rounded-lg border border-blue-700/30 p-3">
            <div className="flex items-center mb-2">
              <CreditCard className="w-4 h-4 text-blue-400 mr-2" />
              <h4 className="text-blue-400 font-medium text-sm">Important Notes</h4>
            </div>
            <div className="space-y-1">
              <p className="text-blue-300 text-xs">• Ensure account holder name matches your profile name</p>
              <p className="text-blue-300 text-xs">• Double-check account number and IFSC code</p>
              <p className="text-blue-300 text-xs">• Only Indian bank accounts are supported</p>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Save Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700/50 p-4">
          <button
            onClick={handleSave}
            disabled={!isValidForm || isSaving}
            className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center text-base ${
              isValidForm && !isSaving
                ? "bg-[#00e8be] text-gray-900 hover:shadow-lg hover:shadow-[#00e8be]/25 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Bank Details
              </>
            )}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default BankDetailsPage;
