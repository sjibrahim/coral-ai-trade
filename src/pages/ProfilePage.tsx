
import MobileLayout from "@/components/layout/MobileLayout";
import { mockUser } from "@/data/mockData";
import ProfileOption from "@/components/ProfileOption";
import { ArrowUpCircle, ArrowDownCircle, Share2, Building, KeySquare, HelpCircle, FileText, LogOut } from "lucide-react";

const ProfilePage = () => {
  return (
    <MobileLayout>
      <div className="animate-fade-in space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-b from-accent/40 to-accent/20 backdrop-blur-sm p-6 rounded-b-3xl">
          <h1 className="text-3xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent font-bold mb-2">
            Welcome Back
          </h1>
          <p className="text-xl font-semibold mb-1">{mockUser.name}</p>
          <p className="text-muted-foreground mb-1">{mockUser.phone}</p>
          <p className="text-muted-foreground mb-4">{mockUser.email}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <div className="w-24 h-24 rounded-full relative">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 p-0.5 bg-gradient-to-r from-blue-500 to-primary rounded-full">
                <img 
                  src={mockUser.avatar} 
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full px-3 py-1 text-xs shadow-lg">
                {mockUser.vipLevel}
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-5 grid grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center gap-2 py-3 text-white shadow-lg shadow-blue-500/20">
            <ArrowDownCircle size={20} />
            <span>Deposit</span>
          </button>
          <button className="bg-card border border-primary/30 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 py-3 shadow-lg">
            <ArrowUpCircle size={20} className="text-primary" />
            <span>Withdrawal</span>
          </button>
        </div>
        
        {/* Account Section */}
        <div className="px-5 space-y-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Account</h2>
          <div className="space-y-3">
            <ProfileOption 
              icon={<Share2 className="h-5 w-5 text-purple-400" />}
              label="Share"
              to="/invite"
              badge="Earn 5%"
            />
            <ProfileOption 
              icon={<Building className="h-5 w-5 text-blue-400" />}
              label="Bank Details"
              to="/bank"
            />
            <ProfileOption 
              icon={<KeySquare className="h-5 w-5 text-amber-400" />}
              label="Password"
              to="/change-password"
            />
            <ProfileOption 
              icon={<HelpCircle className="h-5 w-5 text-green-400" />}
              label="Customer Service"
              to="/support"
              badge="24/7"
            />
          </div>
        </div>
        
        {/* Records Section */}
        <div className="px-5 pt-2 pb-24">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">Records</h2>
          <div className="space-y-3">
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-blue-300" />}
              label="Deposit Record"
              to="/deposit-records"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-green-300" />}
              label="Withdrawal Record"
              to="/withdrawal-records"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-purple-300" />}
              label="Contract Record"
              to="/contract-record"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-amber-300" />}
              label="Commission Record"
              to="/commission-record"
            />
            <ProfileOption 
              icon={<FileText className="h-5 w-5 text-red-300" />}
              label="Salary Record"
              to="/salary-record"
            />
          </div>
          
          <button className="w-full mt-10 bg-gradient-to-r from-red-600/80 to-red-500/80 backdrop-blur-sm shadow-lg shadow-red-500/20 rounded-xl py-4 text-white flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">LOGOUT</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
