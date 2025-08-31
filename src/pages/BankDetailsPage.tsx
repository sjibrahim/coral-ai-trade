
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { updateBankDetails } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Save, 
  Hash,
  Landmark
} from "lucide-react";

const BankDetailsPage = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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
        bank_name: '',
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
      const response = await updateBankDetails(user.token, formData);
      
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
      <div className="min-h-screen bg-background p-4">
        {/* Header */}
        <div className="text-center mb-8 mt-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
            <Landmark className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Bank Account</h1>
          <p className="text-muted-foreground">Add your bank details for withdrawals</p>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          {/* Account Holder Name */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <Label htmlFor="account_holder_name" className="text-base font-medium text-foreground">
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
                  className="h-12 text-base"
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Number */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-primary" />
                  </div>
                  <Label htmlFor="account_number" className="text-base font-medium text-foreground">
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
                  className="h-12 text-base"
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
