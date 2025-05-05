
import MobileLayout from "@/components/layout/MobileLayout";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const BankDetailsPage = () => {
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '8054426413',
    ifscCode: 'AIRP0000001',
    name: 'Karan Deep Singh',
    bankName: 'Sample Bank'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(accountDetails);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountDetails(formData);
    setIsEditing(false);
    toast({
      title: "Bank details updated",
      description: "Your bank details have been updated successfully",
      duration: 3000,
    });
  };
  
  return (
    <MobileLayout showBackButton title="Bank Details">
      <div className="p-4 animate-fade-in">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-xl p-5 space-y-4">
              <div>
                <label className="block text-muted-foreground mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full bg-muted p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-2">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="w-full bg-muted p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-2">Account Holder Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-muted p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-2">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
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
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-3 rounded-xl bg-primary text-white text-lg"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-5 space-y-4">
              <div>
                <p className="text-muted-foreground mb-1">Account Number</p>
                <p className="text-xl">{accountDetails.accountNumber}</p>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-1">IFSC Code</p>
                <p className="text-xl">{accountDetails.ifscCode}</p>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-1">Account Holder Name</p>
                <p className="text-xl">{accountDetails.name}</p>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-1">Bank Name</p>
                <p className="text-xl">{accountDetails.bankName}</p>
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
