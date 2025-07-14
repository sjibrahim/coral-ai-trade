
import { useState } from "react";
import { Link } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Wallet, 
  CreditCard, 
  UserPlus, 
  Shield, 
  Settings, 
  HeadphonesIcon, 
  LogOut,
  Phone,
  Calendar,
  TrendingUp,
  Gift
} from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  
  const quickActions = [
    { icon: Wallet, label: "Deposit", path: "/deposit", color: "from-emerald-500 to-green-600" },
    { icon: CreditCard, label: "Withdraw", path: "/withdraw", color: "from-blue-500 to-cyan-600" },
    { icon: UserPlus, label: "Invite", path: "/invite", color: "from-purple-500 to-pink-600" },
    { icon: Shield, label: "Security", path: "/security", color: "from-orange-500 to-red-600" }
  ];

  const menuItems = [
    { icon: User, label: "Bank Details", path: "/bank-details" },
    { icon: TrendingUp, label: "Contract Records", path: "/contract-records" },
    { icon: Gift, label: "Rewards", path: "/rewards" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HeadphonesIcon, label: "Support", path: "/support" }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <MobileLayout showBackButton title="Profile">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pb-20">
        <div className="p-4 space-y-4">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold">{user?.name || "User"}</h1>
                    <div className="flex items-center text-emerald-100 text-sm mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      <span>+91 {user?.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-emerald-100 text-sm mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Member since {user?.created_at ? new Date(user.created_at).getFullYear() : "N/A"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Wallet className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-gray-600 text-sm font-medium">Current Balance</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₹{user?.balance || "0.00"}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <h2 className="text-base font-semibold text-gray-800 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Link
                      key={action.path}
                      to={action.path}
                      className="block"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="bg-white rounded-xl p-3 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-300"
                      >
                        <div className="text-center">
                          <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}>
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-gray-700 text-sm font-medium">{action.label}</span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Menu Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <h2 className="text-base font-semibold text-gray-800 mb-3">Account</h2>
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center p-3 rounded-lg hover:bg-emerald-50 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                        <item.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-gray-700 text-base font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </motion.div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
