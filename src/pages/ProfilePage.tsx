
import MobileLayout from "@/components/layout/MobileLayout";
import { mockUser } from "@/data/mockData";
import ProfileOption from "@/components/ProfileOption";
import { ArrowUpCircle, ArrowDownCircle, Share2, Building, Lock, HelpCircle, FileText } from "lucide-react";

const ProfilePage = () => {
  return (
    <MobileLayout>
      <div className="animate-fade-in">
        {/* Profile Header */}
        <div className="bg-accent/30 p-6 rounded-b-3xl">
          <h1 className="text-3xl text-primary mb-2">Welcome Back</h1>
          <p className="text-xl font-semibold mb-1">{mockUser.name}</p>
          <p className="text-muted-foreground mb-1">{mockUser.phone}</p>
          <p className="text-muted-foreground mb-4">{mockUser.email}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <div className="w-24 h-24 rounded-full relative">
              <img 
                src={mockUser.avatar} 
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-muted"
              />
              <div className="absolute bottom-0 right-0 bg-black rounded-full px-3 py-1 text-xs">
                {mockUser.vipLevel}
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-5 grid grid-cols-2 gap-4">
          <button className="bg-primary rounded-xl flex items-center justify-center gap-2 py-3 text-white">
            <ArrowDownCircle size={20} />
            <span>Deposit</span>
          </button>
          <button className="bg-card border border-primary rounded-xl flex items-center justify-center gap-2 py-3">
            <ArrowUpCircle size={20} />
            <span>Withdrawal</span>
          </button>
        </div>
        
        {/* Account Section */}
        <div className="px-5">
          <h2 className="text-xl mb-4">Account</h2>
          <div className="space-y-4">
            <ProfileOption 
              icon={<Share2 className="h-5 w-5" />}
              label="Share"
              to="/invite"
            />
            <ProfileOption 
              icon={<Building className="h-5 w-5" />}
              label="Bank Details"
              to="/bank"
            />
            <ProfileOption 
              icon={<Lock className="h-5 w-5" />}
              label="Password"
              to="/change-password"
            />
            <ProfileOption 
              icon={<HelpCircle className="h-5 w-5" />}
              label="Customer Service"
              to="/support"
            />
          </div>
        </div>
        
        {/* Records Section */}
        <div className="px-5 pt-8 pb-24">
          <h2 className="text-xl mb-4">Records</h2>
          <div className="space-y-4">
            <ProfileOption 
              icon={<FileText className="h-5 w-5" />}
              label="Deposit Record"
              to="/deposit-records"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5" />}
              label="Withdrawal Record"
              to="/withdrawal-records"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5" />}
              label="Contract Record"
              to="/contract-record"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5" />}
              label="Commission Record"
              to="/commission-record"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5" />}
              label="Salary Record"
              to="/salary-record"
            />
          </div>
          
          <button className="w-full bg-primary rounded-xl py-4 text-white mt-10">
            LOGOUT
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
