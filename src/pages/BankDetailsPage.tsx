
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { toast } from "@/components/ui/use-toast";
import { updateBankDetails } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BankDetailsPage = () => {
  const { user, updateProfile } = useAuth();
  const [accountDetails, setAccountDetails] = useState({
    account_holder_name: '',
    account_number: '',
    account_ifsc: '',
    usdt_address: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(accountDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("bank");
  
  // Load user bank details when component mounts
  useEffect(() => {
    if (user) {
      setAccountDetails({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || '',
        usdt_address: user.usdt_address || ''
      });
      
      setFormData({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || '',
        usdt_address: user.usdt_address || ''
      });
      
      setIsLoading(false);
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateBankForm = () => {
    if (activeTab === "bank") {
      return formData.account_holder_name && formData.account_number && formData.account_ifsc;
    } else {
      return true; // USDT address is optional
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data based on active tab
    if (!validateBankForm()) {
      toast({
        title: "All fields are required",
        description: "Please fill all bank details",
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
                    <label className="block text-muted-foreground mb-2">Account Number</label>
                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleChange}
                      className="w-full bg-muted p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-muted-foreground mb-2">IFSC Code</label>
                    <input
                      type="text"
                      name="account_ifsc"
                      value={formData.account_ifsc}
                      onChange={handleChange}
                      className="w-full bg-muted p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-muted-foreground mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      name="account_holder_name"
                      value={formData.account_holder_name}
                      onChange={handleChange}
                      className="w-full bg-muted p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-3 rounded-xl bg-card border border-muted text-lg"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 rounded-xl bg-primary text-white text-lg"
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
                  </button>
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
                    <p className="text-muted-foreground mb-1">IFSC Code</p>
                    <p className="text-xl">{accountDetails.account_ifsc || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Account Holder Name</p>
                    <p className="text-xl">{accountDetails.account_holder_name || 'Not set'}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 rounded-xl bg-primary text-white text-lg"
                >
                  Edit Bank Details
                </button>
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
                    <label className="block text-muted-foreground mb-2">USDT Address (TRC20)</label>
                    <input
                      type="text"
                      name="usdt_address"
                      value={formData.usdt_address}
                      onChange={handleChange}
                      className="w-full bg-muted p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your TRC20 USDT address"
                    />
                  </div>
                  
                  <div className="text-xs text-amber-500 mt-2">
                    <p>Important: Only enter TRC20 network addresses. Using other networks may result in loss of funds.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-3 rounded-xl bg-card border border-muted text-lg"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 rounded-xl bg-primary text-white text-lg"
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
                  </button>
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
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 rounded-xl bg-primary text-white text-lg"
                >
                  {accountDetails.usdt_address ? 'Edit USDT Address' : 'Add USDT Address'}
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default BankDetailsPage;
