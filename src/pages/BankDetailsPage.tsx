
import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { toast } from "@/components/ui/use-toast";
import { updateBankDetails } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const BankDetailsPage = () => {
  const { user, updateProfile } = useAuth();
  const [accountDetails, setAccountDetails] = useState({
    account_holder_name: '',
    account_number: '',
    account_ifsc: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(accountDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load user bank details when component mounts
  useEffect(() => {
    if (user) {
      setAccountDetails({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || ''
      });
      
      setFormData({
        account_holder_name: user.account_holder_name || '',
        account_number: user.account_number || '',
        account_ifsc: user.account_ifsc || ''
      });
      
      setIsLoading(false);
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.account_holder_name || !formData.account_number || !formData.account_ifsc) {
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
          title: "Bank details updated",
          description: "Your bank details have been updated successfully",
          duration: 3000,
        });
      } else {
        toast({
          title: "Update failed",
          description: response.msg || "Failed to update bank details",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating bank details",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MobileLayout showBackButton title="Bank Details">
      <div className="p-4 animate-fade-in">
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
              Edit Details
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default BankDetailsPage;
