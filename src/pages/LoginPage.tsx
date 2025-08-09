
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Smartphone, ChevronLeft } from "lucide-react";
import zygoLogo from "@/assets/zygo-logo.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* AI Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #3b82f6 2px, transparent 2px),
                             radial-gradient(circle at 80% 80%, #8b5cf6 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl">
              <img src={zygoLogo} alt="Zygo" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Zygo</h1>
          <p className="text-slate-400 text-sm">AI Trading Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-1">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Sign in to continue trading</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-white">
                Phone Number
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-sm text-slate-400 border-r border-slate-600 pr-2 mr-2">+91</span>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="h-12 pl-14 pr-4 bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-xl text-white placeholder:text-slate-500 transition-all duration-300"
                  maxLength={10}
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Smartphone className="w-4 h-4 text-slate-500" />
                </div>
              </div>
              {formData.phone && formData.phone.length < 10 && (
                <p className="text-xs text-red-400">Please enter 10 digits</p>
              )}
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="h-12 pl-4 pr-12 bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-xl text-white placeholder:text-slate-500 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign Up
              </Link>
            </p>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-blue-400 hover:underline transition-colors">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-400 hover:underline transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 text-center">
          <div className="flex justify-center items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>AI Powered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Fast Trading</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
