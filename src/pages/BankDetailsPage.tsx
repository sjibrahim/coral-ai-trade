
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { updateBankDetails } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const BankDetailsPage = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_number: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || ''
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
    if (!formData.account_holder_name || !formData.account_number) {
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
        account_ifsc: user.account_ifsc || '',
        bank_name: '',
        usdt_address: user.usdt_address || ''
      });
      
      if (response.status) {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-sm space-y-6">
            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="account_holder_name" className="text-white/90 text-sm font-medium">
                Account Holder Name
              </Label>
              <Input
                id="account_holder_name"
                name="account_holder_name"
                type="text"
                placeholder="Enter full name"
                value={formData.account_holder_name}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/20"
                disabled={isSaving}
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="account_number" className="text-white/90 text-sm font-medium">
                Account Number
              </Label>
              <Input
                id="account_number"
                name="account_number"
                type="text"
                placeholder="Enter account number"
                value={formData.account_number}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/20"
                disabled={isSaving}
              />
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save
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
