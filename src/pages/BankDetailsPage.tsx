import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { updateBankDetails } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CreditCard, Building, User, Hash, CheckCircle, Edit3, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
    console.log("BankDetailsPage: User data:", user);
    
    if (user) {
      const details = {
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || '',
        bank_name: (user as any).bank_name || ''
      };
      
      console.log("BankDetailsPage: Setting account details:", details);
      
      setAccountDetails(details);
      setFormData(details);
      
      // Set IFSC as verified if it exists
      if (user.account_ifsc) {
        setIsIfscVerified(true);
      }
      
      setIsLoading(false);
    } else {
      console.log("BankDetailsPage: No user data available");
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Bank Details</h1>
            <p className="text-sm text-gray-400">Secure withdrawal destination</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields */}
            <div className="bg-gray-800/50 rounded-xl p-4 space-y-4">
              {/* Account Holder Name */}
              <div>
                <Label className="text-gray-300 text-sm mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Account Holder Name
                </Label>
                <Input
                  name="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* Account Number */}
              <div>
                <Label className="text-gray-300 text-sm mb-2 flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  Account Number
                </Label>
                <Input
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              {/* IFSC Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-300 text-sm flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    IFSC Code
                  </Label>
                  <Button 
                    type="button"
                    onClick={verifyIFSC}
                    variant="outline"
                    size="sm"
                    className={`text-xs px-3 py-1 h-7 ${
                      isIfscVerified 
                        ? "bg-green-500/20 text-green-400 border-green-500/30" 
                        : "bg-teal-500/20 text-teal-400 border-teal-500/30"
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
                  name="account_ifsc"
                  value={formData.account_ifsc}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                
                {/* IFSC Verification Results */}
                {ifscError && (
                  <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{ifscError}</p>
                  </div>
                )}
              </div>
              
              {/* Bank Name */}
              <div>
                <Label className="text-gray-300 text-sm mb-2 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Bank Name
                </Label>
                <Input
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  className="bg-gray-600 border-gray-500 text-gray-300"
                  required
                  readOnly
                  placeholder="Will be fetched automatically on IFSC verification"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white border-0"
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
          </form>
        ) : (
          /* Display Mode */
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4 space-y-4">
              {[
                { icon: User, label: "Account Holder", value: accountDetails.account_holder_name },
                { icon: Hash, label: "Account Number", value: accountDetails.account_number },
                { icon: Hash, label: "IFSC Code", value: accountDetails.account_ifsc },
                { icon: Building, label: "Bank Name", value: accountDetails.bank_name }
              ].map((detail, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                      <detail.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{detail.label}</p>
                      <p className="text-white font-medium">{detail.value || 'Not set'}</p>
                    </div>
                  </div>
                  {detail.value && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
              ))}
            </div>
            
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full h-12 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white font-medium rounded-xl"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {accountDetails.account_number ? 'Edit Bank Details' : 'Add Bank Details'}
            </Button>

            {/* Security Notice */}
            <div className="bg-gray-800/30 rounded-xl p-4 mt-6">
              <div className="flex items-center mb-2">
                <Shield className="w-4 h-4 text-teal-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">Security Notice</span>
              </div>
              <p className="text-xs text-gray-400">
                Your bank details are encrypted and securely stored. Only you can view and modify this information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankDetailsPage;
