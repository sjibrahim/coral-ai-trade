
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 space-y-6">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Bank Account</h1>
            <p className="text-purple-200 text-sm">Secure your withdrawal destination</p>
            
            <div className="flex justify-center items-center mt-4 space-x-4 text-xs">
              <div className="flex items-center text-green-300">
                <Shield className="w-3 h-3 mr-1" />
                <span>256-bit Encrypted</span>
              </div>
              <div className="flex items-center text-blue-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>Bank Verified</span>
              </div>
            </div>
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-20"
            >
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </motion.div>
          ) : isEditing ? (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Form Fields */}
              <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl">
                <CardContent className="p-6 space-y-6">
                  {/* Account Holder Name */}
                  <div>
                    <Label htmlFor="account_holder_name" className="text-white mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Account Holder Name
                    </Label>
                    <Input
                      id="account_holder_name"
                      name="account_holder_name"
                      value={formData.account_holder_name}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <Label htmlFor="account_number" className="text-white mb-2 flex items-center">
                      <Hash className="w-4 h-4 mr-2" />
                      Account Number
                    </Label>
                    <Input
                      id="account_number"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                  
                  {/* IFSC Code */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="account_ifsc" className="text-white flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        IFSC Code
                      </Label>
                      <Button 
                        type="button"
                        onClick={verifyIFSC}
                        variant="outline"
                        size="sm"
                        className={`text-xs px-3 py-1 ${
                          isIfscVerified 
                            ? "bg-green-500/20 text-green-300 border-green-400/30" 
                            : "bg-purple-500/20 text-purple-300 border-purple-400/30"
                        }`}
                        disabled={ifscVerifying || !formData.account_ifsc}
                      >
                        {ifscVerifying ? (
                          <span className="flex items-center">
                            <Loader2 size={12} className="animate-spin mr-1" />
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
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    
                    {/* IFSC Verification Results */}
                    {ifscError && (
                      <div className="mt-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                        <p className="text-red-300 text-sm">{ifscError}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Bank Name */}
                  <div>
                    <Label htmlFor="bank_name" className="text-white mb-2 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Bank Name
                    </Label>
                    <Input
                      id="bank_name"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="bg-white/5 border-white/20 text-gray-400"
                      required
                      readOnly
                      placeholder="Will be fetched automatically on IFSC verification"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
                  disabled={isSubmitting || !validateForm()}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl">
                <CardContent className="p-6 space-y-6">
                  {[
                    { icon: User, label: "Account Holder", value: accountDetails.account_holder_name },
                    { icon: Hash, label: "Account Number", value: accountDetails.account_number },
                    { icon: Hash, label: "IFSC Code", value: accountDetails.account_ifsc },
                    { icon: Building, label: "Bank Name", value: accountDetails.bank_name }
                  ].map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                          <detail.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-300 text-sm">{detail.label}</p>
                          <p className="text-white font-medium">{detail.value || 'Not set'}</p>
                        </div>
                      </div>
                      {detail.value && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-2xl border-0"
              >
                <Edit3 className="w-5 h-5 mr-2" />
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
