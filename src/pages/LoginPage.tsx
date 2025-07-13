
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Smartphone, Shield, Lock, Award, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context not available:", error);
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  const { login, isAuthenticated } = auth;
  const navigate = useNavigate();
  
  if (isAuthenticated) {
    setTimeout(() => navigate("/home", { replace: true }), 0);
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits and limit to 10
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(formData.phone, formData.password);
      
      if (success) {
        toast({
          title: "Welcome back!",
          description: "Login successful",
          duration: 1000,
        });
        
        navigate("/home", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-300/10 to-emerald-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-32 right-16 w-3 h-3 bg-emerald-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-green-300/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-64 right-12 w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header - Moved up */}
        <div className="pt-12 pb-6 px-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg animate-fade-in-scale">
            <img 
              src="https://ik.imagekit.io/spmcumfu9/trexo.jpeg" 
              alt="Trexo Logo" 
              className="w-10 h-10 rounded-xl object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 animate-slide-in-up">
            Trexo
          </h1>
          <p className="text-muted-foreground animate-slide-in-up delay-200">
            Secure Crypto Trading Platform
          </p>
        </div>

        {/* Trust Badges */}
        <div className="px-6 mb-6">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-green-200/50">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-700">Bank Grade Security</span>
            </div>
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-200/50">
              <Lock className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">256-bit Encryption</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-200/50">
              <Award className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Trusted by 1M+</span>
            </div>
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-200/50">
              <Zap className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">Instant Trading</span>
            </div>
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-green-200/50">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-700">RBI Compliant</span>
            </div>
          </div>
        </div>

        {/* Login Form - Positioned higher */}
        <div className="flex-1 px-6 flex items-start justify-center pt-4">
          <div className="w-full max-w-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in-scale">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Phone Field with Indian Country Code */}
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <span className="text-sm font-medium text-gray-500 border-r border-gray-300 pr-3 mr-3">🇮🇳 +91</span>
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      className="h-14 pl-20 pr-12 text-base bg-gray-50/50 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white rounded-2xl transition-all duration-300 group-hover:shadow-md focus:shadow-lg"
                      maxLength={10}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <Smartphone className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                    </div>
                  </div>
                  {formData.phone && formData.phone.length < 10 && (
                    <p className="text-xs text-red-500 ml-1">Please enter 10 digits</p>
                  )}
                </div>
                
                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="h-14 pl-4 pr-12 text-base bg-gray-50/50 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white rounded-2xl transition-all duration-300 group-hover:shadow-md focus:shadow-lg"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-green-500 transition-colors duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex-shrink-0 p-6 text-center space-y-4">
          <p className="text-gray-600">
            New to Trexo?{" "}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-300">
              Create Account
            </Link>
          </p>
          
          <p className="text-xs text-gray-500 leading-relaxed px-4">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-green-600 hover:underline transition-colors duration-300">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-green-600 hover:underline transition-colors duration-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
