
import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Key, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SecurityPage = () => {
  const [showLoginHistory, setShowLoginHistory] = useState(false);

  const securityOptions = [
    {
      icon: Key,
      title: "Change Password",
      description: "Update your account password",
      link: "/change-password",
      color: "text-blue-500 bg-blue-100"
    },
    {
      icon: Shield,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      link: "#",
      color: "text-green-500 bg-green-100",
      comingSoon: true
    },
    {
      icon: Eye,
      title: "Login Activity",
      description: "View recent login attempts",
      action: () => setShowLoginHistory(!showLoginHistory),
      color: "text-purple-500 bg-purple-100"
    }
  ];

  const loginHistory = [
    { device: "iPhone 12", location: "Mumbai, India", time: "2 hours ago", status: "success" },
    { device: "Chrome Browser", location: "Delhi, India", time: "1 day ago", status: "success" },
    { device: "Android App", location: "Bangalore, India", time: "3 days ago", status: "success" }
  ];

  return (
    <MobileLayout showBackButton title="Security Settings">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30">
        <div className="p-4 space-y-4 pb-20">
          {/* Header */}
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-3" />
              <h1 className="text-xl font-bold mb-2">Account Security</h1>
              <p className="text-green-100">Keep your account safe and secure</p>
            </CardContent>
          </Card>

          {/* Security Options */}
          <div className="space-y-3">
            {securityOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  {option.link && !option.comingSoon ? (
                    <Link to={option.link} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center`}>
                          <option.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{option.title}</h3>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </Link>
                  ) : option.action ? (
                    <button 
                      onClick={option.action}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center`}>
                          <option.icon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{option.title}</h3>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </button>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center`}>
                          <option.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{option.title}</h3>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </div>
                      {option.comingSoon && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Login History */}
          {showLoginHistory && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Login Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{login.device}</p>
                        <p className="text-sm text-gray-500">{login.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600 font-medium">Success</p>
                        <p className="text-xs text-gray-500">{login.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Security Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Use a strong, unique password</li>
                <li>• Enable two-factor authentication when available</li>
                <li>• Don't share your login credentials</li>
                <li>• Log out from shared devices</li>
                <li>• Monitor your account activity regularly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SecurityPage;
