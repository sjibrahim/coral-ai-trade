
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { toast } from "@/components/ui/use-toast";
import { updateBankDetails } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CreditCard, Building, User, Hash, CheckCircle, Edit3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface IFSCResponse {
  BRANCH?: string;
  CENTRE?: string;
  DISTRICT?: string;
  STATE?: string;
  ADDRESS?: string;
  BANK?: string;
  IFSC?: string;
  [key: string]: string | boolean | null | undefined;
}

const BankDetailsPage = () => {
  const { user, updateProfile } = useAuth();
  const [accountDetails, setAccountDetails] = useState({
    account_holder_name: '',
    account_number: '',
    account_ifsc: '',
    bank_name: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(accountDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // IFSC verification states
  const [ifscVerifying, setIfscVerifying] = useState(false);
  const [ifscDetails, setIfscDetails] = useState<IFSCResponse | null>(null);
  const [ifscError, setIfscError] = useState<string | null>(null);
  const [isIfscVerified, setIsIfscVerified] = useState(false);
  
  // Load user bank details when component mounts
  useEffect(() => {
    if (user) {
      setAccountDetails({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || '',
        bank_name: (user as any).bank_name || ''
      });
      
      setFormData({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || '',
        bank_name: (user as any).bank_name || '' 
      });
      
      // Set IFSC as verified if it exists
      if (user.account_ifsc) {
        setIsIfscVerified(true);
      }
      
      setIsLoading(false);
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset IFSC verification when IFSC is changed
    if (name === 'account_ifsc') {
      setIfscDetails(null);
      setIfscError(null);
      setIsIfscVerified(false);
    }
  };
  
  // IFSC verification function
  const verifyIFSC = async () => {
    const ifscCode = formData.account_ifsc.trim();
    
    if (!ifscCode) {
      toast({
        title: "IFSC code required",
        description: "Please enter an IFSC code to verify",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIfscVerifying(true);
    setIfscDetails(null);
    setIfscError(null);
    setIsIfscVerified(false);
    
    try {
      const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setIfscError("Invalid IFSC code. Please verify and try again.");
          toast({
            title: "Invalid IFSC Code",
            description: "The IFSC code you entered is invalid. Please check and try again.",
            variant: "destructive",
            duration: 3000,
          });
        } else {
          setIfscError("Error verifying IFSC code. Please try again later.");
          toast({
            title: "Verification Failed",
            description: "Unable to verify IFSC code. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
        setIfscDetails(null);
      } else {
        const data: IFSCResponse = await response.json();
        setIfscDetails(data);
        setIfscError(null);
        setIsIfscVerified(true);
        
        // Set bank name from API response
        if (data.BANK) {
          setFormData(prev => ({ ...prev, bank_name: data.BANK }));
        }
        
        toast({
          title: "IFSC Code Verified",
          description: `Successfully verified IFSC code for ${data.BANK}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error verifying IFSC:", error);
      setIfscError("Error connecting to verification service. Please try again later.");
      setIfscDetails(null);
      toast({
        title: "Verification Error",
        description: "Error connecting to the verification service. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIfscVerifying(false);
    }
  };
  
  const validateForm = () => {
    return (
      formData.account_holder_name && 
      formData.account_number && 
      formData.account_ifsc && 
      formData.bank_name && 
      isIfscVerified
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Failed",
        description: "Please fill all bank details and verify your IFSC code",
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
      
      const response = await updateBankDetails(token, formData);
      
      if (response.status) {
        setAccountDetails(formData);
        setIsEditing(false);
        
        // Update user profile to get latest data
        await updateProfile();
        
        toast({
          title: "Bank details updated",
          description: "Your bank details have been updated successfully",
          duration: 3000,
        });
      } else {
        toast({
          title: "Update failed",
          description: response.msg || "Failed to update details",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating details:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating details",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MobileLayout showBackButton title="Bank Details" hideNavbar>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 space-y-4">
          {/* Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white border-0 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">Bank Account</h1>
                    <p className="text-xs text-emerald-100">Secure your withdrawal destination</p>
                  </div>
                </div>
                
                <div className="flex justify-center items-center gap-4 text-xs">
                  <div className="flex items-center text-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    <span>256-bit Encrypted</span>
                  </div>
                  <div className="flex items-center text-emerald-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    <span>Bank Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-20"
            >
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </motion.div>
          ) : isEditing ? (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Form Fields */}
              <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
                <CardContent className="p-4 space-y-4">
                  {/* Account Holder Name */}
                  <div>
                    <Label htmlFor="account_holder_name" className="text-gray-700 text-xs mb-1 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      Account Holder Name
                    </Label>
                    <Input
                      id="account_holder_name"
                      name="account_holder_name"
                      value={formData.account_holder_name}
                      onChange={handleChange}
                      className="bg-white border-gray-200 text-gray-900 text-sm"
                      required
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <Label htmlFor="account_number" className="text-gray-700 text-xs mb-1 flex items-center">
                      <Hash className="w-3 h-3 mr-1" />
                      Account Number
                    </Label>
                    <Input
                      id="account_number"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleChange}
                      className="bg-white border-gray-200 text-gray-900 text-sm"
                      required
                    />
                  </div>
                  
                  {/* IFSC Code */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="account_ifsc" className="text-gray-700 text-xs flex items-center">
                        <Hash className="w-3 h-3 mr-1" />
                        IFSC Code
                      </Label>
                      <Button 
                        type="button"
                        onClick={verifyIFSC}
                        variant="outline"
                        size="sm"
                        className={`text-xs px-2 py-1 h-6 ${
                          isIfscVerified 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                        disabled={ifscVerifying || !formData.account_ifsc}
                      >
                        {ifscVerifying ? (
                          <span className="flex items-center">
                            <Loader2 size={10} className="animate-spin mr-1" />
                            Verifying...
                          </span>
                        ) : isIfscVerified ? "Verified ✓" : "Verify IFSC"}
                      </Button>
                    </div>
                    <Input
                      id="account_ifsc"
                      name="account_ifsc"
                      value={formData.account_ifsc}
                      onChange={handleChange}
                      className="bg-white border-gray-200 text-gray-900 text-sm"
                      required
                    />
                    
                    {/* IFSC Verification Results */}
                    {ifscError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-xs">{ifscError}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Bank Name */}
                  <div>
                    <Label htmlFor="bank_name" className="text-gray-700 text-xs mb-1 flex items-center">
                      <Building className="w-3 h-3 mr-1" />
                      Bank Name
                    </Label>
                    <Input
                      id="bank_name"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="bg-gray-50 border-gray-200 text-gray-600 text-sm"
                      required
                      readOnly
                      placeholder="Will be fetched automatically on IFSC verification"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 text-sm"
                  disabled={isSubmitting || !validateForm()}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Saving...
                    </span>
                  ) : (
                    "Save Details"
                  )}
                </Button>
              </div>
            </motion.form>
          ) : (
            /* Display Mode */
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
                <CardContent className="p-4 space-y-4">
                  {[
                    { icon: User, label: "Account Holder", value: accountDetails.account_holder_name },
                    { icon: Hash, label: "Account Number", value: accountDetails.account_number },
                    { icon: Hash, label: "IFSC Code", value: accountDetails.account_ifsc },
                    { icon: Building, label: "Bank Name", value: accountDetails.bank_name }
                  ].map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                          <detail.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">{detail.label}</p>
                          <p className="text-gray-900 font-medium text-sm">{detail.value || 'Not set'}</p>
                        </div>
                      </div>
                      {detail.value && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg border-0"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {accountDetails.account_number ? 'Edit Bank Details' : 'Add Bank Details'}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default BankDetailsPage;
