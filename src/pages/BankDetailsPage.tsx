import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Save, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateBankDetails } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const BankDetailsPage = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setAccountNumber(user.account_number || "");
      setIfscCode(user.account_ifsc || "");
      setAccountHolderName(user.account_holder_name || user.name || "");
      setBankName((user as any).bank_name || "");
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await updateBankDetails(token, {
        account_number: accountNumber,
        ifsc_code: ifscCode,
        account_holder_name: accountHolderName,
        bank_name: bankName,
      });

      if (response.status) {
        setSaveSuccess(true);
        toast({
          title: "Bank Details Updated",
          description: "Your bank details have been successfully updated.",
        });
        await updateProfile();
        setTimeout(() => {
          setSaveSuccess(false);
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to update bank details.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Update bank details error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update bank details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <MobileLayout showBackButton title="Bank Details">
      <div className="p-4 space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Bank Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input
                type="text"
                id="accountHolderName"
                placeholder="Enter account holder name"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                type="text"
                id="accountNumber"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                type="text"
                id="ifscCode"
                placeholder="Enter IFSC code"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                type="text"
                id="bankName"
                placeholder="Enter bank name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Details
            </>
          )}
        </Button>
      </div>
    </MobileLayout>
  );
};

export default BankDetailsPage;
