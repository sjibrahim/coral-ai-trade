
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { toast } from "@/components/ui/use-toast";
import { updateBankDetails } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Interface for IFSC verification response
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
    usdt_address: '',
    bank_name: '' // Added bank_name field
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(accountDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("bank");
  
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
        usdt_address: user.usdt_address || '',
        bank_name: (user as any).bank_name || '' // Access with type assertion
      });
      
      setFormData({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || '',
        usdt_address: user.usdt_address || '',
        bank_name: (user as any).bank_name || '' // Access with type assertion
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
  
  const validateBankForm = () => {
    if (activeTab === "bank") {
      return (
        formData.account_holder_name && 
        formData.account_number && 
        formData.account_ifsc && 
        formData.bank_name && 
        isIfscVerified
      );
    } else {
      return true; // USDT address is optional
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data based on active tab
    if (!validateBankForm()) {
      toast({
        title: "Validation Failed",
        description: activeTab === "bank" 
          ? "Please fill all bank details and verify your IFSC code" 
          : "Please check your details",
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
          title: activeTab === "bank" ? "Bank details updated" : "USDT address updated",
          description: activeTab === "bank" ? 
            "Your bank details have been updated successfully" :
            "Your USDT address has been updated successfully",
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
    <MobileLayout showBackButton title="Payment Details">
      <div className="p-4 animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
            <TabsTrigger value="usdt">USDT Address</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bank">
            {isLoading ? (
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-5 space-y-4 animate-pulse">
                  {[1, 2, 3, 4].map((_, idx) => (
                    <div key={idx}>
                      <div className="h-4 w-32 bg-secondary/40 rounded mb-2"></div>
                      <div className="h-10 w-full bg-secondary/40 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="h-12 w-full bg-secondary/40 rounded-xl"></div>
              </div>
            ) : isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card rounded-xl p-5 space-y-4">
                  <div>
                    <Label htmlFor="account_number">Account Number</Label>
                    <Input
                      id="account_number"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="account_ifsc">IFSC Code</Label>
                      <Button 
                        type="button"
                        onClick={verifyIFSC}
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 bg-primary/20 text-primary"
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
                      className="mt-1"
                      required
                    />
                    
                    {/* IFSC Verification Results */}
                    {ifscError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-sm text-red-600">
                        {ifscError}
                      </div>
                    )}
                    
                    {ifscDetails && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded text-sm">
                        <h4 className="font-medium text-green-800 mb-1">{ifscDetails.BANK}</h4>
                        <p className="text-green-700">{ifscDetails.BRANCH}</p>
                        <p className="text-green-600 text-xs mt-1">{ifscDetails.ADDRESS}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="mt-1 bg-gray-50"
                      required
                      readOnly
                      placeholder="Will be fetched automatically on IFSC verification"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="account_holder_name">Account Holder Name</Label>
                    <Input
                      id="account_holder_name"
                      name="account_holder_name"
                      value={formData.account_holder_name}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !validateBankForm()}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Saving...
                      </span>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-muted-foreground mb-1">Account Number</p>
                    <p className="text-xl">{accountDetails.account_number || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Bank Name</p>
                    <p className="text-xl">{accountDetails.bank_name || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">IFSC Code</p>
                    <p className="text-xl">{accountDetails.account_ifsc || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Account Holder Name</p>
                    <p className="text-xl">{accountDetails.account_holder_name || 'Not set'}</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 h-12 text-lg"
                >
                  Edit Bank Details
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="usdt">
            {isLoading ? (
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-5 space-y-4 animate-pulse">
                  <div>
                    <div className="h-4 w-32 bg-secondary/40 rounded mb-2"></div>
                    <div className="h-10 w-full bg-secondary/40 rounded"></div>
                  </div>
                </div>
                <div className="h-12 w-full bg-secondary/40 rounded-xl"></div>
              </div>
            ) : isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card rounded-xl p-5 space-y-4">
                  <div>
                    <Label htmlFor="usdt_address">USDT Address (TRC20)</Label>
                    <Input
                      id="usdt_address"
                      name="usdt_address"
                      value={formData.usdt_address}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="Enter your TRC20 USDT address"
                    />
                  </div>
                  
                  <div className="text-xs text-amber-500 mt-2">
                    <p>Important: Only enter TRC20 network addresses. Using other networks may result in loss of funds.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Saving...
                      </span>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-5">
                  <div>
                    <p className="text-muted-foreground mb-1">USDT Address (TRC20)</p>
                    <p className="text-lg break-all">{accountDetails.usdt_address || 'Not set'}</p>
                  </div>
                  
                  {!accountDetails.usdt_address && (
                    <div className="mt-4 text-xs text-amber-500">
                      <p>No USDT address set. Please add your address to enable USDT withdrawals.</p>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 h-12 text-lg"
                >
                  {accountDetails.usdt_address ? 'Edit USDT Address' : 'Add USDT Address'}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default BankDetailsPage;
